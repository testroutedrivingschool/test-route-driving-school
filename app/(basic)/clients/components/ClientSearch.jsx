import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import { useState } from "react";
import { HiUserAdd } from "react-icons/hi";

export default function ClientSearch() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    clientNote: "",
    licence: "",
    clientId: "",
    activeOnly: true,
    showClientNote: false,
  });

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSearch = (e) => {
    e.preventDefault();
    console.log("Search payload:", form);
  };

  return (
    <div className="bg-white border border-border-color rounded-md p-6 flex gap-5">
        <div className="flex-1">

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Client Search</h1>

      <form onSubmit={onSearch} className="space-y-2">
        <Field label="First Name:" name="firstName" value={form.firstName} onChange={onChange} />
        <Field label="Last Name:" name="lastName" value={form.lastName} onChange={onChange} />
        <Field label="Phone:" name="phone" value={form.phone} onChange={onChange} />
        <Field label="Email:" name="email" value={form.email} onChange={onChange} />
        <Field label="Address:" name="address" value={form.address} onChange={onChange} />
        <Field label="Client Note:" name="clientNote" value={form.clientNote} onChange={onChange} />
        <Field label="Licence #:" name="licence" value={form.licence} onChange={onChange} />
        <Field label="Client Id:" name="clientId" value={form.clientId} onChange={onChange} />

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
          <PrimaryBtn className="px-6! py-3! text-xl!">Search</PrimaryBtn>
        </div>
      </form>
        </div>
        {/* Right Side Action (optional) */}
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

function Field({ label, name, value, onChange }) {
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
