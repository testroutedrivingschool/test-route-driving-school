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

export default function StaffCancellationsPage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const [filters, setFilters] = useState({
    location: "all",
    staff: "",
    organisation: "all",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    dateType: "booking",
  });

  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    organisations: [],
  });
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

      const res = await axios.get("/api/reports/staff/cancellations", {
        params: {
          location: filters.location,
          staff: filters.staff,
          instructorEmail: staffEmail,
          organisation: filters.organisation,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          dateType: filters.dateType,
        },
      });

      setReportRows(res.data?.rows || []);
      setSummary(res.data?.summary || null);
      setFilterOptions({
        locations: res.data?.filterOptions?.locations || [],
        organisations: res.data?.filterOptions?.organisations || [],
      });
    } catch (error) {
      console.error("Cancellations report error:", error);
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
          title="Cancellation Trends"
          onRun={handleRunReport}
          isRunning={isRunning}
          hideMobileTopButton
        >
          <div className="space-y-2">
            <ReportFieldRow label="Location:">
              <select
                value={filters.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Locations</option>
                {filterOptions.locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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

            <ReportFieldRow label="Organisation:">
              <select
                value={filters.organisation}
                onChange={(e) => handleChange("organisation", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Organisations</option>
                {filterOptions.organisations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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
                <table className="min-w-full text-sm whitespace-nowrap">
                  <thead className="text-white">
                    <tr>
                      {[
                        "Client",
                        "Service",
                        "Location",
                        "Organisation",
                        "Booking Type",
                        "Booking Date",
                        "Cancellation Date",
                        "Staff",
                        "Price",
                        "Status",
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
                        className="border-b border-border-color last:border-b-0"
                      >
                        <td className="px-4 py-2">{row.client}</td>
                        <td className="px-4 py-2">{row.service}</td>
                        <td className="px-4 py-2">{row.location}</td>
                        <td className="px-4 py-2">{row.organisation}</td>
                        <td className="px-4 py-2 capitalize">{row.bookingType}</td>
                        <td className="px-4 py-2">{formatDate(row.bookingDate)}</td>
                        <td className="px-4 py-2">{formatDate(row.cancellationDate)}</td>
                        <td className="px-4 py-2">{row.staff}</td>
                        <td className="px-4 py-2 text-right">{formatMoney(row.price)}</td>
                        <td className="px-4 py-2 capitalize">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>

                  {summary && (
                    <tfoot className="bg-[#4C68A2] text-white">
                      <tr>
                        <td colSpan={8} className="px-4 py-2 font-semibold text-right">
                          Totals
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {formatMoney(summary.totalCancelledValue)}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.totalCancelledBookings}
                        </td>
                      </tr>
                    </tfoot>
                  )}
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