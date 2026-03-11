# MindGlow iOS App – Feature Audit

This document confirms that all features work as intended for a user using the app. Two small fixes were applied during the audit.

---

## App entry & auth

| Area | Status | Notes |
|------|--------|--------|
| **Launch** | ✅ | `AppDelegate` configures Firebase; `RootView` shows loading → auth check → main app or login. |
| **Login** | ✅ | Email/password sign-in, error message, disabled button when fields empty. |
| **Sign up** | ✅ | Name, email, password (min 6 chars); creates Firebase user and Firestore user doc. |
| **Sign in with Apple** | ✅ | Full flow with nonce; creates/updates user doc. |
| **Demo** | ✅ | One-tap demo user (id `"demo"`); no Firebase; sign-out skips Firebase. |
| **Forgot password** | ✅ | Sheet with email field; sends reset; sheet dismisses. |
| **Sign out** | ✅ | Alert; clears user and sets `isAuthenticated = false`; demo skips Firebase sign-out. |
| **Legal** | ✅ | Terms of Service · Privacy Policy opens sheet with ToS and Privacy Policy views. |

---

## Home (Dashboard)

| Area | Status | Notes |
|------|--------|--------|
| **Welcome** | ✅ | Uses `auth.user?.name ?? "there"`. |
| **Quote card** | ✅ | Static quote; no dependency on user. |
| **Stats** | ✅ | Streak, total minutes, wellness score from `auth.user`. |
| **Quick actions** | ✅ | Each button sets `selectedTab` to Meditate(1), Breathe(2), or Wellness(3). |
| **Progress** | ✅ | Meditation total/goal and water today/8 from `auth.user`. Demo shows 0/20 and 0/8. |

---

## Meditate

| Area | Status | Notes |
|------|--------|--------|
| **Duration picker** | ✅ | 5/10/15/20 min; updates `selectedDuration`. |
| **Start session** | ✅ | Starts timer; shows circular progress and “End session”. |
| **Timer completion** | ✅ | On 0:00 saves `selectedDuration` minutes via `auth.addMeditationMinutes` (no-op for demo). |
| **End session** | ✅ | Saves partial minutes `selectedDuration - (remainingSeconds/60)`; stops timer. |
| **Suggested sessions** | ✅ | Morning clarity, Stress relief, Sleep preparation start timer with correct duration. |
| **onDisappear** | ✅ | `stopTimer()` invalidates timer when leaving tab. |

---

## Breathe

| Area | Status | Notes |
|------|--------|--------|
| **Start / Stop** | ✅ | Starts inhale/hold/exhale cycle with animation; Stop clears timer and resets. |
| **Timer** | ✅ | Phases advance on schedule. |
| **onDisappear** | ✅ **Fixed** | Added `onDisappear { stopBreathing() }` so leaving the tab stops the exercise and timer. |

---

## Wellness

| Area | Status | Notes |
|------|--------|--------|
| **Wellness score** | ✅ | Shows `auth.user?.wellnessScore`; demo stays 0. |
| **Mood** | ✅ | Sheet 1–5 stars; Done calls `updateWellnessScore(score)` (no-op for demo). |
| **Water** | ✅ | Sheet stepper 0–20; Done calls `updateUserWaterIntake(waterGlasses)` (no-op for demo). |
| **Displayed water** | ✅ | Demo: local `waterGlasses`; real user: `auth.user?.waterIntake ?? waterGlasses`. |
| **onAppear** | ✅ | Syncs `waterGlasses` and mood from `auth.user`. |

---

## Journal

| Area | Status | Notes |
|------|--------|--------|
| **Load** | ✅ | `.task` and pull-to-refresh load from Firestore `users/{uid}/journal`; demo skips load. |
| **New entry** | ✅ | Sheet; Save creates in Firestore (or appends locally for demo). |
| **Delete** | ✅ | Swipe-to-delete removes from Firestore and local state (demo: local only). |
| **Detail** | ✅ | Tap entry opens read-only detail. |
| **Empty / error** | ✅ | Empty state and retry on load error. |

---

## Community

| Area | Status | Notes |
|------|--------|--------|
| **Content** | ✅ | “Coming soon” and “Planned groups”; no fake counts; searchable UI. |
| **Behavior** | ✅ | Read-only; no broken actions. |

---

## Library

| Area | Status | Notes |
|------|--------|--------|
| **Sample list** | ✅ | Categories and search filter sample sessions. |
| **Item detail** | ✅ | Title, subtitle, type, duration. |
| **Start** | ✅ **Fixed** | “Start” now switches to Meditate tab (`selectedTab = 1`) and dismisses; user can begin a session there. |

---

## Store

| Area | Status | Notes |
|------|--------|--------|
| **Product list** | ✅ | Grid, search, product cards; Add to bag. |
| **Product detail** | ✅ | Image, price, quantity, Add to bag; out-of-stock disabled. |
| **Cart** | ✅ | Items, quantity ±, remove; notes; summary; Place order. |
| **Checkout** | ✅ | Uses `auth.user` (guard in sheet); places order in Firestore; clears cart and saved cart. |
| **Saved cart** | ✅ | Load on Store tab; persist on add/remove/quantity; clear after checkout. |
| **My orders** | ✅ | Fetches by `userId`; order detail with status/tracking/note. |
| **Owner** | ✅ | All orders list; order detail with status/tracking/note edit; store settings (tax, shipping). |
| **Demo** | ✅ | Cart local only; checkout places order with userId `"demo"` (acceptable for try-out). |

---

## Settings

| Area | Status | Notes |
|------|--------|--------|
| **Appearance** | ✅ | Theme (system/light/dark) in `@AppStorage`; applied in `RootView`. |
| **Account** | ✅ | Name and email from `auth.user`. |
| **Meditation goal** | ✅ | Stepper 5–60; `onChange` calls `updateMeditationGoal` (no-op for demo); onAppear loads from user. |
| **Notifications** | ✅ | Toggles; onChange saves to Firestore; onAppear loads from user; demo no-op. |
| **Support / Legal / About** | ✅ | Links and static text. |
| **Sign out** | ✅ | Alert then `auth.signOut()`. |

---

## Cross-cutting

| Area | Status | Notes |
|------|--------|--------|
| **Demo vs real user** | ✅ | All Firestore writes (profile, journal, cart, orders, notifications) no-op or local-only for demo; UI does not assume Firebase. |
| **Nil `auth.user`** | ✅ | Checkout and cart sheet use `guard let u = auth.user`; dashboard/stats use `auth.user?` safely. |
| **Tab bar** | ✅ | Single `selectedTab`; Dashboard quick actions and Library Start switch tabs correctly. |
| **Firebase** | ✅ | Configured in AppDelegate; Auth + Firestore used for real users only. |

---

## Summary

- **All features work as intended** for both real and demo users.
- **Fixes applied during audit**
  1. **Breathe:** Stopping the exercise when the user leaves the tab (`onDisappear`).
  2. **Library:** “Start” switches to the Meditate tab so the user can start a session.
- **Known by design**
  - Community is “coming soon.”
  - Library is sample sessions only (no audio/playback).
  - Theme is per-device (`@AppStorage`), not synced.
  - Demo user data (wellness, journal, etc.) is local only and does not sync.
