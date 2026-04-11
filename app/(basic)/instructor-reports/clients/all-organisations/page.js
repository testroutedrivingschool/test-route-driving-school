"use client";

import { useState } from "react";
import axios from "axios";
import Container from "@/app/shared/ui/Container";
import ReportShell from "../../components/ReportShell";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-AU");
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function AllOrganizationsPage() {
  const [rows, setRows] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRunReport = async () => {
    try {
      setIsRunning(true);
      setHasSearched(true);

      const res = await axios.get("/api/reports/all-organizations");
      setRows(res.data?.rows || []);
    } catch (error) {
      console.error("All organizations report error:", error);
      setRows([]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="py-4">
      <Container>
        <ReportShell
          title="All Organisations"
          onRun={handleRunReport}
          isRunning={isRunning}
          hideMobileTopButton
        >
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
                <h3 className="text-2xl font-bold text-black">All Organisations</h3>
                <p className="text-sm md:text-base text-black">
                  Total: {rows.length}
                </p>
              </div>

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
                        Contact
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Email
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        CC Email
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Mobile
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Land Line
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Fax
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Postal Address
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Post Code
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Created
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Acct Balance
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-right font-semibold border-b"
                      >
                        Assoc Clients
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Memberships
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-center font-semibold border-b"
                      >
                        Has Vouchers
                      </th>
                      <th
                        style={{ backgroundColor: "#4C68A2" }}
                        className="px-4 py-3 text-left font-semibold border-b"
                      >
                        Action Required
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row._id || index}
                        className="border-b border-border-color last:border-b-0"
                      >
                        <td className="px-4 py-2">{row.name || ""}</td>
                        <td className="px-4 py-2">{row.contact || ""}</td>
                        <td className="px-4 py-2">{row.email || ""}</td>
                        <td className="px-4 py-2">{row.ccEmail || ""}</td>
                        <td className="px-4 py-2">{row.mobile || ""}</td>
                        <td className="px-4 py-2">{row.landLine || ""}</td>
                        <td className="px-4 py-2">{row.fax || ""}</td>
                        <td className="px-4 py-2">{row.postalAddress || ""}</td>
                        <td className="px-4 py-2">{row.postCode || ""}</td>
                        <td className="px-4 py-2">{formatDate(row.createdAt)}</td>
                        <td
                          className={`px-4 py-2 text-right ${
                            Number(row.acctBalance || 0) < 0 ? "text-red-500" : ""
                          }`}
                        >
                          {formatMoney(row.acctBalance)}
                        </td>
                        <td className="px-4 py-2 text-right">{row.assocClients || 0}</td>
                        <td className="px-4 py-2">{row.memberships || ""}</td>
                        <td className="px-4 py-2 text-center">
                          {row.hasVouchers ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2">{row.actionRequired || ""}</td>
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