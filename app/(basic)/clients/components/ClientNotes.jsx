/* eslint-disable @next/next/no-img-element */
"use client";

import {useMemo, useState} from "react";
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {FaClipboardList} from "react-icons/fa";
import {useUserData} from "@/app/hooks/useUserData";
import Modal from "@/app/shared/ui/Modal";
import getAvatarSrc from "@/app/utils/getAvatarSrc";
import {toast} from "react-toastify";
const packageNames = [
  {
    id: "6952db6d0ecdcbdb6246d740",
    name: "Disability Test Package with 1 hour lesson",
  },
  {id: "6952e6047fe9723b87c6aafe", name: "1 hour lesson"},
  {id: "6952f26c7fe9723b87c6aaff", name: "1.5 hours lesson"},
  {id: "695be0001f72e6c2fa81e093", name: "1 hour Night Driving Lesson"},
  {
    id: "695be1371f72e6c2fa81e094",
    name: "1 hour 30 mins Driving Test Assessment",
  },
  {id: "695be2ce1f72e6c2fa81e095", name: "2 hours Driving Lesson Package"},
  {id: "695be4871f72e6c2fa81e096", name: "2 Hours Night Driving Lesson"},
  {id: "695beb281f72e6c2fa81e097", name: "2 Hours Driving Test Assessment"},
  {id: "695bebe91f72e6c2fa81e098", name: "Test Package with 1 hour lesson"},
  {id: "695bf45c1f72e6c2fa81e099", name: "Parking Package"},
  {id: "695bf85c1f72e6c2fa81e09a", name: "City Driving Package"},
  {id: "695bf9551f72e6c2fa81e09b", name: "Highway Package"},
  {id: "695bfa251f72e6c2fa81e09c", name: "Test Package with 2 hours lesson"},
  {id: "695bfae01f72e6c2fa81e09d", name: "5 Hours Lesson Package"},
  {id: "695bfb6b1f72e6c2fa81e09e", name: "10 Hours Lesson Pack"},
  {id: "695bfbe11f72e6c2fa81e09f", name: "20 Hours Lesson Pack"},
  {
    id: "695bfc9d1f72e6c2fa81e0a0",
    name: "Disability Test Package with 2 hours lesson",
  },
];

