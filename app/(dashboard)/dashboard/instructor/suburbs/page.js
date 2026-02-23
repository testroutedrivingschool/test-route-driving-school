"use client";

import React, {useState, useEffect} from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Modal from "@/app/shared/ui/Modal";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import useAuth from "@/app/hooks/useAuth";
import {toast} from "react-toastify";
import {FaPlus} from "react-icons/fa";

const dayShort = [
  {label: "M", key: "mon"},
  {label: "T", key: "tue"},
  {label: "W", key: "wed"},
  {label: "TH", key: "thu"},
  {label: "F", key: "fri"},
  {label: "S", key: "sat"},
  {label: "SU", key: "sun"},
];
const zones = ["South", "North", "East", "West", "Central"];

export default function Suburbs() {
  const {user} = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSuburb, setNewSuburb] = useState({name: "", zone: "South"});
  const [isAdding, setIsAdding] = useState(false);
  const {
    data: suburbs = [],
    isLoading: isSuburbsLocations,
    refetch: refetchLocations,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data;
    },
  });

  const {data: instructorData = {}, isLoading: isInstructorLoading} = useQuery({
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
  const ALL_DAYS = dayShort.map((d) => d.label);

  // Initialize suburbsData after fetching
  useEffect(() => {
    if (
      !isSuburbsLocations &&
      !isInstructorLoading &&
      suburbs.length &&
      !suburbsData.length
    ) {
      const initialSuburbs = suburbs.map((loc) => {
        const name = loc.name; // <-- get the name string
        const suburbData = instructorData.suburbs?.find((s) => s.name === name);

        return {
          name,
          active: suburbData ? suburbData.availableDays.length > 0 : false,
          availableDays: suburbData
            ? [...suburbData.availableDays]
            : [...ALL_DAYS],
        };
      });
      setSuburbsData(initialSuburbs);
    }
  }, [
    suburbs,
    instructorData,
    isSuburbsLocations,
    isInstructorLoading,
    suburbsData.length,
    ALL_DAYS,
  ]);

  const toggleActiveByName = (name) => {
    setSuburbsData((prev) =>
      prev.map((s) => (s.name === name ? {...s, active: !s.active} : s)),
    );
  };

  const toggleDayByName = (name, day) => {
    setSuburbsData((prev) =>
      prev.map((s) => {
        if (s.name !== name) return s;
        const exists = s.availableDays.includes(day);
        return {
          ...s,
          availableDays: exists
            ? s.availableDays.filter((d) => d !== day)
            : [...s.availableDays, day],
        };
      }),
    );
  };

  const handleAddSuburb = async () => {
    const name = newSuburb.name.trim();
    const zone = newSuburb.zone?.trim();

    if (!name) return toast.error("Suburb name is required");
    if (!zone) return toast.error("Zone is required");

    try {
      setIsAdding(true);

      const res = await axios.post("/api/locations", {name, zone});

      toast.success("Suburb added!");
      setIsAddOpen(false);
      setNewSuburb({name: "", zone: "South"});

      // refresh locations list
      await refetchLocations();

      // also push into local table instantly
      setSuburbsData((prev) => {
        const exists = prev.some(
          (s) => s.name.toLowerCase() === name.toLowerCase(),
        );
        if (exists) return prev;
        return [...prev, {name, active: true, availableDays: [...ALL_DAYS]}];
      });
    } catch (err) {
  
      toast.error(err?.response?.data?.message || "Failed to add suburb");
    } finally {
      setIsAdding(false);
    }
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
     
      toast.error(err?.response?.data?.message || "Failed to update suburbs availability");
    }
  };

  // Filtered view
  const filteredSuburbs = suburbsData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesActive = showActiveOnly ? s.active : true;
    return matchesSearch && matchesActive;
  });

  if (isInstructorLoading || isSuburbsLocations) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
        <div className="sticky top-18.5 md:top-0 z-30 bg-white border-b border-gray-200 py-3 flex justify-between items-center px-2">
          <h1 className="text-lg md:text-3xl font-bold">Manage Suburbs Availability</h1>

          <div className="flex gap-2">
            <PrimaryBtn
              onClick={() => setIsAddOpen(true)}
              className="justify-center text-xs! md:text-base px-2! md:px-4! "
            >
              <FaPlus className="hidden md:block"/> Add Suburb
            </PrimaryBtn>

            <PrimaryBtn
              onClick={handleSave}
              className="justify-center text-xs! md:text-base px-2! md:px-4! "
            >
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
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Active
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Suburb
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Days Available
                </th>
             
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuburbs.map((suburb) => (
                <tr
                  key={suburb.name}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 md:px-4 py-4  text-center">
                    <input
                      type="checkbox"
                      checked={suburb.active}
                      onChange={() => toggleActiveByName(suburb.name)}
                    />
                  </td>

                  <td className="px-2 md:px-4 py-4 text-xs md:text-base font-medium">{suburb.name}</td>

                  <td className="px-2 md:px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {dayShort.map((day) => (
                        <span
                          key={day.key}
                          onClick={() =>
                            toggleDayByName(suburb.name, day.label)
                          }
                          className={`cursor-pointer px-2 md:px-4  py-1 rounded text-xs font-semibold ${
                            suburb.availableDays.includes(day.label)
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {day.label}
                        </span>
                      ))}
                    </div>
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
            <p>
              <b>Active:</b> {selectedSuburb.active ? "Yes" : "No"}
            </p>
            <p>
              <b>Days Available:</b> {selectedSuburb.availableDays.join(", ")}
            </p>
            <PrimaryBtn onClick={() => setSelectedSuburb(null)}>
              Close
            </PrimaryBtn>
          </div>
        </Modal>
      )}
      {isAddOpen && (
        <Modal onClose={() => setIsAddOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add New Suburb</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Suburb Name</label>
              <input
                type="text"
                value={newSuburb.name}
                onChange={(e) =>
                  setNewSuburb((p) => ({...p, name: e.target.value}))
                }
                placeholder="e.g. Kogarah, NSW"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <select
                value={newSuburb.zone}
                onChange={(e) =>
                  setNewSuburb((p) => ({...p, zone: e.target.value}))
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <PrimaryBtn onClick={() => setIsAddOpen(false)}>
                Cancel
              </PrimaryBtn>
              <PrimaryBtn onClick={handleAddSuburb} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add"}
              </PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
