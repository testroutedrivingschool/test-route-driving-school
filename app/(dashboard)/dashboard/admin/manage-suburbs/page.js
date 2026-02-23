"use client";

import React, { useMemo, useState } from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Modal from "@/app/shared/ui/Modal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

const zones = ["South", "North", "East", "West", "Central"];

export default function ManageSuburbs() {
  // ===== Add modal state =====
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSuburb, setNewSuburb] = useState({ name: "", zone: "South" });
  const [isAdding, setIsAdding] = useState(false);

  // ===== Delete confirm modal state =====
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ===== View modal state =====
  const [selectedSuburb, setSelectedSuburb] = useState(null);

  // ===== Filters =====
  const [search, setSearch] = useState("");

  // ===== Load locations =====
  const {
    data: locations = [],
    isLoading: isLocationsLoading,
    refetch: refetchLocations,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data;
    },
  });

  // ===== Filtered view =====
  const filteredLocations = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return locations;

    return locations.filter((loc) =>
      (loc?.name || "").toLowerCase().includes(q)
    );
  }, [locations, search]);

  // ===== Add suburb =====
  const handleAddSuburb = async () => {
    const name = newSuburb.name.trim();
    const zone = (newSuburb.zone || "").trim();

    if (!name) return toast.error("Suburb name is required");
    if (!zone) return toast.error("Zone is required");

    try {
      setIsAdding(true);

      await axios.post("/api/locations", { name, zone });

      toast.success("Suburb added!");
      setIsAddOpen(false);
      setNewSuburb({ name: "", zone: "South" });

      await refetchLocations();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add suburb");
    } finally {
      setIsAdding(false);
    }
  };

  // ===== Delete suburb =====
  const confirmDelete = async () => {
    if (!deleteTarget?._id) return toast.error("Missing suburb id");

    try {
      setIsDeleting(true);

      await axios.delete(`/api/locations?id=${deleteTarget._id}`);

      toast.success("Suburb deleted");
      setDeleteTarget(null);

      await refetchLocations();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete suburb");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLocationsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 left-0 z-50 bg-white py-3 flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">Manage Locations</h1>

        <PrimaryBtn
          onClick={() => setIsAddOpen(true)}
          className="justify-center text-sm! md:text-base"
        >
          <FaPlus /> Add Suburb
        </PrimaryBtn>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search suburb..."
          className="flex-1 p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Suburb
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Zone
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredLocations.map((loc) => (
                <tr
                  key={loc?._id || loc?.name}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-left">{loc?.name}</td>
                  <td className="py-4 px-6 text-left">{loc?.zone || "-"}</td>

                  <td className="py-4 px-6 flex justify-center gap-2">
                    <PrimaryBtn
                      className="text-sm px-2 py-1"
                      onClick={() => setSelectedSuburb(loc)}
                    >
                      View
                    </PrimaryBtn>

                    <PrimaryBtn
                      className="text-sm px-2 py-1 bg-red-600 hover:bg-red-700"
                      onClick={() => setDeleteTarget(loc)}
                    >
                      <FaTrash /> Delete
                    </PrimaryBtn>
                  </td>
                </tr>
              ))}

              {filteredLocations.length === 0 && (
                <tr>
                  <td className="py-8 px-6 text-center text-gray-500" colSpan={3}>
                    No suburbs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selectedSuburb && (
        <Modal onClose={() => setSelectedSuburb(null)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{selectedSuburb.name}</h2>
            <p>
              <b>Zone:</b> {selectedSuburb.zone || "-"}
            </p>
            <PrimaryBtn onClick={() => setSelectedSuburb(null)}>Close</PrimaryBtn>
          </div>
        </Modal>
      )}

      {/* Add Modal */}
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
                  setNewSuburb((p) => ({ ...p, name: e.target.value }))
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
                  setNewSuburb((p) => ({ ...p, zone: e.target.value }))
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
              <PrimaryBtn onClick={() => setIsAddOpen(false)}>Cancel</PrimaryBtn>
              <PrimaryBtn onClick={handleAddSuburb} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add"}
              </PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Delete Suburb</h2>
            <p>
              Are you sure you want to delete <b>{deleteTarget.name}</b>?
            </p>

            <div className="flex justify-end gap-2">
              <PrimaryBtn onClick={() => setDeleteTarget(null)}>Cancel</PrimaryBtn>
              <PrimaryBtn onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
