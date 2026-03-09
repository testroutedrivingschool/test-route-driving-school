"use client";

import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {FaEye, FaEyeSlash, FaLock, FaEnvelope} from "react-icons/fa";
import {FiLogIn} from "react-icons/fi";
import Image from "next/image";
import googleLogo from "@/app/assets/google-logo.webp";
import {toast} from "react-toastify";
import axios from "axios";
import useAuth from "@/app/hooks/useAuth";
import {useState} from "react";
import {getFirebaseAuthErrorMessage} from "@/app/utils/firebaseError";
import {useQueryClient} from "@tanstack/react-query";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const redirect = searchParams.get("redirect") || "/";
  const role = searchParams.get("role") || "user";
  const {
    user,
    loading,
    logoutUser,
    loginWithGoogle,
    loginUserWithCredential,
    forgetPassword,
  } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginUserWithCredential(
        formData.email,
        formData.password,
      );
      const firebaseUser = result.user;

      const token = await firebaseUser.getIdToken(true);

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok) {
        throw new Error(sessionData?.error || "Failed to create session");
      }

      try {
        await axios.patch("/api/users", {email: formData.email});
      } catch (apiErr) {
        console.error("PATCH /api/users failed:", apiErr);
      }

      await queryClient.invalidateQueries({queryKey: ["userData"]});

      toast.success("Log in successfully 🎉");

      setFormData({
        email: "",
        password: "",
        phone: "",
        otp: "",
        rememberMe: false,
      });

      router.refresh();
      router.push(redirect || "/");
    } catch (err) {
      toast.error(
        getFirebaseAuthErrorMessage(err) || err?.message || "Login failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const firebaseUser = result.user;

      const {data} = await axios.get(
        `/api/users/check-email?email=${firebaseUser.email}`,
      );

      if (!data.exists) {
        const userData = {
          name: firebaseUser.displayName || "",
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || "",
          photo: firebaseUser.photoURL || "",
          provider: "Google",
          role: "user",
          registeredAt: new Date(),
          lastLogin: new Date(),
        };

        await axios.post("/api/users", userData);
        await axios.post("/api/clients/sync-from-user", {
          email: firebaseUser.email,
          provider: "Google",
        });
      } else {
        await axios.patch("/api/users", {email: firebaseUser.email});
      }

      const token = await firebaseUser.getIdToken(true);

      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      await queryClient.invalidateQueries({queryKey: ["userData"]});

      toast.success("Logged in successfully 🎉");
      router.refresh();
      router.push(redirect || "/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Google login failed. Please try again.",
      );
    }
  };
  const handleForgetPassword = async (email) => {
    if (!email) return toast.error("Please enter your email first");

    try {
      await forgetPassword(email);
      toast.success("Password reset email sent! Check Inbox/Spam.");
    } catch (err) {
      toast.error(
        getFirebaseAuthErrorMessage(err) || "Failed to send reset email",
      );
    }
  };
  if (loading) return;
  if (user) {
    return (
      <div className="py-16 min-h-[80vh] flex items-center">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You are already logged in
          </h2>

          <p className="text-neutral mb-6">
            Welcome back, <span className="font-semibold">{user?.email}</span>
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold"
            >
              Go to Home
            </button>

            <button
              onClick={async () => {
                await logoutUser();
                toast.success("Logged out successfully");
                router.refresh();
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {role === "instructor" ? "Login as instructor" : "Welcome Back"}
          </h1>
          <p className="text-neutral">
            {role === "instructor"
              ? "Sign in to your instructor account"
              : "Sign in to your account to continue your driving journey"}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => handleForgetPassword(formData.email)}
                className="text-sm text-primary hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-neutral"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiLogIn />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-neutral">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold"
              aria-label="Register to your account"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-secondary hover:text-white transition-colors"
          >
            <Image src={googleLogo} width={25} height={25} alt="Google Logo" />
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
