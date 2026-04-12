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

function calculateAge(dob) {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : "";
}

function formatPhone(value) {
  if (!value) return "";
  return `M: ${value}`;
}

export default function NewClientsPage() {
  const { data: user, isLoading: userLoading } = useUserData();

  const [filters, setFilters] = useState({
    location: "all",
    staff: "",
    organisation: "all",
    dateFrom: "2026-03-12",
    dateTo: new Date().toISOString().split("T")[0],
  });

  const [reportRows, setReportRows] = useState([]);
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

      const res = await axios.get("/api/reports/clients/new-clients", {
        params: {
          location: filters.location,
          staff: filters.staff,
          instructorEmail: staffEmail,
          organisation: filters.organisation,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        },
      });

      setReportRows(res.data?.rows || []);
      setFilterOptions({
        locations: res.data?.filterOptions?.locations || [],
        organisations: res.data?.filterOptions?.organisations || [],
      });
    } catch (error) {
      console.error("New clients report error:", error);
      setReportRows([]);
    } finally {
      setIsRunning(false);
    }
  };

  if (userLoading) return <LoadingSpinner />;

  return (
    <section className="py-4">
      <Container>
        <ReportShell
          title="New Clients"
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
                        "Name",
                        "Org. Name",
                        "Gender",
                        "Age",
                        "Acct Balance",
                        "Phone",
                        "Email",
                        "Address",
                        "Referred By",
                        "Created",
                        "First Booking",
                        "Last Booking",
                        "Next Booking",
                        "Location Name",
                        "Services",
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
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">{row.orgName}</td>
                        <td className="px-4 py-2">{row.gender}</td>
                        <td className="px-4 py-2">{row.age}</td>
                        <td className="px-4 py-2">{row.accountBalance}</td>
                        <td className="px-4 py-2">{formatPhone(row.phone)}</td>
                        <td className="px-4 py-2">{row.email}</td>
                        <td className="px-4 py-2 whitespace-normal min-w-[140px]">
                          {row.address}
                        </td>
                        <td className="px-4 py-2 whitespace-normal min-w-[120px]">
                          {row.referredBy}
                        </td>
                        <td className="px-4 py-2">{formatDate(row.created, true)}</td>
                        <td className="px-4 py-2 whitespace-normal min-w-[110px]">
                          {row.firstBookingDate !== "-" ? (
                            <>
                              {formatDate(row.firstBookingDate)}
                              <br />
                              {row.firstBookingInstructor}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-normal min-w-[110px]">
                          {row.lastBookingDate !== "-" ? (
                            <>
                              {formatDate(row.lastBookingDate)}
                              <br />
                              {row.lastBookingInstructor}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-normal min-w-[110px]">
                          {row.nextBookingDate !== "-" ? (
                            <>
                              {formatDate(row.nextBookingDate)}
                              <br />
                              {row.nextBookingInstructor}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-2">{row.locationName}</td>
                        <td className="px-4 py-2 whitespace-normal min-w-40">
                          {row.services}
                        </td>
                      </tr>
                    ))}
                  </tbody>
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