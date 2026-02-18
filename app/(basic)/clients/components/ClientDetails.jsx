"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {useMemo, useState} from "react";
import ClientHistory from "./ClientHistory";
import ClientNotes from "./ClientNotes";
import ClientChecklists from "./ClientChecklists";
import ClientMessages from "./ClientMessages";
import axios from "axios";
import {toast} from "react-toastify";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import NewDropdown from "../../instructor-bookings/components/NewDropdown";

function safeStr(v) {
  return v === null || v === undefined ? "" : String(v);
}

export default function ClientDetails({client, onBack}) {
  const {data: suburbs, isLoading} = useQuery({
    queryKey: ["suburbs"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data;
    },
  });
  console.log(client);
  const initial = useMemo(
    () => ({
      firstName: safeStr(client.firstName),
      lastName: safeStr(client.lastName),
      organization: safeStr(client.organization || "None"),

      mobile: safeStr(client.mobile || client.phone),
      homePhone: safeStr(client.homePhone),
      workPhone: safeStr(client.workPhone),

      email: safeStr(client.email),
      anotherEmail: safeStr(client.anotherEmail),

      dob: safeStr(client.dob), // keep as text for now
      gender: safeStr(client.gender || "not_set"),

      emergencyContact: safeStr(client.emergencyContact),
      emergencyPhone: safeStr(client.emergencyPhone),

      address: safeStr(client.address),
      suburb: safeStr(client.suburb),
      state: safeStr(client.state),
      postCode: safeStr(client.postCode),

      accountBalance: Number(client.accountBalance || 0),

      referredBy: safeStr(client.referredBy || "Not Specified"),
      clientId: safeStr(client._id),

      actionShot: safeStr(client.actionShot || "No Action Set"),
      actionRequired: safeStr(client.actionRequired),
      assignedTo: safeStr(client.assignedTo || "Anyone"),
      actionBy: safeStr(client.actionBy),
      onlineBooking: client.onlineBooking || false,
      activeClient: client.activeClient || false,
      marketingSubscriber: client.marketingSubscriber || false,
      receiveReminders: client.receiveReminders || false,
      loginAccess: client.loginAccess || false,
      showPhoto: client.showPhoto || false,
      alerts: safeStr(client.alerts),
      clientNote: safeStr(client.clientNote),
      comments: safeStr(client.comments),
    }),
    [client],
  );
  const suburbOptions = useMemo(() => {
    if (!suburbs) return [];
    return suburbs?.map((s) => s.name);
  }, [suburbs]);
  const [activeTab, setActiveTab] = useState("client");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initial);

  const onChange = (e) => {
    const {name, type, value, checked} = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSave = async () => {
    try {
      setSaving(true);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        organization: form.organization,

        mobile: form.mobile,
        homePhone: form.homePhone,
        workPhone: form.workPhone,

        email: form.email,
        anotherEmail: form.anotherEmail,

        dob: form.dob,
        gender: form.gender,

        emergencyContact: form.emergencyContact,
        emergencyPhone: form.emergencyPhone,

        address: form.address,
        suburb: form.suburb,
        state: form.state,
        postCode: form.postCode,

        referredBy: form.referredBy,

        activeClient: form.activeClient,
        marketingSubscriber: form.marketingSubscriber,
        receiveReminders: form.receiveReminders,
        loginAccess: form.loginAccess,
        onlineBooking: form.onlineBooking,
        showPhoto: form.showPhoto,

        actionShot: form.actionShot,
        actionRequired: form.actionRequired,
        assignedTo: form.assignedTo,
        actionBy: form.actionBy,

        alerts: form.alerts,
        clientNote: form.clientNote,
        comments: form.comments,
      };

      const res = await axios.patch(`/api/clients/${form.clientId}`, payload);

      // ✅ update the form with latest saved server data
      const updated = res.data;

      setForm((p) => ({
        ...p,
        ...updated,
        clientId: updated._id,
      }));

      toast.success("Client updated ✅");
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || "Failed to update client";

      if (status === 409)
        toast.error(msg); // duplicate email/mobile
      else toast.error(msg);

      console.log("PATCH ERROR:", err?.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  const sendLoginInvite = async () => {
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      await axios.post("/api/admin/create-client-login", {
        name: fullName || "",
        email: form.email,
        role: "user",
        clientId: form.clientId,
        emergencyContact: form.emergencyContact || "",
        emergencyPhone: form.emergencyPhone || "",

        address: form.address || "",
        suburb: form.suburb || "",
        state: form.state || "",
        postCode: form.postCode || "",
      });

      toast.success("Login email sent 📧");

      // update UI immediately (so button switches to reset)
      setForm((p) => ({...p, loginAccess: true}));
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send login email");
    }
  };
  const sendResetPassword = async () => {
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      await axios.post("/api/admin/send-client-reset-password", {
        name: fullName,
        email: form.email,
      });

      toast.success("Reset password email sent 🔐");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send reset link");
    }
  };
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white border border-border-color rounded-md ">
      {/* Header */}
      <div className="sticky top-19 md:top-[89px] z-60 bg-white p-4">
        <div className="pt-4 px-0">
          <div className="flex items-start justify-between gap-6 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {form.firstName} {form.lastName}
            </h1>

            <div className="text-right">
              <PrimaryBtn
                onClick={onSave}
                disabled={saving}
                className="px-10! py-3!"
              >
                {saving ? "Saving..." : "Save"}
              </PrimaryBtn>

              <button
                type="button"
                onClick={onBack}
                className="block mt-2 text-primary hover:underline font-medium"
              >
                Return to Search ⤴
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 border-b border-border-color flex flex-wrap gap-2">
            {[
              {key: "client", label: "Client"},
              {key: "history", label: "History"},
              {key: "notes", label: "Notes"},
              {key: "checklists", label: "Checklists"},
              {key: "messages", label: "Messages"},
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-2 py-2 text-sm font-semibold rounded-t border border-border-color border-b-0
        ${
          activeTab === t.key
            ? "bg-white text-gray-900"
            : "bg-gray-50 text-primary hover:bg-white"
        }`}
              >
                {t.label}
              </button>
            ))}
            <NewDropdown />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 py-2  px-4">
        {activeTab === "client" && (
          <div className="space-y-8">
            {/* Basic */}
            <Section>
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

              <SelectField
                label="Organisation:"
                name="organization"
                value={form.organization}
                onChange={onChange}
                options={[form.organization || "None", "None"]}
              />

              <Row3
                label="Mobile:"
                input={
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={onChange}
                    className="w-full input-class py-2!"
                  />
                }
              />

              <Field
                label="Home Phone:"
                name="homePhone"
                value={form.homePhone}
                onChange={onChange}
              />
              <Field
                label="Work Phone:"
                name="workPhone"
                value={form.workPhone}
                onChange={onChange}
              />

              {/* Email (like screenshot) */}
              <div className="grid grid-cols-12 items-start gap-4">
                <label className="col-span-4 text-sm font-medium text-gray-900 pt-2">
                  Email:
                </label>

                <div className="col-span-8">
                  {/* top row: input + Email link */}
                  <div className="flex items-center justify-between gap-3">
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className="flex-1 input-class py-2!"
                    />

                    <button
                      type="button"
                      className="text-primary text-sm font-semibold hover:underline"
                    >
                      <a
                        href="mailto:testroutedrivingschool@gmail.com"
                        className=""
                      >
                        Email
                      </a>
                      
                    </button>
                  </div>

                  {/* bottom row: actions */}
                  <div className="mt-2 flex items-center gap-10 text-sm">
                    {!form.loginAccess ? (
                      <button
                        type="button"
                        onClick={sendLoginInvite}
                        className="text-primary font-semibold hover:underline"
                      >
                        Send Login Email
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={sendResetPassword}
                        className="text-primary font-semibold hover:underline"
                        disabled={!form.loginAccess}
                        title={!form.loginAccess ? "Enable login first" : ""}
                      >
                        Send Reset Email
                      </button>
                    )}
                  </div>

                  {/* status text */}
                  {!form.loginAccess ? (
                    <p className="mt-1 text-sm text-gray-500">
                      This client does not have a login account.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      This client has login access enabled.
                    </p>
                  )}
                </div>
              </div>

              <Field
                label="Alternate Email:"
                name="anotherEmail"
                value={form.anotherEmail}
                onChange={onChange}
              />

              <Field
                label="Date of Birth:"
                name="dob"
                value={form.dob}
                onChange={onChange}
              />

              <GenderRadio value={form.gender} onChange={onChange} />
            </Section>

            {/* Emergency */}
            <Section title="">
              <Field
                label="Emergency Contact:"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={onChange}
              />
              <Row3
                label="Emergency Phone:"
                input={
                  <input
                    name="emergencyPhone"
                    value={form.emergencyPhone}
                    onChange={onChange}
                    className="w-full input-class py-2!"
                  />
                }
              />
            </Section>

            {/* Address */}
            <Section title="">
              <Field
                label="Address:"
                name="address"
                value={form.address}
                onChange={onChange}
              />

              <SelectField
                label="Suburb:"
                name="suburb"
                value={form.suburb}
                onChange={onChange}
                options={suburbOptions}
              />

              <Field
                label="State:"
                name="state"
                value={form.state}
                onChange={onChange}
              />
              <Field
                label="Post Code:"
                name="postCode"
                value={form.postCode}
                onChange={onChange}
              />
            </Section>

            {/* Account */}
            <Section title="">
              <Row2
                label="Account Balance:"
                input={
                  <input
                    name="accountBalance"
                    value={form.accountBalance}
                    onChange={onChange}
                    className="input-class py-2!"
                    type="number"
                    disabled
                  />
                }
              />

              <Row2
                label="Referred By:"
                input={
                  <select
                    name="referredBy"
                    value={form.referredBy}
                    onChange={onChange}
                    className="input-class py-2!"
                  >
                    <option value={form.referredBy}>{form.referredBy}</option>
                    <option value="Not Specified">Not Specified</option>
                    <option value="Client">Client</option>
                    <option value="Google">Google</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                }
              />
            </Section>

            {/* Flags */}
            <Section title="">
              <ChecksGrid
                items={[
                  {name: "activeClient", label: "Is an active Client."},
                  {
                    name: "marketingSubscriber",
                    label:
                      "Receive newsletter, bulk SMS and marketing sequences.",
                  },
                  {
                    name: "receiveReminders",
                    label: "Receive reminders for their bookings.",
                  },
                  {
                    name: "loginAccess",
                    label: "Allow this client to login access their account.",
                  },
                  {
                    name: "onlineBooking",
                    label: "Allow this client to make online bookings.",
                  },
                  {
                    name: "showPhoto",
                    label: "Show profile photo if available.",
                  },
                ]}
                values={form}
                onChange={onChange}
              />
            </Section>

            {/* Actions */}
            <Section title="">
              <Row2
                label="Action Status:"
                input={
                  <select
                    name="actionShot"
                    value={form.actionShot}
                    onChange={onChange}
                    className="input-class py-2!"
                  >
                    <option value="">No Action Set</option>
                    <option value="no-action-required">
                      No Action Required
                    </option>
                    <option value="action-required">Action Required</option>
                    <option value="urgent-action-required">
                      Urgent Action Required
                    </option>
                  </select>
                }
              />

              <TextArea
                label="Action Required:"
                name="actionRequired"
                value={form.actionRequired}
                onChange={onChange}
              />
              <TextArea
                label="Alerts:"
                name="alerts"
                value={form.alerts}
                onChange={onChange}
              />
              <TextArea
                label="Client Note:"
                name="clientNote"
                value={form.clientNote}
                onChange={onChange}
              />
              <TextArea
                label="Comments:"
                name="comments"
                value={form.comments}
                onChange={onChange}
              />
            </Section>

            {/* Bottom Save */}
            <div className="flex justify-end">
              <PrimaryBtn
                onClick={onSave}
                disabled={saving}
                className="px-10! py-3!"
              >
                {saving ? "Saving..." : "Save"}
              </PrimaryBtn>
            </div>
          </div>
        )}

        {activeTab === "history" && <ClientHistory clientId={form.clientId} />}
        {activeTab === "notes" && <ClientNotes clientId={form.clientId} />}
        {activeTab === "checklists" && (
          <ClientChecklists clientId={form.clientId} />
        )}
        {activeTab === "messages" && (
          <ClientMessages clientId={form.clientId} />
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function Section({title, children}) {
  return (
    <div className="space-y-4">
      {title ? (
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      ) : null}
      {children}
      <div className="border-t border-border-color pt-1" />
    </div>
  );
}

function Field({label, name, value, onChange}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <label className="col-span-4 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="col-span-8 input-class py-2!"
      />
    </div>
  );
}

function SelectField({label, name, value, onChange, options}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <label className="col-span-4 text-sm font-medium text-gray-900">
        {label}
      </label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="col-span-8 input-class py-2!"
      >
        <option value="">Select {label}</option>

        {options.map((o, idx) => (
          <option key={idx} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Row2({label, input}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <label className="col-span-4 text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="col-span-8">{input}</div>
    </div>
  );
}

function Row3({label, input, right}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <label className="col-span-4 text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="col-span-6">{input}</div>
      <div className="col-span-2">{right}</div>
    </div>
  );
}

function GenderRadio({value, onChange}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <label className="col-span-4 text-sm font-medium text-gray-900">
        Gender:
      </label>

      <div className="col-span-8 flex flex-wrap items-center gap-4 text-sm">
        {[
          {v: "male", label: "Male"},
          {v: "female", label: "Female"},
          {v: "other", label: "Other"},
          {v: "not_set", label: "Not set"},
        ].map((g) => (
          <label key={g.v} className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value={g.v}
              checked={value === g.v}
              onChange={onChange}
            />
            {g.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function ChecksGrid({items, values, onChange}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((it) => (
        <label key={it.name} className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name={it.name}
            checked={!!values[it.name]}
            onChange={onChange}
            className="h-4 w-4"
          />
          <span className="text-gray-900">{it.label}</span>
        </label>
      ))}
    </div>
  );
}

function TextArea({label, name, value, onChange}) {
  return (
    <div className="grid grid-cols-12 items-start gap-4">
      <label className="col-span-4 text-sm font-medium text-gray-900 pt-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="col-span-8 input-class py-2! min-h-[90px]"
      />
    </div>
  );
}
