export function getFirebaseAuthErrorMessage(error) {
  const code = error?.code;

  switch (code) {
    // ---------- Email / Password ----------
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password should be at least 6 characters long.";

    // ---------- Network ----------
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    // ---------- Phone / OTP ----------
    case "auth/invalid-verification-code":
      return "Invalid OTP. Please check the code and try again.";

    case "auth/missing-verification-code":
      return "Please enter the OTP sent to your phone.";

    case "auth/code-expired":
      return "OTP has expired. Please request a new one.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait a while and try again.";

    case "auth/invalid-phone-number":
      return "Please enter a valid phone number with country code.";

    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please refresh and try again.";

    // ---------- Account Linking ----------
    case "auth/credential-already-in-use":
      return "This phone number is already linked with another account.";

    case "auth/provider-already-linked":
      return "Phone number is already verified for this account.";

    case "auth/requires-recent-login":
      return "For security reasons, please log in again and retry.";
  case "auth/invalid-credential":
  return "The email or password you entered is incorrect.";
    // ---------- Fallback ----------
    default:
      return "Authentication failed. Please try again.";
  }
}
