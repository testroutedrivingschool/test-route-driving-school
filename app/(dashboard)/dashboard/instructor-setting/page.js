"use client";

import React, { useEffect, useState } from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import { toast } from "react-toastify";
import useAuth from "@/app/hooks/useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";

export default function InstructorSetting() {
  const [emailScheduleTime, setEmailScheduleTime] = useState("00:00");
  const { user } = useAuth();

  const { data: instructorData = {}, isLoading } = useQuery({
    queryKey: ["instructor", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmailScheduleTime(instructorData.emailScheduleTime || "00:00");
  }, [instructorData]);

  const scheduleOptions = [
    { label: "Send at MidNight 12 AM", value: "00:00" },
    { label: "Send at 6 AM", value: "06:00" },
    { label: "Send at MidDay 12 PM", value: "12:00" },
    { label: "Send Day Prior at 6 PM", value: "18:00" },
  ];

  const handleSave = async () => {
    try {
      await axios.patch("/api/instructors", {
        email: user.email,
        emailScheduleTime,
      });
      toast.success(
        `Daily email schedule set to: ${
          scheduleOptions.find((opt) => opt.value === emailScheduleTime)?.label
        }`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update schedule");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Instructor Settings</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="font-medium mb-2">Email Daily Schedule:</label>
        <select
          className="border border-gray-300 rounded p-2"
          value={emailScheduleTime}
          onChange={(e) => setEmailScheduleTime(e.target.value)}
        >
          {scheduleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <PrimaryBtn onClick={handleSave}>Save Settings</PrimaryBtn>
    </div>
  );
}
