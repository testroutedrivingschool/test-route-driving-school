"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import ReportShell from "../../components/ReportShell";
import ReportFieldRow from "../../components/ReportFieldRow";

const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-AU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function displayCell(value, isMoney = false) {
  const num = Number(value || 0);
  if (num === 0) return "0";
  return isMoney ? formatMoney(num) : num;
}

export default function StaffBookedServicesPage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState({
    year: String(currentYear),
    location: "all",
    staff: "",
    region: "all",
    suburb: "all",
  });

  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    regions: [],
    suburbs: [],
  });
  const [isRunning, setIsRunning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const staffName = user?.name || user?.fullName || "";
  const staffEmail = user?.instructorEmail || user?.email || "";
useEffect(() => {
  const loadSuburbs = async () => {
    try {
      const res = await axios.get("/api/locations");

      const suburbs = res.data?.map((item) => item.name) || [];

      setFilterOptions((prev) => ({
        ...prev,
        suburbs,
      }));
    } catch (err) {
      console.error("Failed to load suburbs", err);
    }
  };

  loadSuburbs();
}, []);
  useEffect(() => {
    if (staffName && !filters.staff) {
      setFilters((prev) => ({
        ...prev,
        staff: staffName,
      }));
    }
  }, [staffName, filters.staff]);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= currentYear - 5; y -= 1) {
      years.push(String(y));
    }
    return years;
  }, [currentYear]);

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

      const res = await axios.get("/api/reports/staff/booked-services", {
        params: {
          year: filters.year,
          location: filters.location,
          staff: filters.staff,
          instructorEmail: staffEmail,
          region: filters.region,
          suburb: filters.suburb,
        },
      });

      setReportRows(res.data?.rows || []);
      setSummary(res.data?.summary || null);
      setFilterOptions({
  locations: ["Sydney"],
  regions: ["Sydney"],
  suburbs: res.data?.filterOptions?.suburbs || [],
});
    } catch (error) {
      console.error("Booked services report error:", error);
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
          title="Booked Services"
          onRun={handleRunReport}
          isRunning={isRunning}
          hideMobileTopButton
        >
          <div className="space-y-2">
            <ReportFieldRow label="Year:">
              <select
                value={filters.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </ReportFieldRow>

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

            <ReportFieldRow label="Region:">
              <select
                value={filters.region}
                onChange={(e) => handleChange("region", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Regions</option>
                {filterOptions.regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </ReportFieldRow>

            <ReportFieldRow label="Suburb:">
              <select
                value={filters.suburb}
                onChange={(e) => handleChange("suburb", e.target.value)}
                className="min-w-60 w-full md:w-auto border border-border-color rounded-md px-4 py-2 outline-none"
              >
                <option value="all">All Suburbs</option>
                {filterOptions.suburbs.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Name
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Service Name
                      </th>

                      {monthNamesShort.map((month) => (
                        <th
                          key={`${month}-count`}
                          style={{ backgroundColor: "#4C68A2" }}
                          className="px-4 py-3 text-right font-semibold border-b"
                        >
                          {month}#
                        </th>
                      ))}

                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Total Count
                      </th>

                      {monthNamesShort.map((month) => (
                        <th
                          key={`${month}-amount`}
                          style={{ backgroundColor: "#4C68A2" }}
                          className="px-4 py-3 text-right font-semibold border-b"
                        >
                          {month}$
                        </th>
                      ))}
                      <th
  style={{ backgroundColor: "#4C68A2" }}
  className="px-4 py-3 text-right font-semibold border-b"
>
  Total $
</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((row, index) => (
                      <tr
                        key={`${row.serviceName}-${index}`}
                        className="border-b border-border-color last:border-b-0"
                      >
                        <td className="px-4 py-2">
                          {index === 0 ? row.name : ""}
                        </td>
                        <td className="px-4 py-2">{row.serviceName}</td>

                        {row.monthlyCounts.map((value, idx) => (
                          <td key={idx} className="px-4 py-2 text-right">
                            {displayCell(value)}
                          </td>
                        ))}

                        <td
  className="px-4 py-2 text-right font-semibold text-white"
  style={{ backgroundColor: "#4C68A2" }}
>
  {displayCell(row.totalCount)}
</td>

                        {row.monthlyAmounts.map((value, idx) => (
                          <td key={idx} className="px-4 py-2 text-right">
                            {displayCell(value, true)}
                          </td>
                        ))}
                        <td
  className="px-4 py-2 text-right font-semibold text-white"
  style={{ backgroundColor: "#4C68A2" }}
>
  {displayCell(
    row.monthlyAmounts.reduce((a, b) => a + b, 0),
    true
  )}$
</td>
                      </tr>
                    ))}
                  </tbody>

                  {summary && (
                    <tfoot className="bg-[#4C68A2] text-white">
                      <tr>
                        <td className="px-4 py-2 font-semibold"></td>
                        <td className="px-4 py-2 font-semibold text-right">
                          Total:
                        </td>

                        {summary.monthlyCounts.map((value, idx) => (
                          <td key={idx} className="px-4 py-2 text-right font-semibold">
                            {displayCell(value)}
                          </td>
                        ))}

                        <td className="px-4 py-2 text-right font-semibold">
                          {displayCell(summary.totalCount)}
                        </td>

                        {summary.monthlyAmounts.map((value, idx) => (
                          <td key={idx} className="px-4 py-2 text-right font-semibold">
                            {displayCell(value, true)}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-right font-semibold">
  {displayCell(
    summary.monthlyAmounts.reduce((a, b) => a + b, 0),
    true
  )}$
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