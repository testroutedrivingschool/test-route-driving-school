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



const DURATION_LABELS = ["1 Hr", "1.5 Hr", "2 Hr", "3 Hr", "4 Hr", "5 Hr", "6 Hr"];

export default function ManageInstructors() {
  const queryClient = useQueryClient();
  const [selectedInstructor, setSelectedInstructor] = useState(null);
const [openSections, setOpenSections] = useState({
  areas: true,
  services: true,
  files: true,
});

const toggleSection = (key) => {
  setOpenSections((s) => ({ ...s, [key]: !s[key] }));
};
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
const selectedEmail = (selectedInstructor?.email || "").trim().toLowerCase();
const {
  data: instructorFiles = [],
  isLoading: isFilesLoading,
  isError: isFilesError,
} = useQuery({
  queryKey: ["instructor-files", selectedEmail],
  enabled: !!selectedEmail, 
  queryFn: async () => {
    const res = await axios.get(`/api/instructor-files?email=${encodeURIComponent(selectedEmail)}`);
    return res.data || [];
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

const deleteFileMutation = useMutation({
  mutationFn: async (key) => {
    const res = await axios.delete(`/api/instructor-files?key=${encodeURIComponent(key)}`);
    return res.data;
  },
  onSuccess: (data) => {
    toast.success(data?.message || "File deleted");
    queryClient.invalidateQueries(["instructor-files", selectedEmail]);
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "Failed to delete file");
  },
});
const handleDeleteFile = async (file) => {
  const result = await Swal.fire({
    title: "Delete this file?",
    text: file?.originalName || "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, delete",
  });

  if (!result.isConfirmed) return;
  deleteFileMutation.mutate(file.key);
};
const openFile = async (key) => {
  try {
    const { data } = await axios.post("/api/storage/download-url", { key });
    if (data?.url) window.open(data.url, "_blank", "noopener,noreferrer");
    else toast.error("Failed to get download URL");
  } catch (err) {
    toast.error("Failed to open file");
  }
};
const handleView = (ins) => {
  setSelectedInstructor(ins);
  setOpenSections({ areas: true, services: true, files: true });
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
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
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
                    onClick={() => handleView(ins)}
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
{/* Mobile Cards */}
<div className="md:hidden space-y-3">
  {instructors.map((ins) => {
    const avatarSrc = ins?.photo
      ? ins.photo
      : ins?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(ins.photoKey)}`
      : "/profile-avatar.png";

    return (
      <div
        key={ins._id}
        className="bg-white rounded-xl border border-border-color shadow-sm p-4 w-full"
      >
        {/* top */}
        <div className="flex items-center gap-3">
          <Image
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover shrink-0"
            src={avatarSrc}
            alt={ins.name || "user"}
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{ins.name}</div>
            <div className="text-xs text-gray-500">
              ID: {ins._id.slice(-8)}
            </div>
            <div className="text-sm text-gray-700 truncate flex items-center gap-2">
              <FiMail className="text-gray-400 shrink-0" />
              <span className="truncate">{ins.email}</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <FaPhone className="text-gray-400 shrink-0" />
              <span className="truncate">{ins.phone || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* status */}
        <div className="mt-3 flex items-center gap-4">
          <select
            value={ins.status}
            onChange={(e) => handleStatusChange(ins, e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <span
            className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap
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

        {/* actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <PrimaryBtn
            className="text-sm w-full justify-center!  py-2!"
            onClick={() => handleView(ins)}
          >
            View
          </PrimaryBtn>

          <PrimaryBtn
            className="bg-red-500 text-sm justify-center! w-full py-2!"
            onClick={() => handleDeleteInstructor(ins)}
          >
            Delete
          </PrimaryBtn>
        </div>
      </div>
    );
  })}
</div>
      {/* Modal */}
      {selectedInstructor && (
        <Modal onClose={() => setSelectedInstructor(null)}>
        <div className=" overflow-y-auto">
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
<div className="mt-4">
  <h3 className="font-bold text-lg text-neutral">Extra Details</h3>
  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <p><b>Suburb:</b> {selectedInstructor.suburb || "N/A"}</p>
    <p><b>State:</b> {selectedInstructor.state || "N/A"}</p>
    <p><b>Post Code:</b> {selectedInstructor.postCode || "N/A"}</p>
    <p><b>Home Phone:</b> {selectedInstructor.homePhone || "N/A"}</p>
    <p><b>Work Phone:</b> {selectedInstructor.workPhone || "N/A"}</p>
    <p><b>Emergency Contact:</b> {selectedInstructor.emergencyContact || "N/A"}</p>
    <p><b>Car Insurance No:</b> {selectedInstructor.carInsuranceNumber || "N/A"}</p>
    <p><b>Insurance Expiry:</b> {selectedInstructor.carInsuranceExpiry || "N/A"}</p>
  </div>
</div>
            {/* Qualifications */}
            <div className="mt-4">
              <h3 className="font-bold text-lg text-neutral mb-1">Qualifications</h3>
              <p className="text-gray-700">
                {selectedInstructor.qualifications || "Not provided"}
              </p>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <h3 className="font-bold text-lg text-neutral mb-1">Bio</h3>
              <p className="text-gray-700">
                {selectedInstructor.bio || "Not provided"}
              </p>
            </div>

            {/* Areas */}
            <SectionToggle id="areas" title="Teaching Areas" />
{openSections.areas && (
  <div className="mt-2">
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
)}
{/* Languages */}
            <div className="mt-2">
  <h3 className="font-semibold mb-1">Languages</h3>
  <div className="flex flex-wrap gap-2">
    {selectedInstructor.languages?.length ? (
      <>
        {selectedInstructor.languages.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
          >
            {lang}
          </span>
        ))}
        {selectedInstructor.customLanguage ? (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
            {selectedInstructor.customLanguage}
          </span>
        ) : null}
      </>
    ) : (
      <span className="text-gray-500">No languages selected</span>
    )}
  </div>
</div>

          
            {/* Services */}
<SectionToggle id="services" title="Services & Pricing" />
{openSections.services && (
  <div className="mt-2">
    {selectedInstructor.services?.length ? (
      <div className="mt-3 space-y-3">
        {selectedInstructor.services.map((srv, idx) => {
          const prices = srv?.prices || [];
          const active = srv?.activeDurations || [];

          const activeItems = prices
            .map((p, i) => ({ price: p, active: active?.[i], label: DURATION_LABELS[i] }))
            .filter((x) => x.active && x.price !== null && x.price !== undefined);

          return (
            <div key={`${srv.name}-${idx}`} className="border border-border-color rounded-lg p-3">
              <div className="font-semibold">{srv.name}</div>

              {activeItems.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeItems.map((x, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                      {x.label}: ${x.price}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-2">No active pricing set</div>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-500 mt-2">No services added</p>
    )}
  </div>
)}

{/* Instructor Files */}
<SectionToggle id="files" title="Uploaded Files"   open={openSections.files}
  onToggle={(id) => toggleSection(id)}/>
{openSections.files && (
  <div className="mt-2">
    {isFilesLoading ? (
      <div className="text-gray-500 text-sm">Loading files...</div>
    ) : isFilesError ? (
      <div className="text-red-500 text-sm">Failed to load files</div>
    ) : instructorFiles.length ? (
      <div className="space-y-2">
        {instructorFiles.map((f) => (
          <div
            key={f._id}
            className="flex items-center justify-between gap-3 border border-border-color rounded-lg p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{f.originalName || "Unnamed file"}</div>
              <div className="text-xs text-gray-500">
                {(f.size ? (f.size / 1024).toFixed(1) : "0")} KB •{" "}
                {f.updatedAt ? new Date(f.updatedAt).toLocaleString() : ""}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openFile(f.key)}
                className="text-primary font-semibold hover:underline text-sm"
              >
                View
              </button>

              <button
                type="button"
                onClick={() => handleDeleteFile(f)}
                className="text-red-600 font-semibold hover:underline text-sm"
                disabled={deleteFileMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-500 text-sm">No files uploaded</div>
    )}
  </div>
)}

          </div>
        </Modal>
      )}
    </div>
  );
}

function SectionToggle({ id, title, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between py-2 mt-4 border-b border-border-color"
    >
      <h3 className="font-bold text-lg text-neutral">{title}</h3>
      <span className="text-sm text-gray-500">{open ? "Hide" : "Show"}</span>
    </button>
  );
}