export default function ClientNotes({clientId}) {
  const [q, setQ] = useState("");

  // ✅ modal states
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("booking");
  const [bookingTitle, setBookingTitle] = useState("");
  const [text, setText] = useState("");

  const queryClient = useQueryClient();
  const {data: user, isUserLoading} = useUserData();

  const {data: notes = [], isLoading} = useQuery({
    queryKey: ["clientNotes", clientId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/clients/${clientId}/notes`);
        return res.data;
      } catch (err) {
        const msg =
          err?.response?.data?.error || err?.message || "Failed to load notes";
        toast.error(msg);
      }
    },
    enabled: !!clientId,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (payload) => {
      try {
        const res = await axios.post(`/api/clients/${clientId}/notes`, payload);
        return res.data;
      } catch (err) {
        const msg =
          err?.response?.data?.error || err?.message || "Failed to create note";
        toast.error(msg);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clientNotes", clientId],
      });

      setText("");
      setBookingTitle("");
      setType("booking");
      setOpen(false);
    },
  });
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId) => {
      const res = await axios.delete(
        `/api/clients/${clientId}/notes/${noteId}`,
      );
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Note deleted");
      await queryClient.invalidateQueries({
        queryKey: ["clientNotes", clientId],
      });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error || err?.message || "Failed to delete note";
      toast.error(msg);
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter((n) => {
      const hay = [n.type, n.text, n.createdBy?.name, n.bookingTitle]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [notes, q]);

  const summary = useMemo(() => {
    let bookingNotes = 0;
    let generalNotes = 0;

    for (const n of notes) {
      if ((n.type || "").toLowerCase() === "booking") bookingNotes += 1;
      else generalNotes += 1;
    }

    return {
      bookingNotes,
      generalNotes,
      phoneCalls: 0,
      indirect: 0,
    };
  }, [notes]);

  const onAddNote = () => {
    const t = text.trim();
    if (!t) return alert("Note text is required");

    const isBooking = type === "booking" && bookingTitle.trim();

    const payload = {
      type: isBooking ? "booking" : "general",
      text: t,
      bookingTitle: isBooking ? bookingTitle.trim() : "",
      createdBy: {
        userId: user?._id || "",
        name: user?.name || "",
        ...(user?.photo && {photo: user.photo}),
        ...(user?.photoKey && {photoKey: user.photoKey}),
        role: user?.role || "instructor",
      },
    };

    createNoteMutation.mutate(payload);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white border border-border-color rounded-md p-4 relative">
      {/* Top summary row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-x-10 gap-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Booking Notes:</span>
            <span>{summary.bookingNotes}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">General Notes:</span>
            <span>{summary.generalNotes}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Phone Calls:</span>
            <span>{summary.phoneCalls}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">
              Indirect Interactions:
            </span>
            <span>{summary.indirect}</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 justify-end">
          <button
            type="button"
            className="h-11 px-10 rounded-md bg-primary text-white font-semibold"
            onClick={() => setOpen(true)}
            disabled={isUserLoading || !user}
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-5 flex w-full items-center overflow-hidden rounded-md border border-border-color bg-white">
        <div className="flex h-10 w-12 items-center justify-center border-r border-border-color bg-gray-50">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-neutral"
          >
            <path
              d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="h-10 w-full px-3 outline-none"
        />
      </div>

      {/* Table header */}
      <div className="mt-4 overflow-x-auto border border-border-color rounded-md">
        <div className="w-full md:min-w-[820px]">
          <div className="grid grid-cols-12 bg-[#4a4a4a] text-white text-sm font-semibold px-4 py-3">
            <div className="col-span-3 text-center">Created</div>
            <div className="col-span-9">Text</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No notes found.</div>
          ) : (
            filtered.map((n) => {
              console.log(n);
              const avatarSrc = n?.createdBy?.photo
                ? n.createdBy.photo
                : n?.createdBy?.photoKey
                  ? `/api/storage/proxy?key=${encodeURIComponent(n.createdBy.photoKey)}`
                  : "/profile-avatar.png";
              return (
                <div
                  key={n._id}
                  className=" py-4 border-t border-border-color bg-gray-100"
                >
                  <div className="grid grid-cols-12 gap-3 ">
                    {/* Created column */}
                    <div className="col-span-3 flex flex-col items-start gap-2 px-4">
                      <img
                        src={avatarSrc}
                        alt=""
                        className="h-18 w-18 rounded-md object-cover"
                      />
                    </div>

                    {/* Text column */}
                    <div className="col-span-9 flex items-start gap-6">
                      <div className="text-gray-700">
                        <FaClipboardList className="text-5xl text-gray-700" />
                      </div>

                      <div>
                        <span className="text-primary text-sm leading-6 block">
                          {n.text || ""}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteNoteMutation.mutate(n._id);
                          }}
                          disabled={deleteNoteMutation.isPending}
                          className="mt-2 text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
                        >
                          Delete Note
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-left text-sm text-primary px-4 mt-2">
                    <div className="font-semibold">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString("en-AU")
                        : ""}
                    </div>
                    <div>
                      {n.type === "booking" ? "Session Note" : "General Note"}
                      by <strong>{n.createdBy?.name || "—"}</strong>
                    </div>
                  </div>

                  <div className="text-primary text-sm">
                    {n.bookingTitle || ""}
                  </div>

                  <div className="text-xs text-gray-500 px-4 mt-2">
                    Updated{" "}
                    {n.updatedAt
                      ? new Date(n.updatedAt).toLocaleDateString("en-AU")
                      : ""}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ✅ Add Note Modal */}
      {open && (
        <Modal
          onClose={() => {
            if (!createNoteMutation.isPending) setOpen(false);
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Add Note</h3>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <label className="col-span-4 text-sm font-medium text-gray-900">
                Note Type
              </label>
              <select
                className="col-span-8 input-class py-2!"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="booking">Booking Note</option>
                <option value="general">General Note</option>
              </select>
            </div>

            {type === "booking" && (
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-4 text-sm font-medium text-gray-900">
                  Booking Title
                </label>
                <select
                  className="col-span-8 input-class py-2!"
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                >
                  {packageNames.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name}
                    </option>
                  ))}

                  <option value="general">General Note</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-12 gap-3 items-start">
              <label className="col-span-4 text-sm font-medium text-gray-900 pt-2">
                Note
              </label>
              <textarea
                className="col-span-8 input-class py-2! min-h-[120px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write note..."
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              className="h-10 px-5 rounded-md border border-border-color hover:bg-gray-50 font-semibold"
              onClick={() => setOpen(false)}
              disabled={createNoteMutation.isPending}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onAddNote}
              disabled={createNoteMutation.isPending}
              className="h-10 px-8 rounded-md bg-primary text-white font-semibold disabled:opacity-70"
            >
              {createNoteMutation.isPending ? "Saving..." : "Add Note"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
