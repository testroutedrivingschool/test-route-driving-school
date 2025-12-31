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

const changePassword = async (currentPassword, newPassword) => {
  if (!auth.currentUser) throw new Error("No logged-in user found");

  try {
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update password
    await updatePassword(auth.currentUser, newPassword);

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Password change error:", error);
    throw new Error(error.message || "Failed to change password");
  }
};

// -------------------- OTP / Phone Auth --------------------
const setupRecaptcha = () => {
  if (typeof window === "undefined") return null;

  const container = document.getElementById("recaptcha-container");
  if (!container) {
      console.error("Recaptcha container not found in DOM");
      return null;
  }

  if (!window.recaptchaVerifier) {
    // FIX: auth goes first in Firebase v9+
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, 
      "recaptcha-container",
      { size: "invisible" }
    );

    // ⚠️ IMPORTANT: Only keep this line if you are testing and NOT waiting for real SMS.
    // If you want real SMS to your phone, REMOVE or COMMENT OUT this line.
    // window.recaptchaVerifier.appVerificationDisabledForTesting = true; 
  }

  return window.recaptchaVerifier;
};

const sendOtp = async (phoneNumber) => {
  setLoading(true);
  try {
    const appVerifier = setupRecaptcha();
    if (!appVerifier) throw new Error("Recaptcha not ready");

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );

    window.confirmationResult = confirmationResult;
    setLoading(false);
    return true;
  } catch (error) {
    setLoading(false);
    throw error;
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
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
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
    changePassword
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
