"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import useAuth from "@/app/hooks/useAuth";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FinancialPage() {
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    accountName: "",
    bsbNumber: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false)
  const {
    data: instructorData = {},
    isLoading,
  } = useQuery({
    queryKey: ["instructor"],
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${user.email}`);
      return res.data;
    },
  });

  useEffect(() => {
    setFormData({
      accountName: instructorData.financial?.accountName || "",
      bsbNumber: instructorData.financial?.bsbNumber || "",
      accountNumber: instructorData.financial?.accountNumber || "",
    });
  }, [instructorData]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) return alert("User not logged in");

    setLoading(true);

    try {
      const res = await axios.patch("/api/instructors/financial", {
        email: user.email,
        ...formData,
      });
      if (res) {
        toast.success("Submitted Successfully");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save financial info");
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className=" max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Financial Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Account Name */}
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

        {/* BSB Number */}
        <div>
          <label className="block font-semibold mb-1">BSB Number</label>
          <input
            type="text"
            name="bsbNumber"
            value={formData.bsbNumber}
            onChange={handleChange}
            placeholder="123-456"
            required
            className="input-class"
          />
        </div>

        {/* Account Number */}
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
                          className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
