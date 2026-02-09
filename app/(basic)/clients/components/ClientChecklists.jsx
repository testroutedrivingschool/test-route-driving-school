"use client";

import {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "react-toastify";
import {FaRegEdit, FaPrint, FaEnvelope, FaRegStar} from "react-icons/fa";
import {FaArrowRotateRight} from "react-icons/fa6";
import Modal from "@/app/shared/ui/Modal";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import EmailEditor from "@/app/shared/EmailEditor";

const initialChecklists = [
  {
    id: "performance",
    title: "Performance Evaluation",
    rows: [
      {
        name: "Prepare to drive",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Vehicle Control",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Moving off and Stopping",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Steering",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Observation Check",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Reverse Parking",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Speed Management",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Road Positioning",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Decision Making",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Hazard and Response",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Lane changing",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "3 Point Turn",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Scanning",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Simple Traffic",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Complex Traffic",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Driving at Night",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
      {
        name: "Driving in adverse condition",
        lastCompleted: "Mark Completed",
        tally: 0,
        comment: "",
        rating: null,
      },
    ],
  },
];
function mergeDbIntoInitial(initial, dbDocs) {
  if (!Array.isArray(dbDocs) || dbDocs.length === 0) return initial;

  // map: checklistId -> (itemName -> itemData)
  const map = new Map();

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
      title: cl.title, // keep your UI title
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
function formatAUDateTime(date = new Date()) {
  const datePart = date.toLocaleDateString("en-AU");
  const timePart = date
    .toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
  return `${datePart} ${timePart}`;
}

function ratingTextColor(r) {
  if (!r) return "text-primary";
  if (r <= 3) return "text-red-600";
  if (r <= 6) return "text-orange-500";
  if (r <= 9) return "text-sky-600";
  return "text-green-700";
}

function ratingBtnColor(r) {
  if (r <= 3) return "bg-red-600";
  if (r <= 6) return "bg-orange-500";
  if (r <= 9) return "bg-sky-500";
  return "bg-green-700";
}

export default function ClientChecklists({clientId}) {
  const queryClient = useQueryClient();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(initialChecklists[0]?.id || "");
  const [checklists, setChecklists] = useState(initialChecklists);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const {data: client = []} = useQuery({
    queryKey: ["client"],
    enabled: !!clientId, // only fetch after Search click
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}`);
      return res.data;
    },
  });
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [messageHtml, setMessageHtml] = useState("");
  const [ccOpen, setCcOpen] = useState(false);
  const [bccOpen, setBccOpen] = useState(false);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  // modal
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [draftComment, setDraftComment] = useState("");
  const [draftRating, setDraftRating] = useState(null);

  const {data: userData} = useUserData();
  // ✅ GET: load from DB
  const {data: dbChecklists = [], isLoading: isChecklistsLoading} = useQuery({
    queryKey: ["clientChecklists", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}/checklists`);
      return res.data;
    },
  });

  // ✅ when DB data arrives, merge into initial template
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
      setPdfLoading(true);

      const res = await axios.get(`/api/clients/${clientId}/checklists-pdf`, {
        params: {
          checklistId: selected.id,
          checklistTitle: selected.title,

          instructorName: userData?.name || "",
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

  // ✅ Persist row mutation (your code ok)
  const persistRowMutation = useMutation({
    mutationFn: async ({checklistId, checklistTitle, row}) => {
      const res = await axios.put(`/api/clients/${clientId}/checklists/item`, {
        checklistId,
        checklistTitle,
        name: row.name,
        comment: row.comment,
        rating: row.rating,
        lastCompleted: row.lastCompleted,
        tally: row.tally,
      });
      return res.data;
    },

    onSuccess: () => {
      toast.success("Checklist item saved");
      queryClient.invalidateQueries({
        queryKey: ["clientChecklists", clientId],
      });
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || "Failed to save checklist item",
      );
    },
  });

  const activeRow = selected?.rows?.[activeIndex];

  const openEditorAt = (rowIndex) => {
    const row = selected.rows[rowIndex];
    setActiveIndex(rowIndex);
    setDraftComment(row?.comment || "");
    setDraftRating(row?.rating ?? null);
    setOpen(true);
  };

  // ✅ helper: update UI row and return the updatedRow
  const buildUpdatedRowForIndex = (index, overrides = {}) => {
    const current = selected.rows[index];

    const updated = {
      ...current,
      ...overrides,
      lastCompleted: formatAUDateTime(new Date()),
      tally: (Number(current.tally) || 0) + 1,
    };

    return updated;
  };

  // ✅ save active row to state + db
  const saveRowAtIndex = (index) => {
    const updatedRow = buildUpdatedRowForIndex(index, {
      comment: draftComment,
      rating: draftRating,
    });

    // update UI
    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id !== selectedId) return cl;
        return {
          ...cl,
          rows: cl.rows.map((r, idx) => (idx === index ? updatedRow : r)),
        };
      }),
    );

    // persist to db
    persistRowMutation.mutate({
      checklistId: selected.id,
      checklistTitle: selected.title,
      row: updatedRow,
    });
  };

  // ✅ move with autosave
  const goNext = () => {
    if (!selected) return;

    // ✅ always save current row first
    saveRowAtIndex(activeIndex);

    // ✅ if last row → close modal
    const isLast = activeIndex >= selected.rows.length - 1;
    if (isLast) {
      setOpen(false);
      return;
    }

    // ✅ otherwise go next
    const nextIndex = activeIndex + 1;
    const next = selected.rows[nextIndex];

    setActiveIndex(nextIndex);
    setDraftComment(next?.comment || "");
    setDraftRating(next?.rating ?? null);
  };

  const goPrev = () => {
    if (!selected) return;
    if (activeIndex <= 0) return;

    saveRowAtIndex(activeIndex);

    const prevIndex = activeIndex - 1;
    const prev = selected.rows[prevIndex];

    setActiveIndex(prevIndex);
    setDraftComment(prev?.comment || "");
    setDraftRating(prev?.rating ?? null);
  };

  // ✅ quick mark complete + persist
  const onMarkCompletedQuick = (rowIndex) => {
    const updatedRow = buildUpdatedRowForIndex(rowIndex, {});

    setChecklists((prev) =>
      prev.map((cl) => {
        if (cl.id !== selectedId) return cl;
        return {
          ...cl,
          rows: cl.rows.map((r, idx) => (idx === rowIndex ? updatedRow : r)),
        };
      }),
    );

    persistRowMutation.mutate({
      checklistId: selected.id,
      checklistTitle: selected.title,
      row: updatedRow,
    });
  };
  const sendChecklistEmail = async () => {
    try {
      setEmailSending(true);

      await axios.post(`/api/clients/${clientId}/checklists-email`, {
        to,
        cc,
        bcc,
        subject,
        html: messageHtml,
        checklistId: selected.id,
        checklistTitle: selected.title,
        instructorName: userData?.name || "",
      });

      toast.success("Email sent");

      setEmailOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  if (isChecklistsLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white border border-border-color rounded-md p-4">
      {/* Top */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 w-full">
          <label className="text-sm font-semibold text-gray-900 min-w-[70px]">
            Checklist:
          </label>

          <select
            className="h-10 w-full md:max-w-xl rounded-md border border-border-color px-3 text-sm outline-none bg-white"
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setActiveIndex(0);
            }}
          >
            {checklists.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            className="h-10 w-10 rounded-md border border-border-color bg-white flex items-center justify-center hover:bg-gray-50"
            title="Print"
            onClick={downloadChecklistPdf}
            disabled={pdfLoading}
          >
            <FaPrint className="text-primary text-2xl" />
          </button>

          <button
            type="button"
            className="h-10 w-10 rounded-md border border-border-color bg-white flex items-center justify-center hover:bg-gray-50"
            title="Email"
            onClick={() => {
              setTo(client?.email || "");
              setCc("");
              setBcc("");
              setCcOpen(false);
              setBccOpen(false);

              setSubject(`${selected.title} Progress Report`);

              setMessageHtml(`
    <p>Hi ${client?.firstName || "there"},</p>
    <p>Here are your latest results.</p>
    <p>Kind Regards,</p>
    <p><b>${userData?.name || ""}</b><br/>
    <i>Driving Instructor</i></p>

 
     
  `);

              setEmailOpen(true);
            }}
          >
            <FaEnvelope className="text-primary text-2xl" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 border border-border-color rounded-md overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-900 border-b border-border-color">
            <div className="col-span-3">Item Name</div>
            <div className="col-span-4">Comments</div>
            <div className="col-span-1 text-center">Rating</div>
            <div className="col-span-3 text-center">Last Completed</div>
            <div className="col-span-1 text-center">Tally</div>
          </div>

          {selected?.rows?.length ? (
            selected.rows.map((r, idx) => (
              <div
                key={`${r.name}-${idx}`}
                className={`grid grid-cols-12 px-4 py-3 text-sm items-center ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="col-span-3 text-gray-900">{r.name}</div>

                <div className="col-span-4 flex items-start justify-start gap-3">
                  {r.comment ? (
                    <span
                      onClick={() => openEditorAt(idx)}
                      className="text-primary whitespace-pre-line font-semibold cursor-pointer"
                    >
                      {r.comment}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-white shrink-0"
                      title="Edit comment"
                      onClick={() => openEditorAt(idx)}
                    >
                      <FaRegEdit size={20} className="text-primary" />
                    </button>
                  )}
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => openEditorAt(idx)}
                    className="h-8 w-8 flex items-center justify-center"
                    title="Rate"
                  >
                    {r.rating ? (
                      <span
                        className={`font-semibold ${ratingTextColor(r.rating)}`}
                      >
                        {r.rating}
                      </span>
                    ) : (
                      <FaRegStar size={20} className="text-primary" />
                    )}
                  </button>
                </div>

                <div className="col-span-3 text-center">
                  {r.lastCompleted === "Mark Completed" ? (
                    <button
                      type="button"
                      className="text-primary font-semibold hover:underline"
                      onClick={() => onMarkCompletedQuick(idx)}
                      disabled={persistRowMutation.isPending}
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <span
                      onClick={() => onMarkCompletedQuick(idx)}
                      className="text-primary font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                      title="Mark again"
                    >
                      {r.lastCompleted}
                      <FaArrowRotateRight />
                    </span>
                  )}
                </div>

                <div className="col-span-1 text-center font-semibold text-gray-900">
                  {(Number(r.tally) || 0) === 0 ? "" : Number(r.tally)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-gray-500">
              No checklist items found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && activeRow && (
        <Modal onClose={() => setOpen(false)}>
          <div className="flex items-start justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">
              {activeRow.name}
            </h3>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Comment:
              </label>
              <textarea
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                className="w-full min-h-[360px] rounded-md border border-border-color p-3 outline-none"
                placeholder="Write comment..."
              />
            </div>

            <div className="col-span-12 lg:col-span-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rating:
              </label>

              <div className="grid grid-cols-3 gap-4">
                {Array.from({length: 9}).map((_, i) => {
                  const value = i + 1;
                  const isSel = draftRating === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setDraftRating((prev) =>
                          prev === value ? null : value,
                        )
                      }
                      className={`${ratingBtnColor(value)} h-20 rounded-md text-white text-2xl font-bold ${
                        isSel ? "ring-4 ring-black/40" : ""
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setDraftRating((prev) => (prev === 10 ? null : 10))
                  }
                  className={`${ratingBtnColor(10)} col-span-3 h-20 rounded-md text-white text-2xl font-bold ${
                    draftRating === 10 ? "ring-4 ring-black/20" : ""
                  }`}
                >
                  10
                </button>
              </div>

              <div className="mt-5 text-sm text-gray-900">
                <span className="font-semibold">Last Completed:</span>{" "}
                <span>
                  {activeRow.lastCompleted === "Mark Completed"
                    ? "—"
                    : activeRow.lastCompleted}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              className="text-primary font-semibold hover:underline"
              onClick={() => setOpen(false)}
            >
              Close
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0 || persistRowMutation.isPending}
                className="h-11 px-10 rounded-md border border-border-color bg-white font-semibold disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={persistRowMutation.isPending}
                className="h-11 px-10 rounded-md bg-primary text-white font-semibold disabled:opacity-50"
              >
                {persistRowMutation.isPending
                  ? "Saving..."
                  : activeIndex === selected.rows.length - 1
                    ? "Save & Close"
                    : "Next"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {pdfLoading && (
        <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[340px] h-[260px] flex flex-col items-center justify-center gap-4">
            <div className="flex space-x-2">
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
            </div>
            <p className="text-gray-800 font-semibold text-lg">Generating...</p>
          </div>
        </div>
      )}

      {emailOpen && (
        <Modal onClose={() => setEmailOpen(false)}>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">Send Email</h3>
          </div>

          <div className="mt-6 space-y-4">
            {/* To */}
            <div className="flex items-center gap-3">
              <label className="w-20 text-sm font-semibold text-gray-900">
                To:
              </label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10 w-full rounded-md border border-border-color px-3 text-sm outline-none"
                placeholder="client@email.com"
              />

              <button
                type="button"
                onClick={() => setCcOpen((p) => !p)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                CC
              </button>
              <button
                type="button"
                onClick={() => setBccOpen((p) => !p)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                BCC
              </button>
            </div>

            {/* CC */}
            {ccOpen && (
              <div className="flex items-center gap-3">
                <label className="w-20 text-sm font-semibold text-gray-900">
                  CC:
                </label>
                <input
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="h-10 w-full rounded-md border border-border-color px-3 text-sm outline-none"
                  placeholder="cc@email.com"
                />
              </div>
            )}

            {/* BCC */}
            {bccOpen && (
              <div className="flex items-center gap-3">
                <label className="w-20 text-sm font-semibold text-gray-900">
                  BCC:
                </label>
                <input
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="h-10 w-full rounded-md border border-border-color px-3 text-sm outline-none"
                  placeholder="bcc@email.com"
                />
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center gap-3">
              <label className="w-20 text-sm font-semibold text-gray-900">
                Subject:
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-10 w-full rounded-md border border-border-color px-3 text-sm outline-none"
              />
            </div>

            {/* Editor */}
            <div className="border border-border-color rounded-md overflow-hidden">
              <EmailEditor value={messageHtml} onChange={setMessageHtml} />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                className="text-red-600 font-semibold hover:underline"
                onClick={() => setEmailOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={sendChecklistEmail}
                disabled={emailSending}
                className="h-11 px-10 rounded-md bg-primary text-white font-semibold disabled:opacity-50"
              >
                {emailSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
