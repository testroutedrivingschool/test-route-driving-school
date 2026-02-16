"use client";

import React, {useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {FiMail} from "react-icons/fi";
import {HiChevronDown} from "react-icons/hi";
import {useRouter} from "next/navigation";
import {useUserData} from "@/app/hooks/useUserData";
import Modal from "@/app/shared/ui/Modal";

function formatAU(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function UserMessages() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const {data: userData, isUserLoading} = useUserData();

  const {
    data: emails = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["user-emails", userData?.email],
    enabled: !!userData?.email,
    queryFn: async () => {
      const res = await axios.get("/api/emails", {
        params: {
          to: userData.email,
          actorType: "USER",
        },
      });
      return res.data.items;
    },
  });

  const rows = useMemo(() => emails || [], [emails]);

  const downloadAttachment = async (key) => {
    const {data} = await axios.post("/api/storage/download-url", {key});
    window.open(data.url, "_blank", "noopener,noreferrer");
  };

  if (isLoading || isUserLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="p-6 bg-white border border-border-color rounded-md">
        <p className="text-sm text-red-600">Failed to load messages.</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="p-6 bg-white border border-border-color rounded-md">
        <h2 className="text-lg font-semibold text-gray-700">No Email Found</h2>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-color rounded-md overflow-hidden">
      {/* header */}
      <div className="bg-secondary text-white px-4 py-2 flex items-center">
        <div className="w-[90px] font-semibold">Type</div>
        <div className="w-[320px] font-semibold">Sent</div>
        <div className="flex-1 font-semibold">Message</div>
        <div className="w-12" />
      </div>

      {isFetching && (
        <div className="px-4 py-2 text-xs text-gray-500 border-b">
          Updating...
        </div>
      )}

      {/* rows */}
      {rows.map((m, idx) => {
        const bg = idx % 2 === 0 ? "bg-white" : "bg-[#f3f3f3]";
        return (
          <div key={m._id} className={`border-b border-border-color ${bg}`}>
            <div className="flex items-start px-4 py-3 gap-3">
              {/* Type */}
              <div className="w-[90px] pt-1 flex items-center">
                <FiMail className="text-3xl text-gray-400" />
              </div>

              {/* Sent */}
              <div className="w-[320px] text-sm text-gray-800">
                <div className="font-medium">
                  {formatAU(m.sentAt || m.createdAt)}
                </div>
                <div className="text-xs mt-1">
                  <span className="font-semibold">To:</span>{" "}
                  <span className="text-gray-700">{m.to || "—"}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">From:</span>{" "}
                  <span className="text-gray-700">
                    {m.from || "testroutedrivingschool@gmail.com"}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 text-sm">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {m.subject || "(No subject)"}
                  {m.hasAttachment ? (
                    <span className="text-xs font-semibold text-neutral">
                      (📎 {m.attachmentName || "Attachment"})
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Chevron -> open modal */}
              <div className="w-12 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center transition"
                  aria-label="Open message"
                >
                  <HiChevronDown className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {selected.subject || "(No subject)"}
            </h2>
          </div>

          {/* Meta */}
          <div className="mt-3 text-sm text-neutral space-y-1">
            <div>
              <span className="font-semibold">Sent:</span>{" "}
              {formatAU(selected.sentAt || selected.createdAt)}
            </div>
            <div>
              <span className="font-semibold">To:</span> {selected.to || "—"}
            </div>
            <div>
              <span className="font-semibold">From:</span>{" "}
              {selected.from || "testroutedrivingschool@gmail.com"}
            </div>
          </div>

          {/* Body */}
          <div className="my-4 border border-border-color rounded-md p-4 bg-white">
            {selected.html ? (
              <div
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{__html: selected.html}}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {selected.text || selected.preview || "—"}
              </pre>
            )}
          </div>

          {/* Attachments */}
          {selected?.attachmentKey && (
            <button
              type="button"
              className="text-sm px-3 py-2 border border-border-color rounded bg-gray-50 hover:bg-gray-100"
              onClick={() => downloadAttachment(selected.attachmentKey)}
            >
              {selected.attachmentName || "invoice.pdf"}
            </button>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            {!selected.checklistId && (
              <PrimaryBtn
                onClick={() => router.push("/dashboard/user/my-bookings")}
                className="px-6!"
              >
                View Booking
              </PrimaryBtn>
            )}

            <PrimaryBtn
              onClick={() => setSelected(null)}
              className="px-6! bg-red-600!"
            >
              Close
            </PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}
