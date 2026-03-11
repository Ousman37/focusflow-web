// src/lib/firebase-errors.ts

const firebaseErrorMessages: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/popup-blocked":
    "Popup was blocked. Please allow popups for this site and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/network-request-failed":
    "Network error. Please check your connection and try again.",
  "auth/too-many-requests":
    "Too many failed attempts. Please wait a moment and try again.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/requires-recent-login": "Please log in again to continue.",
  "auth/account-exists-with-different-credential":
    "An account with this email already exists using a different sign-in method.",
};

export function getFirebaseErrorMessage(code: string): string {
  return firebaseErrorMessages[code] ?? "Something went wrong. Please try again.";
}
