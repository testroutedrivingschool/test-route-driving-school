"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import ReportShell from "../../components/ReportShell";
import ReportFieldRow from "../../components/ReportFieldRow";

function formatDate(value, withTime = false) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  if (withTime) {
    return date.toLocaleString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function FinanceOutstandingPaymentsPage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const [filters, setFilters] = useState({
    saleType: "all",
    organisation: "all",
    staff: "",
    service: "all",
    dateFrom: "2026-01-01",
    dateTo: new Date().toISOString().split("T")[0],
    includeNegativeBalances: false,
  });

  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const staffName = user?.name || user?.fullName || "";
  const staffEmail = user?.instructorEmail || user?.email || "";

  useEffect(() => {
    if (staffName && !filters.staff) {
      setFilters((prev) => ({
        ...prev,
        staff: staffName,
      }));
    }
  }, [staffName, filters.staff]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRunReport = async () => {
    try {
      setIsRunning(true);
      setHasSearched(true);

      const res = await axios.get("/api/reports/outstanding-payments", {
        params: {
          saleType: filters.saleType,
          organisation: filters.organisation,
          staff: filters.staff,
          instructorEmail: staffEmail,
          service: filters.service,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          includeNegativeBalances: filters.includeNegativeBalances,
        },
      });

      setReportRows(res.data?.rows || []);
      setSummary(res.data?.summary || null);
    } catch (error) {
      console.error("Outstanding payments report error:", error);
      setReportRows([]);
      setSummary(null);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadAttachment = async (key) => {
    if (!key) return;

    try {
      const { data } = await axios.post("/api/storage/download-url", { key });
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  if (userLoading) return <LoadingSpinner />;

  return (
    <section className="py-4">
      <Container>
        <ReportShell
          title="Outstanding Payments"
          onRun={handleRunReport}
          isRunning={isRunning}
          hideMobileTopButton
        >
          <div className="space-y-2">
            <ReportFieldRow label="Sale Type:">
              <select
                value={filters.saleType}
                onChange={(e) => handleChange("saleType", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Transactions</option>
                <option value="website">Website</option>
                <option value="manual">Manual</option>
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Organisation:">
              <select
                value={filters.organisation}
                onChange={(e) => handleChange("organisation", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Organisations</option>
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Staff:">
              <select
                value={filters.staff}
                onChange={(e) => handleChange("staff", e.target.value)}
                disabled
                className="min-w-60 w-full md:w-auto bg-gray-100 border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value={staffName}>{staffName || "Select Staff"}</option>
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Service:">
              <select
                value={filters.service}
                onChange={(e) => handleChange("service", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Services</option>
                <option value="Automatic Driving Lesson">Automatic Driving Lesson</option>
                <option value="City Driving Package">City Driving Package</option>
                <option value="Night Driving Lesson">Night Driving Lesson</option>
                <option value="Parking Package">Parking Package</option>
                <option value="Driving Test Package">Driving Test Package</option>
                <option value="Driving Test Assessment">Driving Test Assessment</option>
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Date From:">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleChange("dateFrom", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              />
            </ReportFieldRow>

            <ReportFieldRow label="Date To:">
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleChange("dateTo", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              />
            </ReportFieldRow>

            <ReportFieldRow label="Account Balances:">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.includeNegativeBalances}
                  onChange={(e) =>
                    handleChange("includeNegativeBalances", e.target.checked)
                  }
                />
                <span>Include negative account balances</span>
              </label>
            </ReportFieldRow>
          </div>

          <div className="mt-4 lg:hidden">
            <button
              type="button"
              onClick={handleRunReport}
              disabled={isRunning}
              className="w-full bg-primary text-white font-semibold px-4 py-3 rounded-md hover:opacity-90 disabled:opacity-60"
            >
              {isRunning ? "Running..." : "Run Report"}
            </button>
          </div>

          {reportRows.length > 0 ? (
            <div className="mt-8">
              <div className="overflow-x-auto rounded-lg border border-border-color">
                <table className="min-w-full text-sm">
                  <thead className="text-white whitespace-nowrap">
                    <tr>
                      {[
                        "Client",
                        "Organisation",
                        "Type",
                        "Invoice #",
                        "Contact Details",
                        "Date",
                        "Age",
                        "Item",
                        "Staff",
                        "Account Balance",
                        "Outstanding",
                      ].map((col) => (
                        <th
                          key={col}
                          style={{ backgroundColor: "#4C68A2" }}
                          className="px-4 py-3 text-left font-semibold border-b"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((row) => (
                      <tr
                        key={row._id}
                        className="border-b border-border-color last:border-b-0 whitespace-nowrap"
                      >
                        <td className="px-4 py-2">{row.client}</td>
                        <td className="px-4 py-2">{row.organisation}</td>
                        <td className="px-4 py-2 capitalize">{row.type}</td>
                        <td className="px-4 py-2">
                          {row.invoice !== "-" ? (
                            <button
                              onClick={() => downloadAttachment(row.invoiceKey)}
                              className="text-primary underline"
                            >
                              #{row.invoice}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-2">{row.contactDetails}</td>
                        <td className="px-4 py-2">{formatDate(row.date, true)}</td>
                        <td className="px-4 py-2">{row.age}</td>
                        <td className="px-4 py-2">{row.item}</td>
                        <td className="px-4 py-2">{row.staff}</td>
                        <td className="px-4 py-2 text-right">
                          {formatMoney(row.accountBalance)}
                        </td>
                        <td className="px-4 py-2 text-right text-red-600 font-semibold">
                          {formatMoney(row.outstanding)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="bg-[#6f93cd] text-white whitespace-nowrap">
                    <tr>
                      <td colSpan={9} className="px-4 py-2 font-semibold"></td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatMoney(summary?.totalAccountBalance)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatMoney(summary?.totalOutstanding)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="mt-10">
              <h3 className="text-lg font-bold">No Report Found</h3>
            </div>
          ) : null}
        </ReportShell>
      </Container>
    </section>
  );
}