"use client";
import React, { useState, useEffect } from "react";
import { useUserData } from "@/app/hooks/useUserData";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GoPackage } from "react-icons/go";
import { toast } from "react-toastify";

// ---- Static services object ----
const servicesObject = {
  "Automatic Driving Lesson": {
    durations: {
      60: { price: 75, active: false },
      90: { price: 110, active: false },
      120: { price: 145, active: false },
      150: { price: null, active: false },
      180: { price: 215, active: false },
    },
  },
  "Driving Test Assessment": {
    durations: {
      60: { price: null, active: false },
      90: { price: 140, active: false },
      120: { price: 175, active: false },
    },
  },
  "Driving Test Package": {
    durations: {
      60: { price: null, active: false },
      90: { price: null, active: false },
      120: { price: null, active: false },
      150: { price: 220, active: false },
      180: { price: null, active: false },
      210: { price: 290, active: false },
      240: { price: 400, active: false },
    },
  },
  "Parking Package": {
    durations: {
      60: { price: null, active: false },
      90: { price: null, active: false },
      120: { price: null, active: false },
      150: { price: null, active: false },
      180: { price: 255, active: false },
    },
  },
  "Highway Package": {
    durations: {
      60: { price: null, active: false },
      90: { price: null, active: false },
      120: { price: null, active: false },
      150: { price: null, active: false },
      180: { price: 270, active: false },
    },
  },
  "Night Driving Lesson": {
    durations: {
      60: { price: 85, active: false },
      90: { price: null, active: false },
      120: { price: 165, active: false },
    },
  },
  "City Driving Package": {
    durations: {
      60: { price: null, active: false },
      90: { price: null, active: false },
      120: { price: null, active: false },
      150: { price: null, active: false },
      180: { price: 270, active: false },
    },
  },
};

export default function InstructorServicePackage() {
  const { data: userData } = useUserData();
  const queryClient = useQueryClient();

  const durationsOrder = [
    { label: "1 Hour", minutes: 60 },
    { label: "1hr 30m", minutes: 90 },
    { label: "2 Hours", minutes: 120 },
    { label: "2hr 30m", minutes: 150 },
    { label: "3 Hours", minutes: 180 },
    { label: "3hr 30m", minutes: 210 },
    { label: "4 Hours", minutes: 240 },
  ];

  const [services, setServices] = useState([]);

  // -------- Fetch Instructor Services --------
const { isLoading } = useQuery({
  queryKey: ["instructor-services", userData?.email],
  enabled: !!userData?.email,
  queryFn: async () => {
    try {
      const res = await axios.get(`/api/instructors?email=${userData.email}`);
      const instructorServices = res.data.services;

      let transformed;

      if (instructorServices?.length) {
        // Transform backend data to match table structure
        transformed = instructorServices.map((s) => ({
          name: s.name,
          durations: durationsOrder.map((d, i) => ({
            minutes: d.minutes,
            label: d.label,
            price: s.prices?.[i] ?? null,
            active: s.activeDurations?.[i] ?? (s.prices?.[i] != null),
          })),
        }));
      } else {
        // Fallback to static object
        transformed = Object.entries(servicesObject).map(([name, s]) => ({
          name,
          durations: durationsOrder.map((d) => ({
            minutes: d.minutes,
            label: d.label,
            price: s.durations[d.minutes]?.price ?? null,
            active: s.durations[d.minutes]?.active ?? false,
          })),
        }));
      }

      setServices(transformed);

      // ✅ Return data for React Query
      return transformed;
    } catch (err) {
      const fallback = Object.entries(servicesObject).map(([name, s]) => ({
        name,
        durations: durationsOrder.map((d) => ({
          minutes: d.minutes,
          label: d.label,
          price: s.durations[d.minutes]?.price ?? null,
          active: s.durations[d.minutes]?.active ?? false,
        })),
      }));
      setServices(fallback);
      return fallback; // ✅ Return fallback
    }
  },
});


  // -------- Mutation to Save Services --------
  const updateMutation = useMutation({
    mutationFn: async (updatedServices) => {
      await axios.patch("/api/instructors", {
        email: userData.email,
        services: updatedServices,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["instructor-services", userData?.email]);
      toast.success("Services updated successfully!");
    },
  });

  // -------- Handlers --------
  const toggleService = (serviceIdx, durationIdx) => {
    const updated = [...services];
    updated[serviceIdx].durations[durationIdx].active =
      !updated[serviceIdx].durations[durationIdx].active;
    setServices(updated);
  };

  const updatePrice = (serviceIdx, durationIdx, newPrice) => {
    const updated = [...services];
    updated[serviceIdx].durations[durationIdx].price = newPrice;
    setServices(updated);
  };

  const saveServices = () => {
    // Convert to backend format
    const payload = services.map((s) => ({
      name: s.name,
      prices: s.durations.map((d) => d.price),
      activeDurations: s.durations.map((d) => d.active),
    }));
    updateMutation.mutate(payload);
  };

  if (isLoading || !services.length) return <p>Loading...</p>;

  return (
    <div className="">
      <h2 className="text-lg md:text-3xl font-bold flex items-center gap-2">
        <GoPackage />
        Manage Packages
      </h2>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[700px] md:min-w-full">
          <table className="w-full border border-border-color table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Service</th>
                {durationsOrder.map((d) => (
                  <th key={d.minutes} className="px-2 py-2">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((service, sIdx) => (
                <tr
                  key={service.name}
                  className={sIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="px-3 py-2 font-semibold whitespace-nowrap">
                    {service.name}
                  </td>
                  {service.durations.map((d, dIdx) => (
                    <td key={d.minutes} className="px-2 py-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {/* Active checkbox */}
                        <input
                          type="checkbox"
                          checked={d.active}
                          onChange={() => toggleService(sIdx, dIdx)}
                        />
                        {/* Price input */}
                        <input
                          type="number"
                          className="w-16 text-center border rounded px-1"
                          value={d.price ?? ""}
                          placeholder="Add $"
                          onChange={(e) =>
                            updatePrice(
                              sIdx,
                              dIdx,
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <PrimaryBtn onClick={saveServices} disabled={updateMutation.isLoading}>
          {updateMutation.isLoading ? "Saving..." : "Save Changes"}
        </PrimaryBtn>
      </div>
    </div>
  );
}
