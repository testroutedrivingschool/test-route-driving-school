"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
// import axios from "axios"; // later when you connect API

const statesAU = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const actionStateList = ["No Action Set", "Follow Up", "Call Back", "On Hold"];

const initialState = {
  organisationName: "",
  contactFirstName: "",
  contactLastName: "",
  email: "",
  ccEmail: "",
  mobile: "",
  landLine: "",
  fax: "",
  address: "",
  suburb: "",
  state: "",
  postcode: "",
  comments: "",

  productSupplier: false,
  accountBalance: "",

  active: true,
  marketingSubscriber: false,
  bookingReminders: false,
  debtorLoginAccess: false,

  actionState: "No Action Set",
  actionRequired: "",
  assignedTo: "Anyone",
  actionBy: "",
  alerts: "",
  organisationNotes: "",
};

export default function AddOrganisation({ onBack }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.organisationName.trim()) {
      return toast.error("Organisation Name is required");
    }

    try {
      setSaving(true);

      // TODO: connect API
      await axios.post("/api/organizations", form);

      toast.success("Organisation added ✅");
      setForm(initialState);
      onBack?.();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to add organisation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-6">
      <Container>
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-md border border-border-color p-4 sm:p-6"
        >
          {/* Header (same as Add Client) */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-gray-900">Add Organisation</h1>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="h-10 px-4 rounded-md border border-border-color text-primary hover:bg-gray-50"
              >
                Back
              </button>

              <PrimaryBtn type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </PrimaryBtn>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Basic info */}
            <Row label="Organisation Name:" required>
              <Input
                name="organisationName"
                value={form.organisationName}
                onChange={onChange}
              />
            </Row>

            <Row label="Contact First Name:">
              <Input
                name="contactFirstName"
                value={form.contactFirstName}
                onChange={onChange}
              />
            </Row>

            <Row label="Contact Last Name:">
              <Input
                name="contactLastName"
                value={form.contactLastName}
                onChange={onChange}
              />
            </Row>

            <Row label="Email:">
              <Input name="email" value={form.email} onChange={onChange} />
            </Row>

            <Row label="CC Email:">
              <Input name="ccEmail" value={form.ccEmail} onChange={onChange} />
            </Row>

            <Row label="Mobile:">
              <Input name="mobile" value={form.mobile} onChange={onChange} />
            </Row>

            <Row label="Land Line:">
              <Input name="landLine" value={form.landLine} onChange={onChange} />
            </Row>

            <Row label="Fax:">
              <Input name="fax" value={form.fax} onChange={onChange} />
            </Row>

            <Divider />

            {/* Address */}
            <Row label="Address:">
              <Input name="address" value={form.address} onChange={onChange} />
            </Row>

            <Row label="Suburb:">
              <Input name="suburb" value={form.suburb} onChange={onChange} />
            </Row>

            <Row label="State:">
              <Select
                name="state"
                value={form.state}
                onChange={onChange}
                options={["", ...statesAU]}
              />
            </Row>

            <Row label="Postcode:">
              <Input
                name="postcode"
                value={form.postcode}
                onChange={onChange}
                className="max-w-[140px]"
              />
            </Row>

            <Divider />

            {/* Flags */}
            <Row label="Product Supplier:">
              <Check
                name="productSupplier"
                checked={form.productSupplier}
                onChange={onChange}
                label="Organisation supplies products."
              />
            </Row>

            <Row label="Account Balance:">
              <Input
              type="number"
                name="accountBalance"
                value={form.accountBalance}
                onChange={onChange}
                className="max-w-[140px]"
              />
            </Row>

            <Divider />

            <Row label="Active:">
              <div className="space-y-2 text-xs sm:text-sm">
                <Check
                  name="active"
                  checked={form.active}
                  onChange={onChange}
                  label="Is an active Organisation."
                />
                <Check
                  name="marketingSubscriber"
                  checked={form.marketingSubscriber}
                  onChange={onChange}
                  label="Receive newsletter, bulk SMS and marketing sequences."
                />
                <Check
                  name="bookingReminders"
                  checked={form.bookingReminders}
                  onChange={onChange}
                  label="Email reminders to associated clients."
                />
                <Check
                  name="debtorLoginAccess"
                  checked={form.debtorLoginAccess}
                  onChange={onChange}
                  label="All associated clients can access their account."
                />
              </div>
            </Row>

            <Divider />

            {/* Action + notes */}
            <Row label="Action State:">
              <Select
                name="actionState"
                value={form.actionState}
                onChange={onChange}
                options={actionStateList}
              />
            </Row>

            <Row label="Action Required:">
              <Textarea
                name="actionRequired"
                value={form.actionRequired}
                onChange={onChange}
                rows={3}
              />
            </Row>

            <Row label="Assigned to:">
              <Select
                name="assignedTo"
                value={form.assignedTo}
                onChange={onChange}
                options={["Anyone"]}
              />
            </Row>

            <Row label="Action by:">
              <Input
                type="date"
                name="actionBy"
                value={form.actionBy}
                onChange={onChange}
                className="max-w-[200px]"
              />
            </Row>

            <Row label="Alerts:">
              <Textarea
                name="alerts"
                value={form.alerts}
                onChange={onChange}
                rows={4}
              />
            </Row>

            <Row label="Organisation Notes:">
              <Textarea
                name="organisationNotes"
                value={form.organisationNotes}
                onChange={onChange}
                rows={4}
              />
            </Row>

            <Row label="Comments:">
              <Textarea
                name="comments"
                value={form.comments}
                onChange={onChange}
                rows={4}
              />
            </Row>

            {/* Bottom Save (same pattern) */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onBack}
                className="h-10 px-4 rounded-md border border-border-color text-primary hover:bg-gray-50"
              >
                Back
              </button>
              <PrimaryBtn type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </PrimaryBtn>
            </div>
          </div>
        </form>
      </Container>
    </section>
  );
}

/* -------- Small UI Helpers (copied style from Add Client) -------- */

function Row({ label, children, required }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-3">
      <label className="text-xs sm:text-sm text-gray-900 font-medium pt-2">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <div>{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200 my-3" />;
}

function Input({ className = "", type = "text", ...props }) {
  return (
    <input type={type} {...props} className={`input-class py-1! ${className}`} />
  );
}

function Textarea({ className = "", ...props }) {
  return <textarea {...props} className={`input-class py-1! ${className}`} />;
}

function Select({ options, className = "", ...props }) {
  return (
    <select {...props} className={`input-class py-1! ${className}`}>
      {options.map((op) => (
        <option key={op} value={op}>
          {op || "Select"}
        </option>
      ))}
    </select>
  );
}

function Check({ name, checked, onChange, label }) {
  return (
    <label className="flex items-start gap-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4"
      />
      <span>{label}</span>
    </label>
  );
}