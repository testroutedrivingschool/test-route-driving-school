"use client";

import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "react-toastify";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useUserData} from "@/app/hooks/useUserData";
import {FaPrint} from "react-icons/fa";

const initialChecklists = [
  {
    id: "performance",
    title: "Performance Evaluation",
    rows: [
      {name: "Prepare to drive", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Vehicle Control", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Moving off and Stopping", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Steering", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Observation Check", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Reverse Parking", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Speed Management", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Road Positioning", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Decision Making", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Hazard and Response", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Lane changing", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "3 Point Turn", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Scanning", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Simple Traffic", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Complex Traffic", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Driving at Night", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
      {name: "Driving in adverse condition", lastCompleted: "Mark Completed", tally: 0, comment: "", rating: null},
    ],
  },
];

function mergeDbIntoInitial(initial, dbDocs) {
  if (!Array.isArray(dbDocs) || dbDocs.length === 0) return initial;

  const map = new Map(); // checklistId -> itemName -> itemData
  for (const doc of dbDocs) {
    const checklistId = doc?.checklistId;
    const items = Array.isArray(doc?.items) ? doc.items : [];
    if (!checklistId) continue;

    const itemMap = new Map();
    for (const it of items) {
      if (!it?.name) continue;
      itemMap.set(it.name, it);
    }
    map.set(checklistId, itemMap);
  }

  return initial.map((cl) => {
    const itemMap = map.get(cl.id);
    if (!itemMap) return cl;

    return {
      ...cl,
      rows: cl.rows.map((r) => {
        const saved = itemMap.get(r.name);
        if (!saved) return r;
        return {
          ...r,
          comment: saved.comment ?? r.comment,
          rating: saved.rating ?? r.rating,
          lastCompleted: saved.lastCompleted || r.lastCompleted,
          tally: typeof saved.tally === "number" ? saved.tally : r.tally,
        };
      }),
    };
  });
}

function formatAU(d) {
  if (!d || d === "Mark Completed") return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function ratingTextColor(r) {
  const n = Number(r || 0);
  if (!n) return "text-gray-400";
  if (n <= 3) return "text-red-600";
  if (n <= 6) return "text-orange-500";
  if (n <= 9) return "text-sky-600";
  return "text-green-700";
}

export default function UserMyProgress() {
  const {data: userData, isLoading: userLoading} = useUserData();
  const [pdfLoading, setPdfLoading] = useState(false);

 
  const clientId = userData?.clientId;

  const [selectedId, setSelectedId] = useState(initialChecklists[0]?.id || "");
  const [checklists, setChecklists] = useState(initialChecklists);

  const {data: dbChecklists = [], isLoading: isChecklistsLoading} = useQuery({
    queryKey: ["myChecklists", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}/checklists`);
      return res.data;
    },
  });

  useEffect(() => {
    const merged = mergeDbIntoInitial(initialChecklists, dbChecklists);
    setChecklists(merged);
  }, [dbChecklists]);

  const selected = useMemo(
    () => checklists.find((c) => c.id === selectedId) || checklists[0],
    [checklists, selectedId],
  );

  const downloadChecklistPdf = async () => {
    try {
      if (!clientId) return toast.error("Client not found");
      setPdfLoading(true);

      const res = await axios.get(`/api/clients/${clientId}/checklists-pdf`, {
        params: {
          checklistId: selected.id,
          checklistTitle: selected.title,
          
          instructorName: "",
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], {type: "application/pdf"});
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.title}-progress-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to download PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  if (userLoading || isChecklistsLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white md:border border-border-color rounded-md">
      {/* Top bar like screenshot */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 border-b border-border-color">
        <div className="flex items-center gap-3 w-full">
          <label className="text-sm font-semibold text-gray-900 min-w-[62px]">
            Report:
          </label>

          <select
            className="h-10 w-full md:max-w-xl rounded-md border border-border-color px-3 text-sm outline-none bg-white"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {checklists.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="h-10 w-10 rounded-md border border-border-color bg-white flex items-center justify-center hover:bg-gray-50"
          title="Download PDF"
          onClick={downloadChecklistPdf}
          disabled={pdfLoading}
        >
          <FaPrint className="text-primary text-2xl" />
        </button>
      </div>

      {/* ✅ Desktop table (md+) - no horizontal scroll needed */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-900 border-b border-border-color">
          <div className="col-span-4">Item Name</div>
          <div className="col-span-4">Comments</div>
          <div className="col-span-1 text-center">Rating</div>
          <div className="col-span-2 text-center">Last Completed</div>
          <div className="col-span-1 text-center">Tally</div>
        </div>

        {selected?.rows?.length ? (
          selected.rows.map((r, idx) => (
            <div
              key={`${r.name}-${idx}`}
              className={`grid grid-cols-12 px-4 py-3 text-sm items-start ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="col-span-4 text-gray-900 font-medium">{r.name}</div>

              <div className="col-span-4 text-gray-700 whitespace-pre-line wrap-break-word">
                {r.comment?.trim() ? r.comment : ""}
              </div>

              <div className="col-span-1 text-center font-semibold">
                {r.rating ? (
                  <span className={ratingTextColor(r.rating)}>{r.rating}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>

              <div className="col-span-2 text-center text-gray-700">
                {formatAU(r.lastCompleted)}
              </div>

              <div className="col-span-1 text-center font-semibold text-gray-900">
                {(Number(r.tally) || 0) === 0 ? "—" : Number(r.tally)}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-sm text-gray-500">No checklist items found.</div>
        )}
      </div>

      {/* ✅ Mobile cards (below md) - fits screen, no horizontal scroll */}
      <div className="md:hidden">
        {selected?.rows?.length ? (
          selected.rows.map((r, idx) => (
            <div
              key={`${r.name}-${idx}`}
              className={`p-4 border-b border-border-color ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="font-semibold text-gray-900 text-base">{r.name}</div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <div className="font-semibold text-gray-700">Comments</div>
                  <div className="mt-1 text-gray-700 whitespace-pre-line wrap-break-word">
                    {r.comment?.trim() ? r.comment : ""}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700">Rating</div>
                  <div className={`mt-1 font-semibold ${ratingTextColor(r.rating)}`}>
                    {r.rating ? `${r.rating}/10` : ""}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700">Tally</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {(Number(r.tally) || 0) === 0 ? "—" : Number(r.tally)}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="font-semibold text-gray-700">Last Completed</div>
                  <div className="mt-1 text-gray-700">{formatAU(r.lastCompleted)}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 text-sm text-gray-500">No checklist items found.</div>
        )}
      </div>

      {/* PDF loading overlay */}
      {pdfLoading && (
        <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[340px] h-[260px] flex flex-col items-center justify-center gap-4">
            <div className="flex space-x-2">
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
            </div>
            <p className="text-gray-800 font-semibold text-lg">Generating...</p>
          </div>
        </div>
      )}
    </div>
  );
}