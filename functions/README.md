# MindGlow Cloud Functions (Stripe Checkout)

## Setup

1. **Install dependencies**
   ```bash
   cd functions && npm install
   ```

2. **Set Stripe secret key**
   - Get your secret key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (use test key for development).
   - Set it for Firebase:
     ```bash
     firebase functions:config:set stripe.secret="sk_test_..."
     ```
   - Or use Firebase secrets (recommended for production):
     ```bash
     firebase functions:secrets:set STRIPE_SECRET_KEY
     ```
     Then in code use `process.env.STRIPE_SECRET_KEY`.

3. **Deploy functions**
   ```bash
   firebase deploy --only functions
   ```

4. **Optional: Stripe webhook** (to mark orders as paid and decrement stock automatically)
   - In [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks), add an endpoint.
   - URL: `https://<region>-<project>.cloudfunctions.net/stripeWebhook` (see Firebase Console → Functions for the exact URL).
   - Event: `checkout.session.completed`.
   - Copy the signing secret and set it:
     ```bash
     firebase functions:config:set stripe.webhook_secret="whsec_..."
     ```
   - Redeploy: `firebase deploy --only functions`

If the webhook is not set up, you can still mark orders as paid manually in the Orders tab after the customer pays via Stripe Checkout.
