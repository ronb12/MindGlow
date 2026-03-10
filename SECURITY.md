# Security: Firebase API Key in Client Code

## Why the API key is in the app

Google Cloud may warn that your **Firebase API key is public**. For web and mobile apps, this is **expected and correct**.

- Firebase API keys **are not secret**. They identify your project to Firebase services; they do not by themselves grant access to your data.
- Access to data is enforced by:
  - **Firebase Authentication** (who is signed in)
  - **Firestore / Storage / Realtime Database rules** (what each user can read/write)
- Hiding the key in a web app is not possible: any key used in the browser can be seen in the page source or network tab. Firebase is designed for that.

Official reference: [Is it safe to expose my API key?](https://firebase.google.com/docs/projects/api-keys#api_keys_in_android)

## What you should do in Google Cloud

To satisfy Google Cloud’s recommendations and reduce misuse:

### 1. Restrict the key by application (HTTP referrer)

1. Open [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials?project=mindglow-wellness).
2. Click your **Firebase Web API key** (or the key used by your web app).
3. Under **Application restrictions**, choose **HTTP referrers (web sites)**.
4. Add your allowed origins, for example:
   - `https://mindglow-wellness.web.app/*`
   - `https://mindglow-wellness.firebaseapp.com/*`
   - `http://localhost:*` (for local development)
5. Save.

After this, the key only works when the request comes from one of these sites.

### 2. Restrict the key by API (optional)

Under **API restrictions**, choose “Restrict key” and select only the APIs your app uses (e.g. Firebase Authentication, Firestore, or the general “Firebase” APIs). This limits what the key can call.

## Summary

- **API key in `config.js`**: Intended for client use; keep it there for the app to work.
- **Real security**: Auth + Firestore/Storage rules + **Application restrictions** (and optionally API restrictions) in Google Cloud Console.
