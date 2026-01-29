/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {useState, useEffect} from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Modal from "@/app/shared/ui/Modal";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import useAuth from "@/app/hooks/useAuth";
import {toast} from "react-toastify";


const dayShort = [
  {label: "M", key: "mon"},
  {label: "T", key: "tue"},
  {label: "W", key: "wed"},
  {label: "TH", key: "thu"},
  {label: "F", key: "fri"},
  {label: "S", key: "sat"},
  {label: "SU", key: "sun"},
];

export default function Suburbs() {
    const { user } = useAuth();
  const { data: suburbs = [], isLoading: isSuburbsLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data;
    },
  });

  const { data: instructorData = {}, isLoading: isInstructorLoading } = useQuery({
    queryKey: ["instructor", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const [suburbsData, setSuburbsData] = useState([]);
  const [selectedSuburb, setSelectedSuburb] = useState(null);
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Initialize suburbsData after fetching
  useEffect(() => {
  if (!isSuburbsLocations && !isInstructorLoading && suburbs.length && !suburbsData.length) {
    const initialSuburbs = suburbs.map((loc) => {
      const name = loc.name; // <-- get the name string
      const suburbData = instructorData.suburbs?.find((s) => s.name === name);

      return {
        name,
        active: suburbData ? suburbData.availableDays.length > 0 : false,
        availableDays: suburbData ? [...suburbData.availableDays] : [],
      };
    });
    setSuburbsData(initialSuburbs);
  }
}, [suburbs, instructorData, isSuburbsLocations, isInstructorLoading, suburbsData.length]);


  const toggleActive = (index) => {
    const newSuburbs = [...suburbsData];
    newSuburbs[index].active = !newSuburbs[index].active;
    setSuburbsData(newSuburbs);
  };

  const toggleDay = (subIndex, day) => {
    const newSuburbs = [...suburbsData];
    const availDays = newSuburbs[subIndex].availableDays;
    if (availDays.includes(day)) {
      newSuburbs[subIndex].availableDays = availDays.filter((d) => d !== day);
    } else {
      newSuburbs[subIndex].availableDays.push(day);
    }
    setSuburbsData(newSuburbs);
  };

  const handleSave = async () => {
    try {
      const activeSuburbs = suburbsData
        .filter((s) => s.active)
        .map((s) => ({
          name: s.name,
          availableDays: s.availableDays,
        }));

      await axios.patch("/api/instructors", {
        email: user.email,
        suburbs: activeSuburbs,
      });

      toast.success("Suburbs availability updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update suburbs availability");
    }
  };

  // Filtered view
const filteredSuburbs = suburbsData.filter((s) => {
  const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
  const matchesActive = showActiveOnly ? s.active : true;
  return matchesSearch && matchesActive;
});


  if (isInstructorLoading || isSuburbsLocations || !suburbsData.length) return <LoadingSpinner />;


  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold ">Manage Suburbs Availability</h1>
        <div className="">
          <PrimaryBtn onClick={handleSave} className="justify-center">
            Update All
          </PrimaryBtn>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />
          Active Only
        </label>
        <input
          type="text"
          placeholder="Search suburb..."
          className="flex-1 p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Active</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Suburb</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Days Available</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuburbs.map((suburb, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={suburb.active}
                      onChange={() => toggleActive(index)}
                    />
                  </td>
                  <td className="py-4 px-6">{suburb.name}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {dayShort.map((day) => (
                        <span
                          key={day.key}
                          onClick={() => toggleDay(index, day.label)}
                          className={`cursor-pointer px-2 py-1 rounded text-xs font-semibold ${
                            suburb.availableDays.includes(day.label)
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {day.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <PrimaryBtn
                      className="text-sm px-2 py-1"
                      onClick={() => setSelectedSuburb(suburb)}
                    >
                      View
                    </PrimaryBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSuburb && (
        <Modal onClose={() => setSelectedSuburb(null)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{selectedSuburb.name}</h2>
            <p><b>Active:</b> {selectedSuburb.active ? "Yes" : "No"}</p>
            <p><b>Days Available:</b> {selectedSuburb.availableDays.join(", ")}</p>
            <PrimaryBtn onClick={() => setSelectedSuburb(null)}>Close</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}
