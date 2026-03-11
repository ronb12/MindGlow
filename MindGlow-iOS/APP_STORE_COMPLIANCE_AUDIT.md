# MindGlow iOS – App Store Compliance Audit

This audit checks the app against Apple’s App Store Review Guidelines and common rejection reasons. Items marked **Done** are implemented; **Configure** means set before submission.

---

## 1. Privacy & data (Guidelines 5.1.1, 2.3.13, 5.1.2)

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Privacy Policy** | **Done** | In-app Privacy Policy (Settings → Legal → Privacy Policy). Covers collection, use, Firebase, choices, children, contact. Optional `AppConfig.Legal.privacyPolicyURL` for web link. |
| **Terms of Service / EULA** | **Done** | In-app Terms (Settings → Legal → Terms of Service). Acceptance, service description, account, acceptable use, privacy, disclaimers, contact. Optional `AppConfig.Legal.termsOfServiceURL`. |
| **Legal before sign-up** | **Done** | Auth screen has “Terms of Service · Privacy Policy” link that opens Legal sheet before account creation. |
| **Account deletion (5.1.1(v))** | **Done** | Settings → “Delete account” (real users only). Confirmation alert; deletes Firestore user doc, journal, cart, then Firebase Auth account. Demo users don’t see the option. |
| **Data disclosure** | **Configure** | In App Store Connect, complete **App Privacy** (nutrition labels): e.g. Contact Info, User Content (journal, community posts), Usage Data if applicable. Align with Privacy Policy. |
| **Children under 13** | **Done** | Privacy Policy states app not directed at under-13; no knowing collection; contact to delete if collected. |

---

## 2. Sign in with Apple (Guideline 4.8)

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Offer Sign in with Apple** | **Done** | Shown on auth screen when other third-party sign-in (email/password) is offered. |
| **Entitlement** | **Done** | `Mind Glow.entitlements` includes `com.apple.developer.applesignin` (Default). |
| **Implementation** | **Done** | SignInWithAppleHelper + AuthService.signInWithApple; creates/updates Firestore user. |

---

## 3. Support & contact (Guideline 5.1.1)

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Support in app** | **Done** | Settings → Support: Link “Contact & support” when `AppConfig.supportURL` is set; otherwise shows company name. |
| **Contact for legal/privacy** | **Done** | Terms and Privacy Policy direct users to “Support in Settings” or contact company. |
| **Recommendation** | **Configure** | Set `AppConfig.supportURL` to a contact/support page (e.g. website or mailto) so users have a clear way to reach you. |

---

## 4. Functionality & completeness (Guidelines 2.1, 4.2)

| Requirement | Status | Notes |
|-------------|--------|--------|
| **No broken / placeholder features** | **Done** | Community is a live feed (create post, list, search). Library has playback for items with audio. No “coming soon” for core flows. |
| **Demo / guest mode** | **Done** | “Try without account” with subtitle “Explore features; data won’t sync.” Clearly exploratory; data not synced. |
| **Store** | **Done** | Store is for physical/digital products (e.g. Shopify-style). If you only sell physical goods, no in-app purchase required. If you add digital goods/subscriptions, use IAP per Guideline 3.1.1. |
| **Crashes / stability** | **Done** | No obvious crash paths; auth/user nil guarded. Run full QA before submission. |

---

## 5. Content & design (Guidelines 1.1, 2.3, 4.2)

| Requirement | Status | Notes |
|-------------|--------|--------|
| **No misleading claims** | **Done** | Wellness/meditation content presented as general wellness support; Terms disclaim professional medical/mental health advice. |
| **Health / medical disclaimer** | **Done** | Terms: “Wellness and meditation content is for general informational and relaxation purposes and is not a substitute for professional medical or mental health advice.” |
| **Copyright** | **Done** | Generated Info.plist includes `NSHumanReadableCopyright` (e.g. “© 2025 Bradley Virtual Solutions, LLC.”). |
| **Category** | **Done** | `LSApplicationCategoryType` = `public.app-category.healthcare-fitness`. |

---

## 6. Technical & configuration

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Info.plist** | **Done** | `GENERATE_INFOPLIST_FILE = YES`; display name, category, copyright, orientations, launch screen, scene manifest. |
| **Capabilities** | **Done** | Sign in with Apple in entitlements. No camera/mic; no extra usage descriptions needed unless you add those features. |
| **Encryption** | **Configure** | If you use only HTTPS and standard Firebase, often “No” for export compliance. In App Store Connect, answer the encryption question; add `ITSAppUsesNonExemptEncryption = NO` in Info if applicable (or export compliance in Connect). |
| **No private APIs** | **Done** | No use of private or undocumented APIs. |

---

## 7. App Store Connect checklist (before submit)

- **App Privacy:** Declare data types (e.g. Contact Info, User Content, Identifiers) and usage; match Privacy Policy.
- **Age rating:** Complete questionnaire (e.g. Medical/Treatment Info, Unrestricted Web Access if you open URLs).
- **Export compliance:** Answer encryption question; attach compliance docs if required.
- **Support URL:** Required field; use same URL as `AppConfig.supportURL` if desired.
- **Marketing URL:** Optional.
- **Version release:** Choose manual, automatic, or phased after approval.

---

## 8. Changes made for this audit

1. **Account deletion (5.1.1(v))**  
   - `AuthService.deleteAccount(uid)` deletes Firestore user doc, journal subcollection, cart doc, then Firebase Auth account.  
   - Settings → “Delete account” with confirmation alert; only for non-demo users.  
   - `AuthViewModel.deleteAccount()` calls service and clears auth state.

2. **Demo button clarity**  
   - Replaced “Demo” with “Try without account” and subtitle “Explore features; data won’t sync” so intent is clear for reviewers.

3. **Support / contact**  
   - No code change; recommend setting `AppConfig.supportURL` before submission.

---

## Summary

| Area | Compliant | Action |
|------|-----------|--------|
| Privacy Policy & Terms | Yes | Optional: set `termsOfServiceURL` / `privacyPolicyURL` for web. |
| Account deletion | Yes | Implemented in-app. |
| Sign in with Apple | Yes | Implemented and entitled. |
| Support / contact | Yes | Set `supportURL` for best practice. |
| Legal before sign-up | Yes | Link on auth screen. |
| Health disclaimer | Yes | In Terms. |
| Demo / guest | Yes | Clearly labeled. |
| App Store Connect | — | Complete Privacy, Age rating, Export compliance, Support URL. |

With the above in place and App Store Connect configured, the app is in good shape for App Store compliance. Run a full test pass and then submit.
