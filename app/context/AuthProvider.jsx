"use client";
import React, {useEffect, useState} from "react";
import {AuthContext} from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {auth} from "../libs/firebase/firebase.config";

export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const GoogleProvider = new GoogleAuthProvider();

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, GoogleProvider);
  };

  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const signUpUserWithCredential = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUserWithCredential = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const userProfileUpdate = (profileData) => {
    return updateProfile(auth.currentUser, profileData);
  };
  const forgetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) throw new Error("No logged-in user found");

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword,
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      return {success: true, message: "Password updated successfully!"};
    } catch (error) {
      console.error("Password change error:", error);
      throw new Error(error.message || "Failed to change password");
    }
  };

  // -------------------- OTP / Phone Auth --------------------
  const setupRecaptcha = async () => {
    if (typeof window === "undefined") return null;

    const container = document.getElementById("recaptcha-container");
    if (!container) {
      console.error("Recaptcha container not found in DOM");
      return null;
    }

    // ✅ If already created, reuse it (DO NOT render again)
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    // Clean container just in case
    container.innerHTML = "";

    // ✅ Firebase v10+ signature: (auth, containerId, params)
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {size: "invisible"},
    );

    // Render only once
    window.recaptchaWidgetId = await window.recaptchaVerifier.render();

    return window.recaptchaVerifier;
  };

  const resetRecaptcha = () => {
    try {
      if (window.recaptchaWidgetId !== undefined && window.grecaptcha) {
        window.grecaptcha.reset(window.recaptchaWidgetId);
      }
    } catch {}
  };

  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    try {
      const appVerifier = await setupRecaptcha();
      if (!appVerifier) throw new Error("Recaptcha not ready");

      // ✅ reset before sending again (important for retries)
      resetRecaptcha();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );

      window.confirmationResult = confirmationResult;
      return true;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    if (!window.confirmationResult) {
      throw new Error("OTP not requested yet!");
    }
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      setUser(result.user);
      setLoading(false);
      return result.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
  const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
    try {
      if (currentUser) {
        setUser(currentUser);

        // ✅ get idToken
        const token = await currentUser.getIdToken();

        // ✅ create/update cookie from server using Mongo role
        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setLoading(false);
      } else {
        setUser(null);

        // ✅ clear cookie on logout
        await fetch("/api/auth/logout", { method: "POST" });

        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  });

  return () => unSubscribe();
}, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    loginWithGoogle,
    logoutUser,
    signUpUserWithCredential,
    loginUserWithCredential,
    userProfileUpdate,
    sendOtp,
    verifyOtp,
    changePassword,
    forgetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
