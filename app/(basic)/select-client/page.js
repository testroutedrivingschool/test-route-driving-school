"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {HiUserAdd} from "react-icons/hi";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "react-toastify";

export default function SelectClientForBooking() {
  const [booking, setBooking] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",     // search input
    email: "",
    address: "",
    organization: "",
    activeOnly: true,
  });

  // ✅ validation state for "Create New Client"
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
  });

  const requiredErrors = {
    firstName: !form.firstName.trim(),
    lastName: !form.lastName.trim(),
    phone: !form.phone.trim(),
    email: !form.email.trim(),
  };

  const showErr = (name) => touched[name] && requiredErrors[name];

  // ✅ We'll only search when user clicks Search
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("pendingBooking");
    if (!data) return router.push("/instructor-bookings");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooking(JSON.parse(data));
  }, [router]);

  const dateValue = booking?.bookingDate || booking?.date;
  const timeValue = booking?.bookingTime || booking?.time;

  const onChange = (e) => {
    const {name, type, checked, value} = e.target;
    setForm((p) => ({...p, [name]: type === "checkbox" ? checked : value}));
  };

  const buildQueryString = (payload) => {
    const params = new URLSearchParams();
    if (payload.email?.trim()) params.set("email", payload.email.trim());
    if (payload.phone?.trim()) params.set("mobile", payload.phone.trim());
    if (payload.firstName?.trim()) params.set("firstName", payload.firstName.trim());
    if (payload.lastName?.trim()) params.set("lastName", payload.lastName.trim());
    if (payload.address?.trim()) params.set("address", payload.address.trim());
    if (payload.organization?.trim()) params.set("organization", payload.organization.trim());
    if (payload.activeOnly === true) params.set("activeOnly", "true");
    return params.toString();
  };

  const queryString = useMemo(() => {
    if (!searchParams) return "";
    return buildQueryString(searchParams);
  }, [searchParams]);

  const {data: clients = [], isLoading} = useQuery({
    queryKey: ["clients-search", queryString],
    enabled: !!searchParams,
    queryFn: async () => {
      const res = await axios.get(`/api/clients?${queryString}`);
      return res.data;
    },
  });

  const onSearch = (e) => {
    e.preventDefault();
    setSearchParams({...form});
  };

  // ✅ POST new client
  const createClient = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post("/api/clients", payload);
      return res.data;
    },
    onSuccess: (newClient) => {
      toast.success("Client created ✅");
      queryClient.invalidateQueries({queryKey: ["clients-search"]});

      // ✅ auto-select and continue
      selectClient(newClient);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || "Failed to create client";
      toast.error(msg);
    },
  });

  const selectClient = (client) => {
  const id = client?._id || client?.insertedId; 
  if (!id) return;

  const next = {
    ...(booking || {}),
    clientId:id,
    clientName: `${client.firstName || ""} ${client.lastName || ""}`.trim(),
    clientEmail: client.email || "",
    clientPhone: client.mobile || client.phone || "",
    clientAddress: client.address || "",
    suburb: client.suburb || "",
  };

  sessionStorage.setItem("pendingBooking", JSON.stringify(next));
  router.push("/booking-confirm/payment-confirm");
};


  // ✅ Create New Client click (validate first)
  const onCreateNewClient = () => {
    // mark required fields touched
    setTouched({firstName: true, lastName: true, phone: true, email: true});

    const hasError = Object.values(requiredErrors).some(Boolean);
    if (hasError) return;

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      mobile: form.phone,
      email: form.email,
      address: form.address,
      organization: form.organization || "None",
      activeClient: true,
    };

    createClient.mutate(payload);
  };

  return (
    <section className="max-w-5xl mx-auto my-16 p-6 border border-border-color">
      <div className="bg-white  rounded-md  flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Select Client</h1>

          <p className="text-neutral font-semibold">
            {dateValue ? `${new Date(dateValue).toDateString()} at ${timeValue || ""}` : ""}
          </p>

          <form onSubmit={onSearch} className="mt-6 space-y-3">
            <Field
              label="First Name:"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              required
              error={showErr("firstName")}
              onBlur={() => setTouched((p) => ({...p, firstName: true}))}
            />

            <Field
              label="Last Name:"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              required
              error={showErr("lastName")}
              onBlur={() => setTouched((p) => ({...p, lastName: true}))}
            />

            <Field
              label="Mobile:"
              name="phone"
              value={form.phone}
              onChange={onChange}
              required
              error={showErr("phone")}
              onBlur={() => setTouched((p) => ({...p, phone: true}))}
            />

            <Field
              label="Email:"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              error={showErr("email")}
              onBlur={() => setTouched((p) => ({...p, email: true}))}
            />

            <Field
              label="Address:"
              name="address"
              value={form.address}
              onChange={onChange}
            />

            <Field
              label="Organisation:"
              name="organization"
              value={form.organization}
              onChange={onChange}
            />

            <div className="pt-2">
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

             
            </div>

            <div className="pt-4 flex justify-start">
              <PrimaryBtn type="submit" className="px-10! py-3! text-lg!">
                {isLoading ? "Searching..." : "Search for Client"}
              </PrimaryBtn>
            </div>
          </form>

          
        </div>

        {/* Right side - Create new client */}
        <aside className="w-full lg:w-[220px] flex lg:flex-col items-center justify-start">
          <button
            type="button"
            onClick={onCreateNewClient}
            className="flex flex-col items-center gap-3 mt-2"
            disabled={createClient.isPending}
          >
            <HiUserAdd className="text-7xl text-secondary" />
            <span className="text-primary font-medium">
              {createClient.isPending ? "Creating..." : "Create a New Client"}
            </span>
          </button>
        </aside>
      </div>
      <ClientsResultTable clients={clients} onSelect={selectClient} />
    </section>
  );
}

