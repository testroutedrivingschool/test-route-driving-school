"use client";

import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import React, {useState} from "react";
import {FaTrash} from "react-icons/fa";
import {FiPlus, FiGift} from "react-icons/fi";
import {toast} from "react-toastify";

export default function CouponAndVouchers() {
  const queryClient = useQueryClient();
  const {data: coupons = [], isLoading} = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axios.get("/api/coupons");
      return res.data;
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expires: "",
  });

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expires) {
      return toast.error("Please enter all fields");
    }

    try {
      const res = await axios.post("/api/coupons", newCoupon);
      if (res.status === 201) {
        toast.success("Coupon added successfully!");
        setNewCoupon({code: "", discount: "", expires: ""});
        queryClient.invalidateQueries(["coupons"]);
      }
    } catch (err) {
      toast.error("Failed to add coupon");
    }
  };
  const handleDeleteCoupon = async (id) => {
    try {
      const res = await axios.delete(`/api/coupons?id=${id}`);
      if (res.status === 200) {
        toast.success("Coupon deleted successfully!");
        queryClient.invalidateQueries(["coupons"]);
      }
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiGift className="text-primary text-3xl" /> Coupons & Vouchers
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          <FiPlus /> Add Coupon
        </button>
      </div>

      {/* Add Coupon Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-border-color">
          <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="code" className="mb-1 font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                id="code"
                type="text"
                placeholder="Enter coupon code"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon({...newCoupon, code: e.target.value})
                }
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="discount"
                className="mb-1 font-medium text-gray-700"
              >
                Discount (%)
              </label>
              <input
                id="discount"
                type="number"
                placeholder="Enter discount (e.g. 10)"
                value={newCoupon.discount}
                onChange={(e) =>
                  setNewCoupon({...newCoupon, discount: e.target.value})
                }
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="expires"
                className="mb-1 font-medium text-gray-700"
              >
                Expiry Date
              </label>
              <input
                id="expires"
                type="date"
                value={newCoupon.expires}
                onChange={(e) =>
                  setNewCoupon({...newCoupon, expires: e.target.value})
                }
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>
          </div>

          <button
            onClick={handleAddCoupon}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Save Coupon
          </button>
        </div>
      )}

      {/* Coupons Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-border-color">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {coupons.length === 0 ? (
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                <h2 className="font-bold">No Coupon Found</h2>
              </td>
            ) : (
              coupons.map((coupon) => {
                const isExpired = new Date(coupon.expires) < new Date();
                return (
                  <tr key={coupon._id} className="font-montserrat">
                    <td className="px-6 py-4 text-neutral font-bold">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 text-neutral">
                      {coupon.discount}% Off
                    </td>
                    <td className="px-6 py-4 text-neutral">{coupon.expires}</td>
                    <td className="px-6 py-4 text-left">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isExpired
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="flex items-center gap-1 justify-center px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
