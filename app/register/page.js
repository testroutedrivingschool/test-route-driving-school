"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaPhone,
  FaLock,
  FaEnvelope,
  FaUser,
  FaCheck,
} from "react-icons/fa";
import {FiLogIn} from "react-icons/fi";
import Image from "next/image";
import PrimaryBtn from "../shared/Buttons/PrimaryBtn";
import googleLogo from "@/app/assets/google-logo.webp";
import useAuth from "../hooks/useAuth";
import {toast} from "react-toastify";
export default function Register() {
  const router = useRouter();
  const {loginWithGoogle, signUpUserWithCredential, userProfileUpdate} =
    useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    signUpUserWithCredential(formData.email, formData.password)
      .then((data) => {
        userProfileUpdate({displayName: formData.fullName})
          .then((data) => {
            toast.success("Registerd successfully 🎉");
            console.log(data);
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Login failed. Please try again.");
      });
  };

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then(() => {
        toast.success("Registerd successfully 🎉");
      })
      .catch(() => {
        toast.error("Google login failed. Please try again.");
      });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.substring(0, 10);
    if (value.length > 3 && value.length <= 6) {
      value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    } else if (value.length > 6) {
      value = `(${value.substring(0, 3)}) ${value.substring(
        3,
        6
      )}-${value.substring(6)}`;
    }
    setFormData((prev) => ({...prev, phone: value}));
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return {score: 0, label: ""};
    if (password.length < 6)
      return {score: 1, label: "Weak", color: "bg-red-500"};

    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    if (score === 1) return {score: 1, label: "Weak", color: "bg-red-500"};
    if (score === 2) return {score: 2, label: "Good", color: "bg-yellow-500"};
    if (score === 3) return {score: 3, label: "Strong", color: "bg-green-500"};
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 text-center">
          <Link
            href="/"
            className="inline-flex flex-col items-center gap-3 mb-4"
          >
            <div className="relative">
              <Image
                width={80}
                height={80}
                src="/test-route-driving-school-logo.png"
                alt="Test Route Driving School"
                className="rounded-full border-4 border-white/20"
              />
            </div>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-neutral">Join thousands of successful drivers</p>
        </div>

        {/* Main Content */}
        <div className="px-6 md:px-8 pb-4">
          {/* Toggle between Email and Phone login */}
          <div className="flex justify-center mb-6 gap-4">
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                activeTab === "email"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                activeTab === "phone"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Phone Login
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email or Phone based on activeTab */}
            {activeTab === "email" && (
              <>
                {/* Email (Required) */}
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(123) 456-7890"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "phone" && (
              <>
                {/* Phone (Required) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="(123) 456-7890"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We’ll send a verification code to this number
                  </p>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address{" "}
                    <span className="text-gray-400">(Optional)</span>
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
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      Password strength
                    </span>
                    <span className={`text-xs font-bold ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-500`}
                      style={{width: `${(strength.score / 3) * 100}%`}}
                    ></div>
                  </div>

                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      {
                        label: "At least 6 characters",
                        check: formData.password.length >= 6,
                      },
                      {
                        label: "One uppercase letter",
                        check: /[A-Z]/.test(formData.password),
                      },
                      {
                        label: "One number",
                        check: /[0-9]/.test(formData.password),
                      },
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.check
                              ? "bg-green-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {req.check && <FaCheck className="text-xs" />}
                        </div>
                        <span
                          className={`text-xs ${
                            req.check ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-300"
                      : formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-green-300"
                      : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                      <FaCheck />
                    </div>
                  )}
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                disabled={isLoading}
              />
              <label
                htmlFor="agreeTerms"
                className="ml-2 text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <PrimaryBtn
              type="submit"
              disabled={isLoading}
              className="w-full! justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Create Account</span>
                </>
              )}
            </PrimaryBtn>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-secondary hover:text-white transition-colors"
            >
              <Image
                src={googleLogo}
                width={25}
                height={25}
                alt="Google Logo"
              />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