function Field({label, name, value, onChange, required, error, onBlur}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
      <label className="sm:col-span-3 text-sm font-medium text-gray-900">
        {label}
      </label>

      <div className="sm:col-span-7">
        <input
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`input-class py-1! w-full ${
            error ? "border border-red-600 focus:ring-red-200" : ""
          }`}
        />
      </div>

      <div className="sm:col-span-2 text-sm text-red-600 font-semibold">
        {required && error ? "Required" : ""}
      </div>
    </div>
  );
}

function ClientsResultTable({ clients = [], onSelect }) {
  const formatLast = (c) => {
    if (!c?.lastBooking) return "—";
    const d = new Date(c.lastBooking);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-AU", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Australia/Sydney",
    });
  };

  return (
    <div className="mt-6 w-full rounded-md border border-border-color bg-white overflow-hidden">
      {/* header */}
      <div className="px-4 py-3 border-b border-border-color flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Results</h3>
        <div className="text-xs text-gray-500">
          {clients.length ? `${clients.length} client(s)` : ""}
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="px-4 py-6 text-sm text-gray-500">No clients found.</div>
      ) : (
        <div className="w-full">
          <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="text-left px-2 sm:px-3 py-2 w-[45%] sm:w-auto">
                  Name
                </th>
                <th className="text-left px-2 sm:px-3 py-2 w-[35%] sm:w-auto">
                  Mobile
                </th>

                {/* hide on mobile */}
                <th className="hidden sm:table-cell text-left px-3 py-2">
                  Address
                </th>

                <th className="text-center px-2 sm:px-3 py-2 w-[20%] sm:w-auto">
                  #
                </th>

                {/* hide on mobile */}
                <th className="hidden sm:table-cell text-left px-3 py-2">
                  Bookings
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c, idx) => {
                const rowBg = idx % 2 === 0 ? "bg-white" : "bg-[#f3f3f3]";
                const name =
                  `${c.firstName || ""} ${c.lastName || ""}`.trim() || "—";
                const mobile = c.mobile || c.phone || "—";
                const address = c.address || "—";
                const lastLabel =
                  c.bookingCount > 0 ? formatLast(c) : "—";

                return (
                  <tr
                    key={c._id || idx}
                    onClick={() => onSelect?.(c)}
                    className={`cursor-pointer ${rowBg} hover:brightness-95 transition`}
                  >
                    {/* Name + (mobile-only last booking under name) */}
                    <td className="px-2 sm:px-3 py-2 font-semibold wrap-break-word">
                      <div className="leading-snug text-primary">{name}</div>

                      <div className="sm:hidden mt-1 text-[11px] font-medium text-gray-700">
                        <span className="opacity-70">Last:</span>{" "}
                        <span className="text-primary">{lastLabel}</span>
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="px-2 sm:px-3 py-2 wrap-break-word text-primary">
                      {mobile}
                    </td>

                    {/* Address hidden on mobile */}
                    <td className="hidden sm:table-cell px-3 py-2 wrap-break-word text-primary">
                      {address}
                    </td>

                    {/* Count */}
                    <td className="px-2 sm:px-3 py-2 text-center text-primary">
                      {c.bookingCount || "-"}
                    </td>

                    {/* Bookings hidden on mobile */}
                    <td className="hidden sm:table-cell px-3 py-2 text-primary font-semibold wrap-break-word">
                      {lastLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
