"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import {HiUserAdd} from "react-icons/hi";

export default function ClientSearch({setActiveTab, setSelectedClient}) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    clientNote: "", // (your API doesn't filter by this yet, fine)
    licence: "", // (your API doesn't filter by this yet, fine)
    clientId: "", // (your API doesn't filter by this yet, fine)
    activeOnly: true,
    showClientNote: false,
  });

  // 🔥 this controls when query runs
  const [filters, setFilters] = useState(null);

  const onChange = (e) => {
    const {name, type, checked, value} = e.target;
    setForm((p) => ({...p, [name]: type === "checkbox" ? checked : value}));
  };

  const queryParams = useMemo(() => {
    if (!filters) return null;

    const params = new URLSearchParams();

    if (filters.firstName?.trim())
      params.set("firstName", filters.firstName.trim());
    if (filters.lastName?.trim())
      params.set("lastName", filters.lastName.trim());
    if (filters.email?.trim()) params.set("email", filters.email.trim());
    if (filters.phone?.trim()) params.set("mobile", filters.phone.trim());
    if (filters.address?.trim()) params.set("address", filters.address.trim());

    if (filters.clientNote?.trim())
      params.set("clientNote", filters.clientNote.trim());
    if (filters.licence?.trim()) params.set("licence", filters.licence.trim());
    if (filters.clientId?.trim())
      params.set("clientId", filters.clientId.trim());

    params.set("activeOnly", String(!!filters.activeOnly));

    return params.toString();
  }, [filters]);

  const {
    data: clients = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["clients", queryParams],
    enabled: !!queryParams, // only fetch after Search click
    queryFn: async () => {
      const res = await axios.get(`/api/clients?${queryParams}`);
      return res.data;
    },
  });
  console.log(clients);
  const onSearch = (e) => {
    e.preventDefault();
    setFilters(form); // ✅ triggers query
  };

  return (
    <div className="bg-white border border-border-color rounded-md p-6 flex gap-5">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Client Search</h1>

        <form onSubmit={onSearch} className="space-y-2">
          <Field
            label="First Name:"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
          />
          <Field
            label="Last Name:"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
          />
          <Field
            label="Phone:"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />
          <Field
            label="Email:"
            name="email"
            value={form.email}
            onChange={onChange}
          />
          <Field
            label="Address:"
            name="address"
            value={form.address}
            onChange={onChange}
          />

          <Field
            label="Client Note:"
            name="clientNote"
            value={form.clientNote}
            onChange={onChange}
          />
          <Field
            label="Licence #:"
            name="licence"
            value={form.licence}
            onChange={onChange}
          />
          <Field
            label="Client Id:"
            name="clientId"
            value={form.clientId}
            onChange={onChange}
          />

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <input
                type="checkbox"
                name="activeOnly"
                checked={form.activeOnly}
                onChange={onChange}
                className="h-4 w-4"
              />
              Active Only
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <input
                type="checkbox"
                name="showClientNote"
                checked={form.showClientNote}
                onChange={onChange}
                className="h-4 w-4"
              />
              Show Client Note
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <PrimaryBtn
              type={`submit`}
              className="px-6! py-3! text-xl!"
              disabled={isFetching}
            >
              {isFetching ? "Searching..." : "Search"}
            </PrimaryBtn>
          </div>
        </form>

        {/* النتائج */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Results</h2>
            {isFetching && (
              <span className="text-sm text-gray-500">Updating...</span>
            )}
          </div>

          {isLoading && (
            <div className="mt-4">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600">Failed to load clients.</p>
          )}

          {!isLoading && !clients?.length && filters && (
            <p className="mt-4 text-sm text-gray-600">No clients found.</p>
          )}

          {!!clients?.length && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[700px] border border-border-color text-sm">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2">Mobile</th>
                    <th className="text-left px-3 py-2">Address</th>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-left px-3 py-2">Bookings</th>
                    {form.showClientNote && (
                      <th className="text-left px-3 py-2">Note</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {clients.map((c, idx) => {
                    const rowBg = idx % 2 === 0 ? "bg-white" : "bg-[#dcdcdc]";
                    const mobile = c.mobile || c.phone || "—";
                    const address = c.address || "—";
                    return (
                      <tr
                        key={c._id || idx}
                        onClick={() => {
                          setSelectedClient(c); // ✅ store clicked client
                          setActiveTab("client-details"); // ✅ go to details tab
                        }}
                        className={`cursor-pointer w-full text-left ${rowBg} hover:brightness-95 transition`}
                      >
                        <td className="px-3 py-2 font-semibold">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="px-3 py-2">{mobile}</td>

                        <td className="px-3 py-2">{address}</td>
                        <td className="px-3 py-2">{c.bookingCount || "-"}</td>
                        <td className="px-3 py-2 text-red-600 font-semibold">
                          {c.bookingCount > 0
                            ? `Last: ${c.lastBookingLabel}`
                            : "—"}
                        </td>
                        {/* ✅ Client Note (only when enabled) */}
                        {form.showClientNote && (
                          <td className="px-3 py-2 text-gray-700">
                            {c.clientNote || "—"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right side action */}
      <aside className="hidden lg:col-span-2 md:flex lg:flex-col items-center justify-start">
        <button
          type="button"
          onClick={() => setActiveTab("add-client")}
          className="flex flex-col items-center gap-3 mt-4"
        >
          <HiUserAdd className="text-7xl text-secondary" />
          <span className="text-primary font-medium">Add New Client</span>
        </button>
      </aside>
    </div>
  );
}

function Field({label, name, value, onChange}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
      <label className="sm:col-span-4 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="sm:col-span-8 input-class py-1!"
      />
    </div>
  );
}
