"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import ReportShell from "../../components/ReportShell";
import ReportFieldRow from "../../components/ReportFieldRow";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

export default function FinancesIncomePage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const [filters, setFilters] = useState({
    saleType: "all",
    organisation: "all",
    staff: "",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    dateType: "paid",
  });

  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const staffName = user?.name || user?.fullName || "";
  const staffEmail = user?.email || "";
const primaryDateLabel =
  filters.dateType === "booking" ? "Booking Date" : "Paid Date";
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
      const res = await axios.get("/api/reports/income", {
        params: {
          saleType: filters.saleType,
          organisation: filters.organisation,
          staff: filters.staff,
          instructorEmail: staffEmail,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          dateType: filters.dateType,
        },
      });

      setReportRows(res.data?.rows || []);
      setSummary(res.data?.summary || null);
    } catch (error) {
      console.error("Income report error:", error);
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
          title="Income"
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

            <ReportFieldRow label="Date Type:">
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="dateType"
                    value="paid"
                    checked={filters.dateType === "paid"}
                    onChange={(e) => handleChange("dateType", e.target.value)}
                  />
                  <span>Paid Date</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="dateType"
                    value="booking"
                    checked={filters.dateType === "booking"}
                    onChange={(e) => handleChange("dateType", e.target.value)}
                  />
                  <span>Booking Date</span>
                </label>
              </div>
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
      <table className="text-sm ">
        <thead className="text-white whitespace-nowrap  ">
  {/* Group Row (no Details) */}
  <tr>
    {/* Empty space for first 10 columns */}
     <th
      colSpan={10}
      style={{ backgroundColor: "white" }}
      className="text-black text-left px-4   border-b"
    >
      Income Report
    </th>

    {/* Income */}
    <th
      colSpan={8}
      style={{ backgroundColor: "#2FBC2F" }}
      className="px-4 py-2 text-center font-bold border-b"
    >
      Income
    </th>

    {/* Other */}
    <th
      colSpan={2}
      style={{ backgroundColor: "#6b7280" }}
      className="px-4 py-2 text-center font-bold border-b"
    >
      Other
    </th>
  </tr>

  {/* Column Row */}
  <tr>
    {/* 🔵 Blue columns (no top header, only colored cells) */}
   {[
  primaryDateLabel, "Type", "Status", "Invoice", "Staff",
  "Client", "Organisation", "Category", "Item"
].map((col) => (
      <th
        key={col}
        style={{ backgroundColor: "#4C68A2" }}
        className="px-4 py-2 text-left font-semibold border-b"
      >
        {col}
      </th>
    ))}

    {/* 🟢 Income */}
    {[
      "Cash","Credit","Online","Voucher","Services",
      "Online Surcharge","GST","Total Income"
    ].map((col) => (
      <th
        key={col}
        style={{ backgroundColor: "#2FBC2F" }}
        className="px-4 py-2 text-right font-semibold border-b"
      >
        {col}
      </th>
    ))}

    {/* ⚫ Other */}
    {["Tracking", "Payout"].map((col) => (
      <th
        key={col}
        style={{ backgroundColor: "#6b7280" }}
        className="px-4 py-2 text-right font-semibold border-b"
      >
        {col}
      </th>
    ))}
  </tr>
</thead>

        <tbody>
          {reportRows.map((row) => (
            <tr key={row._id} className="border-b border-border-color last:border-b-0 whitespace-nowrap">
              <td className="px-4 py-2">{formatDate(row.paidDate)}</td>
              <td className="px-4 py-2">{formatDate(row.bookingDate)}</td>
              <td className="px-4 py-2 capitalize">{row.type}</td>
              <td className="px-4 py-2 capitalize">{row.status}</td>
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
              <td className="px-4 py-2">{row.staff}</td>
              <td className="px-4 py-2">{row.client}</td>
              <td className="px-4 py-2">{row.organisation}</td>
              <td className="px-4 py-2">{row.category}</td>
              <td className="px-4 py-2">{row.item}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.cash)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.credit)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.online)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.voucher)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.services)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.onlineSurcharge)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.gst)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.totalIncome)}</td>
              <td className="px-4 py-2">{row.tracking}</td>
              <td className="px-4 py-2 text-right">{formatMoney(row.payout)}</td>
            </tr>
          ))}
        </tbody>

        <tfoot className="bg-[#4C68A2] text-white whitespace-nowrap">
          <tr>
            <td  className="px-4 py-2 font-semibold text-right">
              Totals
            </td>
            <td colSpan={10} className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalCash)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalCredit)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalOnline)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalVoucher)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalServices)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalOnlineSurcharge)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalGst)}
            </td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalIncome)}
            </td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 text-right font-semibold">
              {formatMoney(summary?.totalPayout)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
):hasSearched ? (
  <div className="mt-10">
    <h3 className="text-lg font-bold">No Report Found</h3>
  </div>
) : null}
        </ReportShell>
      </Container>
    </section>
  );
}