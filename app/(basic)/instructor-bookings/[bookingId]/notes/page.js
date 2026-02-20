"use client";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {useMemo, useState, useEffect} from "react";
import {useBooking} from "../BookingContext";
import {FaClipboardList} from "react-icons/fa";
import Modal from "@/app/shared/ui/Modal";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {toast} from "react-toastify";

/* ---------- helpers ---------- */
function oid(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.$oid) return v.$oid;
  return String(v);
}

function SessionModal({title, defaultValue, onClose, onSave, saving}) {
  const [text, setText] = useState(defaultValue || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(defaultValue || "");
  }, [defaultValue]);

  return (
    <Modal onClose={onClose}>
      <div className="p-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-neutral mt-1">
          This note will be saved under this client and linked to the booking.
        </p>

        <div className="mt-4">
          <textarea
            className="w-full min-h-[140px] border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-border-color"
            placeholder="Write a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(text)}
            className="px-5 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function NotesTab() {
  const booking = useBooking();
  const clientId = booking?.clientId || booking?.userId || "";
  const bookingId = oid(booking?._id);

  const [q, setQ] = useState("");

  // ✅ Session note modal
  const [sessionOpen, setSessionOpen] = useState(false);
  const [savingSession, setSavingSession] = useState(false);

  const queryClient = useQueryClient();
  const {data: user, isLoading: isUserLoading} = useUserData();

  const {data: notes = [], isLoading} = useQuery({
    queryKey: ["clientNotes", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}/notes`);
      return res.data;
    },
  });

  // ✅ session notes for THIS booking
  const sessionNotes = useMemo(() => {
    return (notes || []).filter((n) => {
      const typeOk = String(n?.type || "").toLowerCase() === "session";
      const noteBookingId = oid(n?.bookingId);
      return typeOk && noteBookingId === bookingId;
    });
  }, [notes, bookingId]);

  const latestSessionNote = sessionNotes?.[0]?.text || "";

  // ✅ save session note (same behavior as sidebar)
  const saveSessionNote = async (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return toast.error("Write something first");
    if (!clientId) return toast.error("Client ID missing");

    try {
      setSavingSession(true);

      await axios.post(`/api/clients/${clientId}/notes`, {
        type: "session",
        text: trimmed,
        bookingId: booking?._id,
        createdBy: {
          userId: user?._id || "",
          name: user?.name || "",
          role: user?.role || "instructor",
          ...(user?.photo ? {photo: user.photo} : {}),
          ...(user?.photoKey ? {photoKey: user.photoKey} : {}),
        },
      });

      await queryClient.invalidateQueries({queryKey: ["clientNotes", clientId]});
      toast.success("Session note saved");
      setSessionOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save note");
    } finally {
      setSavingSession(false);
    }
  };

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

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId) => {
      const res = await axios.delete(`/api/clients/${clientId}/notes/${noteId}`);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Note deleted");
      await queryClient.invalidateQueries({queryKey: ["clientNotes", clientId]});
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Failed to delete note");
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <section>
      <div className="flex justify-between">
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-end">
          {/* ✅ Session Note button now works */}
          <PrimaryBtn onClick={() => setSessionOpen(true)}>Session Note</PrimaryBtn>
        </div>
      </div>

      {/* ✅ Session Modal */}
      {sessionOpen ? (
        <SessionModal
          title="Session Note"
          defaultValue={latestSessionNote}
          saving={savingSession}
          onClose={() => setSessionOpen(false)}
          onSave={saveSessionNote}
        />
      ) : null}

      <div className="mt-4 overflow-x-auto border border-border-color rounded-md">
        <div className="w-full md:min-w-[820px]">
          <div className="grid grid-cols-12 bg-[#4a4a4a] text-white text-sm font-semibold px-4 py-3">
            <div className="col-span-3 text-center">Created</div>
            <div className="col-span-9">Text</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No notes found.</div>
          ) : (
            filtered.map((n) => {
              const avatarSrc = n?.createdBy?.photo
                ? n.createdBy.photo
                : n?.createdBy?.photoKey
                  ? `/api/storage/proxy?key=${encodeURIComponent(n.createdBy.photoKey)}`
                  : "/profile-avatar.png";

              return (
                <div key={n._id} className="py-4 border-t border-border-color bg-gray-100">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3 flex flex-col items-start gap-2 px-4">
                      <Image
                        width={200}
                        height={200}
                        src={avatarSrc}
                        alt="Client Image"
                        className="h-18 w-18 rounded-md object-cover"
                      />
                    </div>

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
                          onClick={() => deleteNoteMutation.mutate(n._id)}
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
                      {n.createdAt ? new Date(n.createdAt).toLocaleString("en-AU") : ""}
                    </div>
                    <div>
                      {n.type === "booking"
                        ? "Booking Note"
                        : n.type === "session"
                          ? "Session Note"
                          : "General Note"}{" "}
                      by <strong>{n.createdBy?.name || "—"}</strong>
                    </div>
                  </div>

                  <div className="text-primary text-sm px-4 mt-1">{n.bookingTitle || ""}</div>

                  <div className="text-xs text-gray-500 px-4 mt-2">
                    Updated {n.updatedAt ? new Date(n.updatedAt).toLocaleDateString("en-AU") : ""}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
