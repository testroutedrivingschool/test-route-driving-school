export function getFirebaseAuthErrorMessage(error) {
  const code = error?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password should be at least 6 characters long.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    default:
      return "Registration failed. Please try again.";
  }
}
