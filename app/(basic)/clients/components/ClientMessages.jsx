"use client";

import React, {useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {FiMail} from "react-icons/fi";
import {HiChevronDown} from "react-icons/hi";
import {useRouter} from "next/navigation";
import Modal from "@/app/shared/ui/Modal";

export default function ClientMessages({clientId}) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const {data: client = []} = useQuery({
    queryKey: ["client"],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}`);
      return res.data;
    },
  });
  const {
    data: emails = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["user-emails", client?.email],
    enabled: !!client?.email,
    queryFn: async () => {
      const res = await axios.get("/api/emails", {
        params: {
          to: client.email,
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

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="p-6 bg-white border border-border-color rounded-md">
        <p className="text-sm text-red-600">Failed to load messages.</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="p-6 bg-white border-t border-border-color ">
        <h2 className="text-lg font-semibold text-gray-700">No Email Found</h2>
      </div>
    );
  }
  return (
    <div className="bg-white  overflow-hidden">
      <div className="md:hidden">
      <div className="bg-secondary text-white px-4 py-3 font-semibold">
        Messages
      </div>

      {isFetching && (
        <div className="px-4 py-2 text-xs text-gray-500 border-b">
          Updating...
        </div>
      )}

      <div className="divide-y divide-border-color">
        {rows.map((m) => (
          <button
            key={m._id}
            type="button"
            onClick={() => setSelected(m)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-start gap-3">
              <FiMail className="text-2xl text-gray-400 mt-1 shrink-0" />

              <div className="min-w-0 flex-1">
                {/* subject + chevron */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 leading-snug wrap-break-word">
                      {m.subject || "(No subject)"}
                      {m.hasAttachment ? (
                        <span className="ml-2 text-xs font-semibold text-neutral">
                          📎 {m.attachmentName || "Attachment"}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatAU(m.sentAt || m.createdAt)}
                    </div>
                  </div>

                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 shrink-0">
                    <HiChevronDown className="text-gray-700" />
                  </span>
                </div>

                {/* to/from */}
                <div className="mt-2 text-xs text-gray-700 space-y-1">
                  <div className="break-all">
                    <span className="font-semibold">To:</span>{" "}
                    {m.to || "—"}
                  </div>
                  <div className="break-all">
                    <span className="font-semibold">From:</span>{" "}
                    {m.from || "testroutedrivingschool@gmail.com"}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* ================= DESKTOP TABLE (no horizontal scroll needed) ================= */}
    <div className="hidden md:block">
      <table className="w-full text-sm text-left border-collapse table-fixed">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="px-4 py-3 w-[70px] font-semibold">Type</th>
            <th className="px-4 py-3 w-[260px] font-semibold">Sent</th>
            <th className="px-4 py-3 font-semibold">Message</th>
            <th className="px-4 py-3 w-[60px]" />
          </tr>
        </thead>

        <tbody>
          {isFetching && (
            <tr>
              <td colSpan={4} className="px-4 py-2 text-xs text-gray-500 border-b">
                Updating...
              </td>
            </tr>
          )}

          {rows.map((m, idx) => {
            const bg = idx % 2 === 0 ? "bg-white" : "bg-[#f3f3f3]";
            return (
              <tr key={m._id} className={`${bg} border-b border-border-color`}>
                {/* Type */}
                <td className="px-4 py-4 align-top">
                  <FiMail className="text-2xl text-gray-400" />
                </td>

                {/* Sent */}
                <td className="px-4 py-4 align-top text-gray-800">
                  <div className="font-medium">
                    {formatAU(m.sentAt || m.createdAt)}
                  </div>
                  <div className="text-xs mt-1 break-all">
                    <span className="font-semibold">To:</span> {m.to || "—"}
                  </div>
                  <div className="text-xs break-all">
                    <span className="font-semibold">From:</span>{" "}
                    {m.from || "testroutedrivingschool@gmail.com"}
                  </div>
                </td>

                {/* Message */}
                <td className="px-4 py-4 align-top">
                  <div className="font-semibold text-gray-900 wrap-break-word">
                    {m.subject || "(No subject)"}
                  </div>
                  {m.hasAttachment && (
                    <div className="text-xs text-neutral mt-1 wrap-break-word">
                      📎 {m.attachmentName || "Attachment"}
                    </div>
                  )}
                </td>

                {/* Action */}
                <td className="px-4 py-4 align-top text-right">
                  <button
                    type="button"
                    onClick={() => setSelected(m)}
                    className="h-8 w-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition"
                    aria-label="Open message"
                  >
                    <HiChevronDown className="text-gray-700" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

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
            {!selected.checklistId && selected.type==="BOOKINGS_CONFIRM" && (
              <PrimaryBtn
                onClick={() =>
                  router.push(
                    `/instructor-bookings/${selected.bookingId}/booking`,
                  )
                }
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
