"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import ReportShell from "../../components/ReportShell";
import ReportFieldRow from "../../components/ReportFieldRow";

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-AU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function InstructorBookingActivity() {
  const { data: user, isLoading: userLoading } = useUserData();

  const [filters, setFilters] = useState({
    instructor: "",
    dateFrom: "2026-03-01",
    dateTo: new Date().toISOString().split("T")[0],
  });

  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const instructorName = user?.name || user?.fullName || "";
  const instructorEmail = user?.instructorEmail || user?.email || "";

  useEffect(() => {
    if (instructorName && !filters.instructor) {
      setFilters((prev) => ({
        ...prev,
        instructor: instructorName,
      }));
    }
  }, [instructorName, filters.instructor]);

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

      const res = await axios.get("/api/reports/staff/booking-activity", {
        params: {
          instructor: filters.instructor,
          instructorEmail,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        },
      });

      setReportRows(res.data?.rows || []);
      setSummary(res.data?.summary || null);
    } catch (error) {
      console.error("Booking activity report error:", error);
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
          title="Booking Activity"
          onRun={handleRunReport}
          isRunning={isRunning}
          hideMobileTopButton
        >
          <div className="space-y-2">
            <ReportFieldRow label="Instructor:">
              <select
                value={filters.instructor}
                onChange={(e) => handleChange("instructor", e.target.value)}
                disabled
                className="min-w-60 w-full md:w-auto bg-gray-100 border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value={instructorName}>
                  {instructorName || "Select Instructor"}
                </option>
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
              <div className="overflow-x-auto rounded-lg border border-border-color">
                <table className="min-w-full text-sm">
                  <thead className="text-white whitespace-nowrap">
                    <tr>
                      {[
                        "Instructor",
                        "Bookings",
                        "Service Hours",
                        "Service Value",
                        "New Clients First Booking",
                        "New Clients Rebooked Same Instructor",
                        "New Clients Rebooked Different Instructor",
                        "Total Clients",
                        "Total Clients Rebooked Any Instructor",
                        "Cancelled Bookings",
                        "Unattended Bookings",
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
                    {reportRows.map((row, index) => (
                      <tr
                        key={`${row.instructor}-${index}`}
                        className="border-b border-border-color last:border-b-0 whitespace-nowrap"
                      >
                        <td className="px-4 py-2">{row.instructor}</td>
                        <td className="px-4 py-2 text-right">{row.bookings}</td>
                        <td className="px-4 py-2 text-right">{row.serviceHours}</td>
                        <td className="px-4 py-2 text-right">
                          ${formatMoney(row.serviceValue)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.newClientsFirstBooking}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.newClientsRebookedSameInstructor}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.newClientsRebookedDifferentInstructor}
                        </td>
                        <td className="px-4 py-2 text-right">{row.totalClients}</td>
                        <td className="px-4 py-2 text-right">
                          {row.totalClientsRebookedAnyInstructor}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.cancelledBookings}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.unattendedBookings}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {summary && (
                    <tfoot className="bg-[#4C68A2] text-white whitespace-nowrap">
                      <tr>
                        <td className="px-4 py-2 font-semibold"></td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.bookings}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.serviceHours}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          ${formatMoney(summary.serviceValue)}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.newClientsFirstBooking}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.newClientsRebookedSameInstructor}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.newClientsRebookedDifferentInstructor}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.totalClients}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.totalClientsRebookedAnyInstructor}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.cancelledBookings}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {summary.unattendedBookings}
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