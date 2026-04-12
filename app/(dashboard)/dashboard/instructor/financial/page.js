"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserData } from "@/app/hooks/useUserData";

export default function FinancialPage() {
  const { data: userData, isLoading: isUserLoading } = useUserData();

  const [formData, setFormData] = useState({
    accountName: "",
    bsbNumber: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: financialData, isLoading } = useQuery({
    queryKey: ["instructor-financial", userData?.instructorId],
    enabled: !!userData?.instructorId,
    queryFn: async () => {
      const res = await axios.get(
        `/api/instructors/financial?instructorId=${userData.instructorId}`
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (!financialData) return;

    setFormData({
      accountName: financialData.accountName || "",
      bsbNumber: financialData.bsbNumber || "",
      accountNumber: financialData.accountNumber || "",
    });
  }, [
    financialData?.accountName,
    financialData?.bsbNumber,
    financialData?.accountNumber,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.email || !userData?._id || !userData?.instructorId) {
      toast.error("User data not ready");
      return;
    }

    setLoading(true);

    try {
      await axios.patch("/api/instructors/financial", {
        email: userData.email,
        userId: userData._id,
        instructorId: userData.instructorId,
        ...formData,
      });

      toast.success("Submitted Successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save financial info");
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Financial Information</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Bank Account Name</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="input-class"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">BSB Number</label>
          <input
            type="text"
            name="bsbNumber"
            value={formData.bsbNumber}
            onChange={handleChange}
            placeholder="123456"
            required
            className="input-class"
          />
        </div>

        <div className="relative">
          <label className="block font-semibold mb-1">Account Number</label>
          <input
            type={showPassword ? "text" : "password"}
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="12345678"
            required
            className="input-class"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-gray-400 hover:text-neutral"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <PrimaryBtn
          type="submit"
          className="w-full text-center justify-center"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </PrimaryBtn>
      </form>
    </div>
  );
}