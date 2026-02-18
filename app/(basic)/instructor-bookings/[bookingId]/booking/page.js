"use client";

import BookingDetailsCard from "../../components/BookingDetailsCard";
import {useBooking} from "../BookingContext";

export default function BookingBookingTabPage() {
  const booking = useBooking();

  return <BookingDetailsCard booking={booking} />;
}
