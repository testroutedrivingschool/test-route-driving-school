"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const router = useRouter();
  const { verifyOtp, signUpUserWithCredential, userProfileUpdate, user, setUser } =
    useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Only access sessionStorage on the client
  useEffect(() => {
    const data = sessionStorage.getItem("pendingUser");
    if (!data) {
      router.push("/register");
    } else {
      setUserData(JSON.parse(data));
    }
  }, [router]);

  const handleVerify = async () => {
    if (!otp) return toast.error("Enter OTP");
    if (!userData) return;

    try {
      setLoading(true);

      // ✅ Verify OTP
      const verifiedUser = await verifyOtp(otp);

      // ✅ Create Firebase account
      const result = await signUpUserWithCredential(
        userData.email,
        userData.password
      );

      // ✅ Update profile
      await userProfileUpdate({
        displayName: userData.fullName,
        photoURL: userData.photo,
      });

      // ✅ Update AuthContext immediately
      if (setUser) {
        setUser({
          ...result.user,
          displayName: userData.fullName,
          photoURL: userData.photo,
        });
      }

      // ✅ Save user to MongoDB
      await axios.post("/api/users", {
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        photo: userData.photo,
        role: "user",
        registeredAt: new Date(),
        lastLogin: new Date(),
      });

      sessionStorage.removeItem("pendingUser");

      toast.success("Account created successfully 🎉");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null; // Avoid rendering until sessionStorage is loaded

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Verify Phone Number
        </h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border p-3 rounded mb-4"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded"
        >
          {loading ? "Verifying..." : "Verify & Create Account"}
        </button>
      </div>
    </div>
  );
}
