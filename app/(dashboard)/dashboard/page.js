"use client";

import React, { useEffect } from "react";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useUserData } from "@/app/hooks/useUserData";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();
  const { data: userData, isLoading } = useUserData();

  useEffect(() => {
    if (isLoading) return;

    if (!userData) {
      router.replace("/login");
      return;
    }

    if (userData.role === "user") {
      router.replace("/dashboard/user");
      return;
    }

    if (userData.role === "instructor") {
      router.replace("/dashboard/instructor");
      return;
    }

    if (userData.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }
  }, [isLoading, userData, router]);


  return <LoadingSpinner />;
}
