"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import BookingDetailsCard from "../../components/BookingDetailsCard";

export default function BookingBookingTabPage() {
  const { bookingId } = useParams();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => (await axios.get(`/api/bookings/${bookingId}`)).data,
    enabled: !!bookingId,
  });

  if (isLoading || !booking) return <LoadingSpinner />;

  return <BookingDetailsCard booking={booking} />;
}
