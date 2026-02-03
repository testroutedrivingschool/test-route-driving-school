"use client";

import {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {FaPhone} from "react-icons/fa";
import {FiMail} from "react-icons/fi";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import Modal from "@/app/shared/ui/Modal";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import avatarImg from "@/app/assets/profile-avatar.png";
export default function ManageInstructors() {
  const queryClient = useQueryClient();
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const {
    data: instructors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axios.get("/api/instructors");
      return res.data;
    },
  });

  // Update instructor status
const updateStatusMutation = useMutation({
  mutationFn: async ({ email, status }) => {
    const res = await axios.patch("/api/instructors", {
      email,
      status,
      emailScheduleTime: "00:00", // include if you need
    });
    return res.data;
  },
  onSuccess: () => {
    toast.success("Instructor status updated");
    queryClient.invalidateQueries(["instructors"]);
  },
  onError: () => toast.error("Failed to update status"),
});

  // Delete instructor
  const deleteInstructorMutation = useMutation({
    mutationFn: async (email) => {
      const res = await axios.delete(`/api/instructors?email=${email}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Instructor deleted");
      queryClient.invalidateQueries(["instructors"]);
    },
    onError: () => {
      toast.error("Failed to delete instructor");
    },
  });

  const handleStatusChange = async (ins, status) => {
    const result = await Swal.fire({
      title: `Change status to "${status}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
    });

    if (!result.isConfirmed) return;

    updateStatusMutation.mutate({email: ins.email, status});
  };

  const handleDeleteInstructor = async (ins) => {
    const result = await Swal.fire({
      title: `Delete ${ins.name}?`,
      text: "This will permanently remove the instructor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteInstructorMutation.mutate(ins.email);
    }
  };

const modalAvatarSrc = selectedInstructor?.photo
  ? selectedInstructor.photo
  : selectedInstructor?.photoKey
  ? `/api/storage/proxy?key=${encodeURIComponent(selectedInstructor.photoKey)}`
  : "/profile-avatar.png";
  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Failed to load instructors
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Instructors</h1>
        <p className="text-neutral mt-2">
          Review, approve or reject instructor applications
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-300">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Instructor
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Contact
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-color">
              {instructors.map((ins) => {
                const avatarSrc = ins?.photo
    ? ins.photo
    : ins?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(ins.photoKey)}`
      : "/profile-avatar.png"
                return(
                <tr
                  key={ins._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Instructor */}
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Image
                        width={40}
                        height={40}
                        className="h-14 w-14 rounded-full object-cover"
                        src={avatarSrc}
                        alt={ins.name || "user"}
                      />
                      <div className="ml-4">
                        <div className="font-medium">{ins.name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {ins._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <FiMail className="mr-2 text-gray-400" />
                        {ins.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="mr-2 text-gray-400" />
                        {ins.phone || "Not provided"}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <select
                        value={ins.status}
                        onChange={(e) =>
                          handleStatusChange(ins, e.target.value)
                        }
                        className="border rounded-lg px-3 py-1.5 text-sm bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <span
                        className={`ml-3 px-2 py-1 text-xs rounded-full font-medium
                          ${
                            ins.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : ins.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {ins.status}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="flex flex-wrap py-4 px-6 space-x-2">
                    <PrimaryBtn
                      className="text-sm px-2! py-2!"
                      onClick={() => setSelectedInstructor(ins)}
                    >
                      View
                    </PrimaryBtn>

                    <PrimaryBtn
                      className="bg-red-500 text-sm px-2! py-2!"
                      onClick={() => handleDeleteInstructor(ins)}
                    >
                      Delete
                    </PrimaryBtn>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedInstructor && (
        <Modal onClose={() => setSelectedInstructor(null)}>
          <div className="space-y-6 text-sm">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Image
                src={modalAvatarSrc}
                alt={selectedInstructor.name || "Ins"}
                width={80}
                height={80}
                className="w-15 h-15 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{selectedInstructor.name}</h2>
                <p className="text-gray-500">{selectedInstructor.email}</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold
              ${
                selectedInstructor.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : selectedInstructor.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
                >
                  {selectedInstructor.status}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <b>Phone:</b> {selectedInstructor.phone || "N/A"}
              </p>
              <p>
                <b>Date of Birth:</b> {selectedInstructor.dob || "N/A"}
              </p>
              <p>
                <b>Address:</b> {selectedInstructor.address || "N/A"}
              </p>
              <p>
                <b>ABN:</b> {selectedInstructor.abn || "N/A"}
              </p>
              <p>
                <b>Licence Plate:</b> {selectedInstructor.licencePlate || "N/A"}
              </p>
              <p>
                <b>Vehicle Model:</b> {selectedInstructor.vehicleModel || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-neutral">Financial:</h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <b>Account Name:</b>{" "}
                  {selectedInstructor.financial?.accountName || "N/A"}
                </p>
                <p>
                  <b>BSB Number:</b>{" "}
                  {selectedInstructor.financial?.bsbNumber || "N/A"}
                </p>
                <p>
                  <b>Account Number:</b>{" "}
                  {selectedInstructor.financial?.accountNumber || "N/A"}
                </p>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h3 className="font-semibold mb-1">Qualifications</h3>
              <p className="text-gray-700">
                {selectedInstructor.qualifications || "Not provided"}
              </p>
            </div>

            {/* Bio */}
            <div>
              <h3 className="font-semibold mb-1">Bio</h3>
              <p className="text-gray-700">
                {selectedInstructor.bio || "Not provided"}
              </p>
            </div>

            {/* Areas */}
            <div>
              <h3 className="font-semibold mb-1">Teaching Areas</h3>
              <div className="flex flex-wrap gap-2">
                {selectedInstructor.suburbs?.length ? (
  selectedInstructor.suburbs.map((s) => (
    <span key={s.name} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
      {s.name}
    </span>
  ))
) : (
  <span className="text-gray-500">No suburbs selected</span>
)}

              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-semibold mb-1">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {selectedInstructor.languages?.length ? (
                  selectedInstructor.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
                    >
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No languages selected</span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold mb-2">Availability</h3>
              <div className="space-y-2">
                {Object.entries(selectedInstructor.availability || {}).map(
                  ([day, data]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between border border-border-color rounded-lg px-3 py-2"
                    >
                      <span className="font-medium">{day}</span>
                      {data.enabled ? (
                        <span className="text-green-700 text-sm">
                          {data.from} – {data.to}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Unavailable
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
