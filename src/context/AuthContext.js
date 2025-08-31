// src/context/AuthContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  updateProfile as fbUpdateProfile,
  
  onAuthStateChanged,
  sendPasswordResetEmail
  
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Signup
  const signup = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await fbUpdateProfile(res.user, { displayName });
    }
    return res;
  };

  // 🔹 Login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🔹 Google Sign-in
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // 🔹 Logout
  const logout = () => signOut(auth);

  // Password Reset
const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
const updateUserProfile = (profile) => {
  if (!auth.currentUser) return;
  return fbUpdateProfile(auth.currentUser, profile);
};







  // ✅ Include loginWithGoogle in value
  const value = { user, signup, login, logout, loginWithGoogle,resetPassword,updateUserProfile };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
