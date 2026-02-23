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
import {useRouter} from "next/navigation";
import { toast } from "react-toastify";

export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const GoogleProvider = new GoogleAuthProvider();

const loginWithGoogle = async () => {

  const result = await signInWithPopup(auth, GoogleProvider);
  router.refresh(); 
  return result;
};

const logoutUser = async () => {

  await signOut(auth);
  router.refresh();
};

  const signUpUserWithCredential = (email, password) => {
 
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUserWithCredential = (email, password) => {

    return signInWithEmailAndPassword(auth, email, password);
  };

  const userProfileUpdate = (profileData) => {
    return updateProfile(auth.currentUser, profileData);
  };
  const forgetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) return toast.error("No logged-in user found");

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
      toast.error("Password change error:", error.message);
      
    }
  };

  // -------------------- OTP / Phone Auth --------------------
  const setupRecaptcha = async () => {
    if (typeof window === "undefined") return null;

    const container = document.getElementById("recaptcha-container");
    if (!container) {
      toast.error("Recaptcha container not found in DOM");
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

        const token = await currentUser.getIdToken(true);

        await fetch("/api/auth/session", {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
          cache: "no-store",
        });

      } else {
        setUser(null);
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      }

      setLoading(false);
    } catch (e) {
      
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
