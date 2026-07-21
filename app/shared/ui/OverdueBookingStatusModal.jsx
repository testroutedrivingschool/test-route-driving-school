"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserClock,
} from "react-icons/fa";

import { useUserData } from "@/app/hooks/useUserData";
import CancelBookingModal, {
  cancellationReasonMap,
  createInitialCancelForm,
} from "@/app/shared/ui/CancelBookingModal";

function oid(id) {
  if (!id) return "";

  if (typeof id === "string") return id;

  if (id?.$oid) return id.$oid;

  return String(id);
}

function formatBookingDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-AU", {
    timeZone: "Australia/Sydney",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function OverdueBookingStatusModal() {
  const queryClient = useQueryClient();
  const { data: userData } = useUserData();

  const [activeIndex, setActiveIndex] = useState(0);
  const [snoozed, setSnoozed] = useState({});
  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [cancelForm, setCancelForm] = useState(() =>
    createInitialCancelForm()
  );

  const isInstructor =
    userData?.role === "instructor";

  const instructorEmail =
    userData?.email || "";

  const instructorId =
    userData?.instructorId || "";

  const { data, isLoading } = useQuery({
    queryKey: [
      "overdue-bookings",
      instructorEmail,
      instructorId,
    ],

    enabled: Boolean(
      isInstructor &&
        (instructorEmail || instructorId)
    ),

    queryFn: async () => {
      const params = new URLSearchParams();

      if (instructorEmail) {
        params.set(
          "instructorEmail",
          instructorEmail
        );
      }

      if (instructorId) {
        params.set(
          "instructorId",
          instructorId
        );
      }

      const response = await axios.get(
        `/api/bookings/overdue?${params.toString()}`
      );

      return response.data?.bookings || [];
    },

    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const overdueBookings = useMemo(() => {
    const now = Date.now();

    return (data || []).filter(
      (currentBooking) => {
        const id = oid(currentBooking?._id);
        const snoozedUntil = snoozed[id];

        return (
          !snoozedUntil ||
          snoozedUntil <= now
        );
      }
    );
  }, [data, snoozed]);

  useEffect(() => {
    if (
      activeIndex >= overdueBookings.length
    ) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    overdueBookings.length,
  ]);

  const booking =
    overdueBookings[activeIndex];

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      bookingId,
      status,
      cancellation,
    }) => {
      return axios.patch(
        `/api/bookings/${bookingId}`,
        {
          status,
          ...(cancellation
            ? { cancellation }
            : {}),
        }
      );
    },

    onSuccess: async (
      response,
      variables
    ) => {
      if (
        variables.status === "cancelled"
      ) {
        setShowCancelModal(false);
        setCancelForm(
          createInitialCancelForm()
        );

        if (response?.data?.smsWarning) {
          toast.warning(
            response.data.smsWarning
          );
        } else {
          toast.success(
            "Booking cancelled successfully"
          );
        }
      } else {
        const label =
          variables.status === "completed"
            ? "completed"
            : "unattended";

        toast.success(
          `Booking marked as ${label}`
        );
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "overdue-bookings",
            instructorEmail,
            instructorId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["bookings"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["booking"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "instructor-bookings",
          ],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Failed to update booking status"
      );
    },
  });

  const handleUpdateStatus = (status) => {
    const bookingId = oid(booking?._id);

    if (!bookingId) {
      toast.error("Booking ID missing");
      return;
    }

    updateStatusMutation.mutate({
      bookingId,
      status,
    });
  };

  const handleOpenCancelModal = () => {
    const bookingId = oid(booking?._id);

    if (!bookingId) {
      toast.error("Booking ID missing");
      return;
    }

    setCancelForm(
      createInitialCancelForm()
    );

    setShowCancelModal(true);
  };

  const submitCancellation = () => {
    const bookingId = oid(booking?._id);

    if (!bookingId) {
      toast.error("Booking ID missing");
      return;
    }

    const selectedReason =
      cancellationReasonMap[
        cancelForm.reasonCode
      ];

    if (!selectedReason) {
      toast.error(
        "Please select a cancellation reason"
      );
      return;
    }

    if (
      cancelForm.reasonCode === "other" &&
      !cancelForm.customReason.trim()
    ) {
      toast.error(
        "Please write the cancellation reason"
      );
      return;
    }

    if (
      cancelForm.sendCustomSms &&
      !cancelForm.customSms.trim()
    ) {
      toast.error(
        "Please write the cancellation SMS"
      );
      return;
    }

    updateStatusMutation.mutate({
      bookingId,
      status: "cancelled",

      cancellation: {
        reasonCode:
          cancelForm.reasonCode,

        reasonCategory:
          selectedReason.category,

        reasonLabel:
          selectedReason.label,

        customReason:
          cancelForm.reasonCode === "other"
            ? cancelForm.customReason.trim()
            : "",

        clientForfeit: Number(
          cancelForm.clientForfeit || 0
        ),

        blockClient: Boolean(
          cancelForm.blockClient
        ),

        sendCustomSms: Boolean(
          cancelForm.sendCustomSms
        ),

        customSms:
          cancelForm.sendCustomSms
            ? cancelForm.customSms.trim()
            : "",

        cancelledBy: {
          userId: oid(userData?._id),
          name: userData?.name || "",
          role: userData?.role || "",
        },
      },
    });
  };

  const handleSnooze = () => {
    const bookingId = oid(booking?._id);

    if (!bookingId) return;

    setSnoozed((previous) => ({
      ...previous,
      [bookingId]:
        Date.now() + 10 * 60 * 1000,
    }));

    toast.info(
      "Reminder hidden for 10 minutes"
    );
  };

  if (
    !isInstructor ||
    isLoading ||
    !booking
  ) {
    return null;
  }

  const total = overdueBookings.length;
  const isSaving =
    updateStatusMutation.isPending;

  if (showCancelModal) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4">
        <CancelBookingModal
          booking={booking}
          form={cancelForm}
          setForm={setCancelForm}
          saving={isSaving}
          onClose={() => {
            if (!isSaving) {
              setShowCancelModal(false);
              setCancelForm(
                createInitialCancelForm()
              );
            }
          }}
          onConfirm={submitCancellation}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-primary px-6 py-4 text-white">
          <h2 className="text-xl font-bold">
            Update Booking Status
          </h2>

          <p className="text-sm text-white/90">
            This booking time has already passed.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {total > 1 && (
            <div className="rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800">
              {total} overdue bookings need
              status update. Showing{" "}
              {activeIndex + 1} of {total}.
            </div>
          )}

          <div className="rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {booking.serviceName ||
                    "Booking"}
                </h3>

                <p className="text-sm text-gray-500">
                  Invoice #
                  {booking.invoiceNo || "N/A"}
                </p>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                {booking.status || "pending"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
              <p>
                <b>Client:</b>{" "}
                {booking.userName ||
                  booking.clientName ||
                  "Unknown"}
              </p>

              <p>
                <b>Date:</b>{" "}
                {formatBookingDate(
                  booking.bookingDate
                )}
              </p>

              <p>
                <b>Time:</b>{" "}
                {booking.bookingTime || ""}
              </p>

              <p>
                <b>Duration:</b>{" "}
                {booking.duration || ""}
              </p>

              <p>
                <b>Suburb:</b>{" "}
                {booking.suburb ||
                  booking.location ||
                  ""}
              </p>

              <p>
                <b>Address:</b>{" "}
                {booking.address ||
                  booking.clientAddress ||
                  ""}
              </p>

              <p>
                <b>Payment:</b>{" "}
                {booking.paymentStatus ||
                  "unpaid"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={() =>
                handleUpdateStatus(
                  "completed"
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              <FaCheckCircle />
              Completed
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() =>
                handleUpdateStatus(
                  "unattended"
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              <FaUserClock />
              Unattended
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleOpenCancelModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              <FaTimesCircle />
              Cancelled
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={
                isSaving ||
                activeIndex === 0
              }
              onClick={() =>
                setActiveIndex((previous) =>
                  Math.max(previous - 1, 0)
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSnooze}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
            >
              Remind me later
            </button>

            <button
              type="button"
              disabled={
                isSaving ||
                activeIndex >= total - 1
              }
              onClick={() =>
                setActiveIndex((previous) =>
                  Math.min(
                    previous + 1,
                    total - 1
                  )
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>

          {isSaving && (
            <p className="text-center text-sm text-gray-500">
              Updating booking status...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}