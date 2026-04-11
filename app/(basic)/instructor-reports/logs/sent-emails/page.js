"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import ReportShell from "../../components/ReportShell";

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getFromEmail(item) {
  if (item?.from) return item.from;

  if (item?.actorType === "INSTRUCTOR") {
    return "info@testroutedrivingschool.com.au";
  }

  if (item?.actorType === "ADMIN") {
    return "info@testroutedrivingschool.com.au";
  }

  return "testroutedrivingschool@gmail.com";
}

function getDelivered(item) {
  return String(item?.status || "").toUpperCase() === "SENT";
}

function getOpened(item) {
  return Boolean(item?.openedAt || item?.isOpened || item?.opened);
}

function getBounced(item) {
  return String(item?.status || "").toUpperCase() === "BOUNCED";
}

function getJunked(item) {
  return Boolean(item?.junkedAt || item?.isJunked || item?.junked);
}

function StatusTick({ show }) {
  if (!show) return null;

  return (
    <span className="inline-flex items-center justify-center text-xl md:text-3xl font-bold text-black leading-none">
      ✓
    </span>
  );
}

export default function SentEmailsPage() {
  const [recipient, setRecipient] = useState("");
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleSearch = async (page = 1) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const res = await axios.get("/api/emails", {
        params: {
          to: recipient.trim() || undefined,
          page,
          limit: 50,
        },
      });

      setRows(res.data?.items || []);
      setPagination({
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || 50,
        totalPages: res.data?.totalPages || 1,
      });
    } catch (error) {
      console.error("Sent emails load error:", error);
      setRows([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(1);
  }, []);

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (recipient.trim()) params.set("to", recipient.trim());
    params.set("limit", "200");
    params.set("page", "1");
    return `/api/emails?${params.toString()}`;
  }, [recipient]);

  return (
    <section className="py-4">
      <Container>
        <ReportShell
          title="Email Log"
          onRun={() => handleSearch(1)}
          isRunning={loading}
          runButtonText="Search"
          hideMobileTopButton
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="w-full max-w-2xl">
              <label className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span className="min-w-52 text-black font-medium text-base md:text-lg">
                  Search Recipient:
                </span>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="recipient@gmail.com"
                  className="w-full md:max-w-md border border-border-color rounded-md px-4 py-2.5 outline-none bg-white text-sm md:text-base"
                />
              </label>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4">
              <div
                
                className="text-primary font-semibold text-base md:text-xl hover:opacity-80 inline-flex items-center gap-2"
              >
                <span className="text-xl md:text-2xl">↧</span>
                <span>Export</span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 text-xs text-gray-500">
                  ?
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <button
              type="button"
              onClick={() => handleSearch(1)}
              disabled={loading}
              className="w-full bg-primary text-white font-semibold px-4 py-3 rounded-md hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {loading ? (
            <div className="mt-10">
              <LoadingSpinner />
            </div>
          ) : rows.length > 0 ? (
            <div className="mt-6 md:mt-8">
              <div className="overflow-x-auto rounded-md border border-border-color">
                <table className="min-w-[980px] w-full text-xs md:text-sm">
                  <thead className="text-white whitespace-nowrap">
                    <tr>
                      <th
                        className="px-3 md:px-4 py-3 text-left font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        Sent
                      </th>
                      <th
                        className="px-3 md:px-4 py-3 text-left font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        From/To
                      </th>
                      <th
                        className="px-3 md:px-4 py-3 text-left font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        Subject
                      </th>
                      <th
                        className="px-3 md:px-4 py-3 text-center font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        Delivered
                      </th>
                      <th
                        className="px-3 md:px-4 py-3 text-center font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        Opened
                      </th>
                      <th
                        className="px-3 md:px-4 py-3 text-center font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        Bounced
                      </th>
                      <th
                        className="px-3 md:px-4 py-3 text-center font-semibold"
                        style={{ backgroundColor: "#4f4a4a" }}
                      >
                        Junked
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="border-b border-border-color last:border-b-0 align-top"
                      >
                        <td className="px-3 md:px-4 py-3  text-black">
                          <div className="leading-5">
                            {formatDateTime(item.sentAt || item.createdAt)}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-3 md:px-4 py-3 min-w-[220px] md:min-w-[280px]">
                          <div className="space-y-1">
                            <p className="text-black break-words">
                              To:{" "}
                              <span className="text-primary break-all">
                                {item.to || "-"}
                              </span>
                            </p>
                            <p className="text-black break-all">
                              From: {getFromEmail(item)}
                            </p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-3 md:px-4 py-3 min-w-[240px] md:min-w-[460px]">
                          <div className="space-y-1">
                            <p className="text-black text-sm md:text-[15px] break-words">
                              {item.subject || "-"}{" "}
                              {item.hasAttachment ? (
                                <span className="inline-block text-black">📎</span>
                              ) : null}
                            </p>

                            <button
                              type="button"
                              onClick={() => setSelectedEmail(item)}
                              className="text-primary hover:underline text-sm md:text-[15px]"
                            >
                              View Email
                            </button>
                          </div>
                        </td>

                        <td className="px-3 md:px-4 py-3 text-center align-middle min-w-[80px]">
                          <StatusTick show={getDelivered(item)} />
                        </td>
                        <td className="px-3 md:px-4 py-3 text-center align-middle min-w-[80px]">
                          <StatusTick show={getOpened(item)} />
                        </td>
                        <td className="px-3 md:px-4 py-3 text-center align-middle min-w-[80px]">
                          <StatusTick show={getBounced(item)} />
                        </td>
                        <td className="px-3 md:px-4 py-3 text-center align-middle min-w-[80px]">
                          <StatusTick show={getJunked(item)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 ? (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-gray-600">
                    Showing page {pagination.page} of {pagination.totalPages} (
                    {pagination.total} total)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1 || loading}
                      onClick={() => handleSearch(pagination.page - 1)}
                      className="px-4 py-2 border rounded disabled:opacity-50 text-sm"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={
                        pagination.page >= pagination.totalPages || loading
                      }
                      onClick={() => handleSearch(pagination.page + 1)}
                      className="px-4 py-2 border rounded disabled:opacity-50 text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : hasSearched ? (
            <div className="mt-10">
              <h3 className="text-lg font-bold">No Emails Found</h3>
            </div>
          ) : null}
        </ReportShell>
      </Container>

      {selectedEmail ? (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-t-xl md:rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-start justify-between gap-3 px-4 md:px-5 py-4 border-b border-border-color">
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-black break-words">
                  {selectedEmail.subject || "Email Preview"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 break-all">
                  To: {selectedEmail.to || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="text-2xl leading-none text-gray-600 hover:text-black shrink-0"
              >
                ×
              </button>
            </div>

            <div className="p-4 md:p-5 overflow-y-auto max-h-[75vh]">
              {selectedEmail.html ? (
                <div
                  className="prose prose-sm md:prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-black font-sans">
                  {selectedEmail.text || selectedEmail.preview || "No content"}
                </pre>
              )}

              {selectedEmail.hasAttachment ? (
                <div className="mt-5 pt-4 border-t border-border-color text-sm text-gray-700 break-words">
                  Attachment: {selectedEmail.attachmentName || "Attached file"}
                </div>
              ) : null}

              {selectedEmail.error ? (
                <div className="mt-3 text-sm text-red-600 break-words">
                  Error: {selectedEmail.error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}