const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

const db = admin.firestore();
const ORDERS_COLLECTION = "orders";
const PRODUCTS_COLLECTION = "products";

// Use Stripe secret from environment (set via: firebase functions:config:set stripe.secret="sk_..." or .env)
const stripeSecret = process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2023-10-16" }) : null;

/**
 * Create a Stripe Checkout Session for an existing order.
 * Client must create the order in Firestore with status "pending_payment" first, then call this with orderId.
 */
exports.createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!stripe) {
    throw new functions.https.HttpsError("failed-precondition", "Stripe is not configured. Set stripe.secret in config.");
  }
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { orderId } = data;
  if (!orderId || typeof orderId !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "orderId is required.");
  }

  const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Order not found.");
  }

  const order = orderSnap.data();
  if (order.userId !== context.auth.uid) {
    throw new functions.https.HttpsError("permission-denied", "Order does not belong to you.");
  }
  if (order.status !== "pending_payment") {
    throw new functions.https.HttpsError("failed-precondition", "Order is not pending payment.");
  }

  const origin = data.origin || "https://mindglow-wellness.web.app";
  const successUrl = `${origin}/#store?checkout=success&session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`;
  const cancelUrl = `${origin}/#store?checkout=cancelled`;

  const lineItems = (order.items || []).map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title || "Item",
        description: item.quantity > 1 ? `Qty: ${item.quantity}` : undefined,
      },
      unit_amount: Math.round(Number(item.price || 0) * 100),
    },
    quantity: item.quantity,
  }));

  if (order.tax > 0 || order.shipping > 0) {
    const taxAndShipping = (Number(order.tax) || 0) + (Number(order.shipping) || 0);
    if (taxAndShipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Tax & Shipping" },
          unit_amount: Math.round(taxAndShipping * 100),
        },
        quantity: 1,
      });
    }
  }

  if (order.discount > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Discount" },
        unit_amount: -Math.round(Number(order.discount) * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: orderId,
    customer_email: order.userEmail || undefined,
    metadata: {
      orderId,
      userId: order.userId || "",
    },
  });

  await orderRef.update({
    stripeSessionId: session.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { url: session.url, sessionId: session.id };
});

/**
 * Stripe webhook: when checkout.session.completed, mark order as paid and decrement stock.
 * In Stripe Dashboard: Developers > Webhooks > Add endpoint, URL = this function's URL, event = checkout.session.completed.
 * Set STRIPE_WEBHOOK_SECRET in Firebase config or env.
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || functions.config().stripe?.webhook_secret;
  if (!webhookSecret || !stripe) {
    console.error("Stripe webhook secret or Stripe not configured");
    res.status(500).end();
    return;
  }

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type !== "checkout.session.completed") {
    res.status(200).end();
    return;
  }

  const session = event.data.object;
  const orderId = session.client_reference_id || session.metadata?.orderId;
  if (!orderId) {
    console.error("No orderId in session");
    res.status(200).end();
    return;
  }

  const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) {
    console.error("Order not found:", orderId);
    res.status(200).end();
    return;
  }

  await orderRef.update({
    status: "paid",
    stripePaymentStatus: "paid",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const order = orderSnap.data();
  const items = order.items || [];
  for (const item of items) {
    const productRef = db.collection(PRODUCTS_COLLECTION).doc(item.productId);
    const productSnap = await productRef.get();
    if (productSnap.exists && productSnap.data().stock != null) {
      await productRef.update({
        stock: admin.firestore.FieldValue.increment(-(item.quantity || 0)),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  res.status(200).end();
});
