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
} from "firebase/auth";
import {auth} from "../libs/firebase/firebase.config";

export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setLoading(false);
        setUser(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);
  console.log(user);
  const authInfo = {
    user,
    loading,
    setLoading,
    loginWithGoogle,
    logoutUser,
    signUpUserWithCredential,
    loginUserWithCredential,
    userProfileUpdate
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
