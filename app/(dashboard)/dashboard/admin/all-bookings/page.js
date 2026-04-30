"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import Modal from "@/app/shared/ui/Modal";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function AllBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const router = useRouter()
const downloadAttachment = async (key) => {
  const { data } = await axios.post("/api/storage/download-url", { key });
  window.open(data.url, "_blank", "noopener,noreferrer");
};

const handleInvoice = (booking) => {
  if (!booking?.invoiceNo) return;
  downloadAttachment(`invoices/invoice-${booking.invoiceNo}.pdf`);
};
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await axios.get("/api/bookings");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Failed to load bookings
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
        <p className="text-neutral mt-2">
          View all bookings and details
        </p>
      </div>

      {/* Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-300">
              <tr>
                <th className="py-3 px-6 text-left text-xs uppercase">Client</th>
                <th className="py-3 px-6 text-left text-xs uppercase">Instructor</th>
                <th className="py-3 px-6 text-left text-xs uppercase">Service</th>
                <th className="py-3 px-6 text-left text-xs uppercase">Booking Date</th>
                <th className="py-3 px-6 text-left text-xs uppercase">Status</th>
                <th className="py-3 px-6 text-left text-xs uppercase">Payment</th>
                <th className="py-3 px-6 text-left text-xs uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-color">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td onClick={()=>router.push(`/clients?clientId=${b.clientId}`)} className="py-4 px-6 font-semibold hover:underline hover:text-primary cursor-pointer">
                    {b.clientName}
                  </td>

                  <td className="py-4 px-6">
                    {b.instructorName}
                  </td>

                  <td className="py-4 px-6">
                    {b.serviceName}
                  </td>

                 <td className="py-4 px-6">
  <div className="text-sm font-medium">
    {new Date(b.bookingDate).toLocaleDateString()}
  </div>
  <div className="text-xs text-gray-500">
    {b.bookingTime} • {b.duration}
  </div>
</td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                        ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : b.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                        ${
                          b.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <PrimaryBtn
                      className="text-sm px-3! py-2!"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <FaEye />
                    </PrimaryBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-xl border border-border-color shadow-sm p-4"
          >
            <div className="font-semibold">{b.clientName}</div>
            <div className="text-sm text-gray-500">
              {b.serviceName}
            </div>

            <div className="mt-2 text-sm">
              Instructor: {b.instructorName}
            </div>

            <div className="text-sm">
              {new Date(b.bookingDate).toLocaleDateString()} • {b.bookingTime}
            </div>

            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {b.status}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {b.paymentStatus}
              </span>
            </div>

            <div className="mt-3">
              <PrimaryBtn
                className="w-full py-2!"
                onClick={() => setSelectedBooking(b)}
              >
                View Details
              </PrimaryBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBooking && (
        <Modal onClose={() => setSelectedBooking(null)}>
          <div className="overflow-y-auto space-y-4">
            <h2 className="text-xl font-bold">Booking Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><b>Client:</b> {selectedBooking.clientName}</p>
              <p><b>Instructor:</b> {selectedBooking.instructorName}</p>
              <p><b>Service:</b> {selectedBooking.serviceName}</p>
              <p><b>Duration:</b> {selectedBooking.duration}</p>
              <p><b>Date:</b> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
              <p><b>Time:</b> {selectedBooking.bookingTime}</p>
              <div className="col-span-1 sm:col-span-2 mt-4">
  <h3 className="font-semibold text-lg mb-2">Payment Details</h3>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="bg-gray-50 p-3 rounded-lg border border-border-color">
      <p className="text-xs text-gray-500">Total</p>
      <p className="font-semibold">${selectedBooking.price || "0"}</p>
    </div>

    <div className="bg-green-50 p-3 rounded-lg border border-border-color">
      <p className="text-xs text-gray-500">Cash</p>
      <p className="font-semibold text-green-700">
        ${selectedBooking.cashAmount || 0}
      </p>
    </div>

    <div className="bg-blue-50 p-3 rounded-lg border border-border-color">
      <p className="text-xs text-gray-500">Card</p>
      <p className="font-semibold text-blue-700">
        ${selectedBooking.cardAmount || 0}
      </p>
    </div>

    <div className="bg-yellow-50 p-3 rounded-lg border border-border-color">
      <p className="text-xs text-gray-500">Processing Fee</p>
      <p className="font-semibold text-yellow-700">
        ${selectedBooking.processingFee || 0}
      </p>
    </div>
  </div>

  {/* Extra Info */}
  <div className="mt-3 text-sm text-gray-600">
    <p><b>Status:</b> {selectedBooking.paymentStatus}</p>
    <p><b>Method:</b> {selectedBooking.paymentMethod}</p>
  </div>
</div>
              <p><b>Method:</b> {selectedBooking.paymentMethod}</p>
              <p><b>Phone:</b> {selectedBooking.clientPhone}</p>
              <p><b>Address:</b> {selectedBooking.address}</p>
             <p>
  <b>Invoice:</b> #{selectedBooking.invoiceNo}{" "}
  <button
    onClick={() => handleInvoice(selectedBooking)}
    className="ml-2 text-primary underline text-sm"
  >
    View
  </button>
</p>
            </div>

            
          </div>
        </Modal>
      )}
    </div>
  );
}