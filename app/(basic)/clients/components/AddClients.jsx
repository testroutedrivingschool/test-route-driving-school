"use client";

import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";
import {toast} from "react-toastify";

const organizations = ["None"];
const referredByList = ["Not Specified", "Google", "Facebook","Business","Client","Internet","Walk in", "Friend","Other"];
const actionShotList = ["No Action Set", "No Action Required", "Action Required","Urgent Action Required"];

const initialState = {
  firstName: "",
  lastName: "",
  organization: "None",
  mobile: "",
  homePhone: "",
  workPhone: "",
  email: "",
  anotherEmail: "",
  dob: "",
  gender: "male",
  emergencyContact: "",
  emergencyPhone: "",
  address: "",
  suburb: "",
  state: "",
  postCode: "",
  accountBalance: "",
  referredBy: "Not Specified",

  activeClient: true,
  marketingSubscriber: true,
  receiveReminders: true,
  loginAccess: true,
  onlineBooking: true,
  showPhoto: true,

  actionShot: "No Action Set",
  actionRequired: "",
  assignedTo: "Anyone",
  actionBy: "",
  alerts: "",
  clientNote: "",
  comments: "",
};

export default function AddClients() {
  const [form, setForm] = useState(initialState);

  const queryClient = useQueryClient();

const { data: instructors = [], isLoading: instructorsLoading } = useQuery({
  queryKey: ["instructors"],
  queryFn: async () => {
    const res = await axios.get("/api/instructors");
    return res.data;
  },
});
const assignedToOptions = [
  "Anyone",
  ...instructors
    .map((i) => i?.name)
    .filter(Boolean),
];
  const addClient = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post("/api/clients", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["clients"]});
      toast.success("Client added ✅");
      setForm(initialState);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error || err?.message || "Failed to add client";
      toast.error(msg);
      console.error(err);
    },
  });

  const onChange = (e) => {
    const {name, type, value, checked} = e.target;
    setForm((p) => ({...p, [name]: type === "checkbox" ? checked : value}));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      return toast.error("First Name and Last Name are required");
    }

    // call API
    addClient.mutate(form);
   
  };

  return (
    <section className="py-6">
      <Container>
        <form onSubmit={onSubmit} className="bg-white rounded-md border border-border-color p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-gray-900">Add Client</h1>
            <PrimaryBtn>

   {addClient.isPending ? "Saving..." : "Save"}
            </PrimaryBtn>
            
          </div>

          <div className="mt-4 space-y-4">
            {/* Top basic info */}
            <Row label="First Name:" required>
              <Input name="firstName" value={form.firstName} onChange={onChange} />
            </Row>

            <Row label="Last Name:" required>
              <Input name="lastName" value={form.lastName} onChange={onChange} />
            </Row>

            <Row label="Organisation:">
              <Select name="organization" value={form.organization} onChange={onChange} options={organizations} />
            </Row>

            <Row label="Mobile:">
              <Input name="mobile" value={form.mobile} onChange={onChange} />
            </Row>

            <Row label="Home Phone:">
              <Input name="homePhone" value={form.homePhone} onChange={onChange} />
            </Row>

            <Row label="Work Phone:">
              <Input name="workPhone" value={form.workPhone} onChange={onChange} />
            </Row>

            <Row label="Email:">
              <Input name="email" value={form.email} onChange={onChange} />
            </Row>

            <Row label="Another Email:">
              <Input name="anotherEmail" value={form.anotherEmail} onChange={onChange} />
            </Row>

            <Row label="Date of Birth:">
              <Input type="date" name="dob" value={form.dob} onChange={onChange} />
            </Row>

            {/* Gender */}
            <Row label="Gender:">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Radio name="gender" value="male" checked={form.gender === "male"} onChange={onChange} label="Male" />
                <Radio name="gender" value="female" checked={form.gender === "female"} onChange={onChange} label="Female" />
                <Radio name="gender" value="other" checked={form.gender === "other"} onChange={onChange} label="Other" />
                <Radio name="gender" value="notSet" checked={form.gender === "notSet"} onChange={onChange} label="Not set" />
              </div>
            </Row>

            <Row label="Emergency Contact:">
              <Input name="emergencyContact" value={form.emergencyContact} onChange={onChange} />
            </Row>

            <Row label="Emergency Phone:">
              <Input name="emergencyPhone" value={form.emergencyPhone} onChange={onChange} />
            </Row>

            <Divider />

            {/* Address section */}
            <Row label="Address:">
              <Input name="address" value={form.address} onChange={onChange} />
            </Row>

            <Row label="Suburb:">
              <Input name="suburb" value={form.suburb} onChange={onChange} />
            </Row>

            <Row label="State:">
              <Input name="state" value={form.state} onChange={onChange} />
            </Row>

            <Row label="Post Code:">
              <Input name="postCode" value={form.postCode} onChange={onChange} className="max-w-[140px]" />
            </Row>

            <Divider />

            <Row label="Account Balance:">
              <Input name="accountBalance" disabled value={form.accountBalance} onChange={onChange} className="max-w-[140px]" />
            </Row>

            <Divider />

            <Row label="Referred By:">
              <Select name="referredBy" value={form.referredBy} onChange={onChange} options={referredByList} />
            </Row>

            <Divider />

            {/* Checkboxes / permissions */}
            <Row label="Active:">
              <div className="space-y-2 text-xs sm:text-sm">
                <Check
                  name="activeClient"
                  checked={form.activeClient}
                  onChange={onChange}
                  label="Is an active client."
                />
                <Check
                  name="marketingSubscriber"
                  checked={form.marketingSubscriber}
                  onChange={onChange}
                  label="Receive newsletter, bulk SMS and marketing sequences."
                />
                <Check
                  name="receiveReminders"
                  checked={form.receiveReminders}
                  onChange={onChange}
                  label="Receive reminders for their bookings."
                />
                <Check
                  name="loginAccess"
                  checked={form.loginAccess}
                  onChange={onChange}
                  label="Allow this client to access their account."
                />
                <Check
                  name="onlineBooking"
                  checked={form.onlineBooking}
                  onChange={onChange}
                  label="Allow this client to make online bookings."
                />
                <Check
                  name="showPhoto"
                  checked={form.showPhoto}
                  onChange={onChange}
                  label="Show profile photo if available."
                />
              </div>
            </Row>

            <Divider />

            {/* Action + notes */}
            <Row label="Action Shot:">
              <Select name="actionShot" value={form.actionShot} onChange={onChange} options={actionShotList} />
            </Row>

            <Row label="Action Required:">
              <Textarea name="actionRequired" value={form.actionRequired} onChange={onChange} rows={3} />
            </Row>

            <Row label="Assigned to:">
  <select
    name="assignedTo"
    value={form.assignedTo}
    onChange={onChange}
    disabled={instructorsLoading}
    className="input-class py-1!"
  >
    {instructorsLoading ? (
      <option>Loading instructors...</option>
    ) : (
      assignedToOptions.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))
    )}
  </select>
</Row>


            <Row label="Action by:">
              <Input type="date" name="actionBy" value={form.actionBy} onChange={onChange} className="max-w-[200px]" />
            </Row>

            <Row label="Alerts:">
              <Textarea name="alerts" value={form.alerts} onChange={onChange} rows={4} />
            </Row>

            <Row label="Client Note:">
              <Textarea name="clientNote" value={form.clientNote} onChange={onChange} rows={4} />
            </Row>

            <Row label="Comments:">
              <Textarea name="comments" value={form.comments} onChange={onChange} rows={4} />
            </Row>

            {/* Bottom Save */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                  disabled={addClient.isPending}
                className="bg-primary hover:bg-primary/80 text-white font-semibold px-10 py-2 rounded-sm"
              >
               {addClient.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </Container>
    </section>
  );
}

/* -------- Small UI Helpers -------- */

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
    <input
      type={type}
      {...props}
      className={`input-class py-1! ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`input-class py-1! ${className}`}
    />
  );
}

function Select({ options, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`input-class py-1!  ${className}`}
    >
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
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

function Radio({ name, value, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
