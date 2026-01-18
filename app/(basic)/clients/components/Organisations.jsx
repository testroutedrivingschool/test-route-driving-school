"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

const demoOrgs = [
  {
    id: 1,
    organisation: "Grease Cleaners",
    contact: "Alexander Folino",
    account: "-$207.00",
    unpaid: "",
    chargeable: "",
    charges: "",
    vouchers: "",
    clients: 2,
  },
  {
    id: 2,
    organisation: "ACDC Motorized Solutions",
    contact: "Michael Karadimitris",
    account: "",
    unpaid: "",
    chargeable: "",
    charges: "",
    vouchers: "",
    clients: 2,
  },
  {
    id: 3,
    organisation: "Exact Labour Hire",
    contact: "Sally McClymont",
    account: "",
    unpaid: "",
    chargeable: "",
    charges: "",
    vouchers: "",
    clients: 2,
  },
];

export default function Organisations() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return demoOrgs;

    return demoOrgs.filter((r) => {
      const hay = `${r.organisation} ${r.contact}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

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

          <PrimaryBtn className="px-5! py-2! text-lg! w-full sm:w-auto">
            Add Organisation
          </PrimaryBtn>
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

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-md border border-border-color bg-white">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="bg-[#3f3f3f] text-white">
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
                  key={r.id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} border-t border-border-color`}
                >
                  <td className="px-4 py-4 text-primary font-medium">
                    {r.organisation}
                  </td>
                  <td className="px-4 py-4 text-primary">{r.contact}</td>
                  <td className="px-4 py-4 text-primary">{r.account}</td>
                  <td className="px-4 py-4 text-gray-700">{r.unpaid}</td>
                  <td className="px-4 py-4 text-gray-700">{r.chargeable}</td>
                  <td className="px-4 py-4 text-gray-700">{r.charges}</td>
                  <td className="px-4 py-4 text-gray-700">{r.vouchers}</td>
                  <td className="px-4 py-4 text-right text-primary font-medium">
                    {r.clients}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-600"
                  >
                    No organisations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
