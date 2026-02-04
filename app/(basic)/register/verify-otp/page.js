"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-toastify";
import useAuth from "@/app/hooks/useAuth";
import {getFirebaseAuthErrorMessage} from "@/app/utils/firebaseError";
import {useQueryClient} from "@tanstack/react-query";
export default function VerifyOtp() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const {verifyOtp, signUpUserWithCredential, userProfileUpdate, logoutUser} =
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

      // ✅ Verify OTP (this signs in a PHONE user)
      await verifyOtp(otp);

      // ✅ IMPORTANT: sign out phone user before creating email/password user
      await logoutUser();

      // ✅ Create Firebase account (email/password)
      await signUpUserWithCredential(userData.email, userData.password);

      // ✅ Update profile
      await userProfileUpdate({
        displayName: userData.fullName,
      });

      // ✅ Save user to MongoDB
      await axios.post("/api/users", {
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        photoKey: userData.photoKey || "",
        provider: "Credential",
        role: "user",
        registeredAt: new Date(),
        lastLogin: new Date(),
      });

      await queryClient.invalidateQueries({
        queryKey: ["user", userData.email],
      });
      await axios.post("/api/clients/sync-from-user", {
        email:userData?.email,
        provider: "Credential",
      });
      sessionStorage.removeItem("pendingUser");

      toast.success("Account created successfully 🎉");
      router.push("/");
       router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(
        getFirebaseAuthErrorMessage(err) || "Otp Verification Failed",
      );
    } finally {
      setLoading(false);
    }
  };



  if (!userData) return null; 

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
          className="w-full border border-border-color p-3 rounded mb-4"
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
