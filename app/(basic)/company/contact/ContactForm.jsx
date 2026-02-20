"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    postcode: "",
    phone: "",
    email: "",
    lessonType: "",
    message: "",
    source: "",
    consent: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const res = await axios.post("/api/contact", form);

      if (res.data.ok) {
        toast.success("Message sent successfully! We will contact you soon.")
   

        // Reset form
        setForm({
          firstName: "",
          lastName: "",
          postcode: "",
          phone: "",
          email: "",
          lessonType: "",
          message: "",
          source: "",
          consent: false,
        });
      }
    } catch (error) {

      setStatus({
        type: "error",
        msg:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 space-y-4">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          type="text"
          required
          placeholder="First Name *"
          className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          type="text"
          required
          placeholder="Last Name *"
          className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
        />
      </div>

      {/* Postcode & Phone */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="postcode"
          value={form.postcode}
          onChange={handleChange}
          type="text"
          placeholder="Postcode "
          className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="text"
          placeholder="Contact Number *"
          required
          className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
        />
      </div>

      {/* Email */}
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        placeholder="Email *"
        required
        className="p-4 rounded outline-none border-2 border-border-color focus:border-primary w-full"
      />

      {/* Radio */}
      <div>
        <p className="font-semibold mb-2">
          Manual/Automatic Driving Lesson or Become a Driving Instructor 
        </p>
        <div className="space-y-1 text-neutral">
          {["Manual", "Automatic", "Become a Driving Instructor"].map(
            (type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="lessonType"
                  value={type}
                  checked={form.lessonType === type}
                  onChange={handleChange}
                />
                {type}
              </label>
            )
          )}
        </div>
      </div>

      {/* Message */}
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        rows={4}
        placeholder="Your Message *"
        className="p-4 rounded outline-none border-2 border-border-color focus:border-primary w-full"
      />

      {/* Source */}
      <p className="font-semibold mb-2">How Did You Find Us?</p>
      <select
        name="source"
        value={form.source}
        onChange={handleChange}
        className="p-4 rounded outline-none border-2 border-border-color focus:border-primary w-full"
      >
        <option value="">Please Choose...</option>
        <option value="Google">Google</option>
        <option value="Facebook">Facebook</option>
        <option value="Friend">Friend</option>
      </select>

      {/* Consent */}
      <label className="flex items-start gap-2 text-sm text-neutral">
        <input
          type="checkbox"
          name="consent"
          checked={form.consent}
          onChange={handleChange}
        />
        I agree to receiving other offers from time to time.
      </label>

      {/* Status */}
      {status.msg && (
        <p
          className={`text-sm font-semibold ${
            status.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {status.msg}
        </p>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded transition disabled:opacity-60"
      >
        {loading ? "SENDING..." : "SEND MESSAGE"}
      </button>
    </form>
  );
}