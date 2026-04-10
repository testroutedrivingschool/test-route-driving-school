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
  return Number(value || 0).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function FinancesIncomeByCategoryPage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const [filters, setFilters] = useState({
    staff: "",
    services: "all",
    products: "all",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });

  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
const [hasSearched, setHasSearched] = useState(false);
  const staffName = user?.name || user?.fullName || "";
  const staffEmail = user?.email || "";
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

    const res = await axios.get("/api/reports/income-by-category", {
      params: {
        staff: filters.staff,
        instructorEmail: staffEmail,
        services: filters.services,
        products: filters.products,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      },
    });

    setReportRows(res.data?.rows || []);
    setSummary(res.data?.summary || null);
  } catch (error) {
    console.error("Income by category report error:", error);
    setReportRows([]);
    setSummary(null);
  } finally {
    setIsRunning(false);
  }
};

  if (userLoading) return <LoadingSpinner />;

  return (
    <section className="py-4">
      <Container>
        <ReportShell
          title="Income by Category"
          onRun={handleRunReport}
          isRunning={isRunning}
          hideMobileTopButton
        >
          <div className="space-y-2">
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

            <ReportFieldRow label="Services:">
              <select
                value={filters.services}
                onChange={(e) => handleChange("services", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
               <option value="all">All Service Groups</option>
<option value="Automatic Driving Lesson">Automatic Driving Lesson</option>
<option value="City Driving Package">City Driving Package</option>
<option value="Night Driving Lesson">Night Driving Lesson</option>
<option value="Parking Package">Parking Package</option>
<option value="Driving Test Package">Driving Test Package</option>
<option value="Driving Test Assessment">Driving Test Assessment</option>
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Products:">
              <select
                value={filters.products}
                onChange={(e) => handleChange("products", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Product Categories</option>
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 px-1">
                <h3 className="text-2xl font-bold text-black">Income By Category</h3>
                <p className="text-sm md:text-base text-black">
                  From {formatDate(filters.dateFrom)} to {formatDate(filters.dateTo)}
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border-color">
  <table className="min-w-full text-sm">
    <thead className="text-white whitespace-nowrap">
      <tr>
        <th
          style={{ backgroundColor: "#4C68A2" }}
          className="px-4 py-3 text-left font-semibold border-b"
        >
          Category
        </th>
        <th
          style={{ backgroundColor: "#4C68A2" }}
          className="px-4 py-3 text-right font-semibold border-b"
        >
          Quantity
        </th>
        <th
          style={{ backgroundColor: "#4C68A2" }}
          className="px-4 py-3 text-right font-semibold border-b"
        >
          Total Paid
        </th>
        <th
          style={{ backgroundColor: "#6b7280" }}
          className="px-4 py-3 text-right font-semibold border-b"
        >
          Cash
        </th>
        <th
          style={{ backgroundColor: "#6b7280" }}
          className="px-4 py-3 text-right font-semibold border-b"
        >
          Card Amount
        </th>
        <th
          style={{ backgroundColor: "#4C68A2" }}
          className="px-4 py-3 text-right font-semibold border-b"
        >
          GST
        </th>
        <th
          style={{ backgroundColor: "#2FBC2F" }}
          className="px-4 py-3 text-right font-semibold border-b"
        >
          Revenue
        </th>
      </tr>
    </thead>

    <tbody>
      {reportRows.map((row, index) => (
        <tr
          key={`${row.category}-${index}`}
          className="border-b border-border-color last:border-b-0 whitespace-nowrap"
        >
          <td className="px-4 py-2">{row.category}</td>
          <td className="px-4 py-2 text-right">{row.quantity}</td>
          <td className="px-4 py-2 text-right">{formatMoney(row.totalPaid)}</td>
          <td className="px-4 py-2 text-right">{formatMoney(row.cash)}</td>
          <td className="px-4 py-2 text-right">{formatMoney(row.cardAmount)}</td>
          <td className="px-4 py-2 text-right">{formatMoney(row.gst)}</td>
          <td className="px-4 py-2 text-right">{formatMoney(row.revenue)}</td>
        </tr>
      ))}
    </tbody>

    <tfoot className="bg-[#4C68A2] text-white whitespace-nowrap">
      <tr>
        <td className="px-4 py-2 font-semibold">Totals</td>
        <td className="px-4 py-2 text-right font-semibold">
          {summary?.totalQuantity ?? 0}
        </td>
        <td className="px-4 py-2 text-right font-semibold">
          {formatMoney(summary?.totalPaid)}
        </td>
        <td className="px-4 py-2 text-right font-semibold">
          {formatMoney(summary?.totalCash)}
        </td>
        <td className="px-4 py-2 text-right font-semibold">
          {formatMoney(summary?.totalCardAmount)}
        </td>
        <td className="px-4 py-2 text-right font-semibold">
          {formatMoney(summary?.totalGst)}
        </td>
        <td className="px-4 py-2 text-right font-semibold">
          {formatMoney(summary?.totalRevenue)}
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