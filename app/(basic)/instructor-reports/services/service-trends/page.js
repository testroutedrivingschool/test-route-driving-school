"use client";

import { useEffect, useMemo, useState } from "react";
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

function formatHours(value) {
  const hours = Number(value || 0);
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

export default function ServiceTrendsPage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [filters, setFilters] = useState({
    location: "all",
    staff: "",
    organisation: "all",
    paymentType: "all",
    vehicle: "all",
    dateFrom: firstDay,
    dateTo: lastDay,
  });

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [options, setOptions] = useState({
    locations: [],
    organisations: [],
    paymentTypes: [],
    vehicles: [],
  });
  const [isRunning, setIsRunning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);

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

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setMetaLoading(true);
        const res = await axios.get("/api/reports/services/service-trends", {
          params: { meta: "1" },
        });

        setOptions({
          locations: res.data?.locations || [],
          organisations: res.data?.organisations || [],
          paymentTypes: res.data?.paymentTypes || [],
          vehicles: res.data?.vehicles || [],
        });
      } catch (error) {
        console.error("Service trends meta load error:", error);
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMeta();
  }, []);

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

      const res = await axios.get("/api/reports/services/service-trends", {
        params: {
          location: filters.location,
          staff: filters.staff,
          instructorEmail: staffEmail,
          organisation: filters.organisation,
          paymentType: filters.paymentType,
          vehicle: filters.vehicle,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        },
      });

      setRows(res.data?.rows || []);
      setSummary(res.data?.summary || null);
    } catch (error) {
      console.error("Service trends report error:", error);
      setRows([]);
      setSummary(null);
    } finally {
      setIsRunning(false);
    }
  };

  const paymentTypeLabel = useMemo(() => {
    if (filters.paymentType === "all") return "All Paid Services";
    return filters.paymentType;
  }, [filters.paymentType]);

  if (userLoading || metaLoading) return <LoadingSpinner />;

  return (
    <section className="py-4">
      <Container>
        <ReportShell
          title="Service Trends"
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
                {options.locations.map((item) => (
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
                {options.organisations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Payment Types:">
              <select
                value={filters.paymentType}
                onChange={(e) => handleChange("paymentType", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Paid Services</option>
                {options.paymentTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Vehicle:">
              <select
                value={filters.vehicle}
                onChange={(e) => handleChange("vehicle", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Vehicles</option>
                {options.vehicles.map((item) => (
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

          {rows.length > 0 ? (
            <div className="mt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 px-1">
                <h3 className="text-2xl font-bold text-black">Service Trends Report</h3>
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
                        Service Names
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Attended Bookings
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Class
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Unpaid Bookings
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Cancelled Bookings
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Failed to Attend
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Current Revenue
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Expected Revenue
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Contact Hours
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={`${row.serviceName}-${index}`}
                        className="border-b border-border-color last:border-b-0 whitespace-nowrap"
                      >
                        <td className="px-4 py-2">{row.serviceName}</td>
                        <td className="px-4 py-2 text-right">{row.attendedBookings}</td>
                        <td className="px-4 py-2 text-right">{row.classCount}</td>
                        <td className="px-4 py-2 text-right">{row.unpaidBookings}</td>
                        <td className="px-4 py-2 text-right">{row.cancelledBookings}</td>
                        <td className="px-4 py-2 text-right">{row.failedToAttend}</td>
                        <td className="px-4 py-2 text-right">
                          {formatMoney(row.currentRevenue)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatMoney(row.expectedRevenue)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatHours(row.contactHours)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="bg-[#4C68A2] text-white whitespace-nowrap">
                    <tr>
                      <td className="px-4 py-2 font-semibold">
                        Count: {summary?.serviceCount ?? 0}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {summary?.totalAttendedBookings ?? 0}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {summary?.totalClassCount ?? 0}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {summary?.totalUnpaidBookings ?? 0}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {summary?.totalCancelledBookings ?? 0}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {summary?.totalFailedToAttend ?? 0}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatMoney(summary?.totalCurrentRevenue)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatMoney(summary?.totalExpectedRevenue)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatHours(summary?.totalContactHours)}
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