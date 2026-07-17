"use client";

import {useUserData} from "@/app/hooks/useUserData";
import OverdueBookingStatusModal from "./OverdueBookingStatusModal";

export default function InstructorOverdueModalGate() {
  const {data: userData, isLoading} = useUserData();

  if (isLoading) {
    return null;
  }

  if (userData?.role !== "instructor") {
    return null;
  }

  return <OverdueBookingStatusModal />;
}