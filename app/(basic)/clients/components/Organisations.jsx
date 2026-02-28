"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function Organisations({ onAddOrganisation }) {
  const [q, setQ] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setLoading(true);

        const params = {};
        if (q.trim()) params.q = q.trim();

        const res = await axios.get("/api/organizations", { params });
        if (cancelled) return;

        setOrgs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!cancelled) setOrgs([]);
        console.error("ORG FETCH ERROR:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  // rows = api result
  const rows = useMemo(() => orgs, [orgs]);

  return (
    <section className="">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Organisations</h1>
            <p className="mt-2 text-gray-700">
              Organisations group clients together and provide additional
              invoicing and chargeable accounts.
            </p>
          </div>

          {/* Add Organisation Button */}
          <div className="sm:mt-2">
            <PrimaryBtn onClick={onAddOrganisation}>Add Organisation</PrimaryBtn>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center">
          <div className="h-12 w-12 flex items-center justify-center rounded-l-md border border-border-color bg-gray-100">
            <FiSearch className="text-xl text-primary" />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, contact or email"
            className="h-12 w-full rounded-r-md border border-border-color px-4 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

      

        {/* Desktop Table */}
        <div className="hidden md:block mt-6 rounded-md border border-border-color bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary text-white">
                <th className="px-4 py-3 text-left font-semibold">
                  Organisation
                </th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Account</th>
                <th className="px-4 py-3 text-left font-semibold">Unpaid</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Chargeable
                </th>
                <th className="px-4 py-3 text-left font-semibold">Charges</th>
                <th className="px-4 py-3 text-left font-semibold">Vouchers</th>
                <th className="px-4 py-3 text-right font-semibold">Clients</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => (
                <tr
                  key={r._id || idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-t border-border-color`}
                >
                  <td className="px-4 py-4 text-primary font-medium">
                    {r.organisationName}
                  </td>
                  <td className="px-4 py-4 text-primary">
                    {(r.contactFirstName || "") + " " + (r.contactLastName || "")}
                  </td>
                  <td className="px-4 py-4 text-primary">
                    {r.accountBalance ?? 0}
                  </td>
                  <td className="px-4 py-4 text-gray-700">{r.unpaid ?? "-"}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {r.chargeable ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-gray-700">{r.charges ?? "-"}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {r.vouchers ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-right text-primary font-medium">
                    {r.clients ?? 0}
                  </td>
                </tr>
              ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-neutral">
                    No organisations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden mt-6 space-y-4">
          {!loading && rows.length === 0 && (
            <div className="text-center text-neutral py-6">
              No organisations found.
            </div>
          )}

          {rows.map((r, idx) => (
            <div
              key={r._id || idx}
              className="border border-border-color rounded-md bg-white p-4 shadow-sm"
            >
              <div className="font-semibold text-primary text-lg">
                {r.organisationName}
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {(r.contactFirstName || "") + " " + (r.contactLastName || "")}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Account:</span>
                  <div>{r.accountBalance ?? 0}</div>
                </div>
                <div>
                  <span className="text-gray-500">Contact Name:</span>
                  <div>{r.contactFirstName ?? ""}{r.contactLastName || ""}</div>
                </div>
                <div>
                  <span className="text-gray-500">Clients:</span>
                  <div>{r.clients ?? 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}