"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookingRootRedirect() {
  const { bookingId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (bookingId) {
      router.replace(`/instructor-bookings/${bookingId}/booking`);
    }
  }, [bookingId, router]);

  return null;
}
