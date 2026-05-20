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
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    if (!userData || loading) return;

    try {
      setLoading(true);

      // 1. Verify phone OTP. This logs in a temporary phone user.
      await verifyOtp(otp);

      // 2. Logout temporary phone user.
      // Important: do not refresh here.
      await logoutUser({ refresh: false });

      // 3. Create Firebase email/password account.
      const credential = await signUpUserWithCredential(
        userData.email,
        userData.password
      );

      // 4. Update Firebase profile.
      await userProfileUpdate({
        displayName: userData.fullName,
      });

      // 5. Save user to MongoDB first.
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

      // 6. Sync client.
      await axios.post("/api/clients/sync-from-user", {
        email: userData.email,
        provider: "Credential",
      });

      // 7. Now create middleware cookie after DB user exists.
      const token = await credential.user.getIdToken(true);

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!sessionRes.ok) {
        const sessionError = await sessionRes.json().catch(() => null);

        throw new Error(
          sessionError?.error || "Failed to create login session"
        );
      }

      // 8. Refresh React Query user cache.
      await queryClient.invalidateQueries({
        queryKey: ["user", userData.email],
      });

      // 9. Remove temporary registration data.
      sessionStorage.removeItem("pendingUser");

      toast.success("Account created successfully 🎉");

      // 10. Go directly to dashboard.
      router.replace("/dashboard/user");
      router.refresh();
    } catch (err) {
      console.error("OTP registration error:", err);

      toast.error(
        getFirebaseAuthErrorMessage(err) ||
          err?.message ||
          "Otp Verification Failed"
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
