"use client";

import React, {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {FiPlus, FiBell} from "react-icons/fi";
import {FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Modal from "@/app/shared/ui/Modal"; // make sure you have a modal component

export default function AddAnnouncements() {
  const queryClient = useQueryClient();
  const {data: announcements = [], isLoading} = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axios.get("/api/announcements");
      return res.data;
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Add Announcement
  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      return toast.error("Please enter all fields");
    }

    try {
      const res = await axios.post("/api/announcements", newAnnouncement);
      if (res.status === 201) {
        toast.success("Announcement added successfully!");
        setNewAnnouncement({title: "", message: ""});
        queryClient.invalidateQueries(["announcements"]);
        setShowForm(false);
      }
    } catch (err) {
      toast.error("Failed to add announcement");
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      const res = await axios.delete(`/api/announcements?id=${id}`);
      if (res.status === 200) {
        toast.success("Announcement deleted successfully!");
        queryClient.invalidateQueries(["announcements"]);
      }
    } catch (err) {
      toast.error("Failed to delete announcement");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg md:text-3xl font-bold flex items-center gap-2 text-gray-900">
          <FiBell className="text-primary text-3xl" /> Announcements
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          <FiPlus /> Add Announcement
        </button>
      </div>

      {/* Add Announcement Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-border-color">
          <h2 className="text-xl font-bold mb-4">Add New Announcement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    title: e.target.value,
                  })
                }
                className="border border-border-color p-2 rounded-lg w-full"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="mb-1 font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                placeholder="Enter announcement message"
                value={newAnnouncement.message}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    message: e.target.value,
                  })
                }
                className="border border-border-color p-2 rounded-lg w-full"
              />
            </div>
          </div>
          <button
            onClick={handleAddAnnouncement}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Save Announcement
          </button>
        </div>
      )}

      {/* Announcements Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-border-color">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {announcements.length === 0 ? (
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                <h2 className="font-bold">No Announcements Found</h2>
              </td>
            ) : (
              announcements.map((announcement) => (
                <tr key={announcement._id} className="font-montserrat">
                  <td className="px-6 py-4 text-gray-900 font-semibold">
                    {announcement.title}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {announcement.message.length > 50
                      ? `${announcement.message.slice(0, 50)}...`
                      : announcement.message}
                    {announcement.message.length > 50 && (
                      <button
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="text-primary hover:underline ml-2 text-sm"
                      >
                        View Full
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="flex items-center gap-1 justify-center px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to show full message */}
      {selectedAnnouncement && (
        <Modal onClose={() => setSelectedAnnouncement(null)}>
          <h2 className="text-xl font-bold mb-2">
            {selectedAnnouncement.title}
          </h2>
          <p className="text-gray-700">{selectedAnnouncement.message}</p>
          <button
            onClick={() => setSelectedAnnouncement(null)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}
