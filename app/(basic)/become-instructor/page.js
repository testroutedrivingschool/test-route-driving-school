/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {toast} from "react-toastify";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useRouter} from "next/navigation";
import {uploadProfilePhotoToMinio} from "@/app/utils/uploadProfilePhotoToMinio";
import useAuth from "@/app/hooks/useAuth";
import Container from "@/app/shared/ui/Container";

export default function JoinAsInstructor() {
  const {user: authUser, loading: authLoading} = useAuth();
  const {data: user, isLoading} = useUserData();
  const [photoPreview, setPhotoPreview] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [applied, setApplied] = useState({loading: true, data: null});
  const navigate = useRouter();

  const fetchApplication = React.useCallback(async (email) => {
    try {
      const res = await axios.get(`/api/instructors?email=${email}`);
      setApplied({loading: false, data: res.data});
    } catch (err) {
      if (err?.response?.status === 404) {
        setApplied({loading: false, data: null});
      } else {
        console.log(err);
        toast.error("Failed to check instructor status");
        setApplied({loading: false, data: null});
      }
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) return navigate.push("/login?redirect=/become-instructor");
    if (isLoading) return;
    if (!user?.email) return;

    setApplied((p) => ({...p, loading: true}));
    fetchApplication(user.email);
  }, [
    authLoading,
    authUser,
    isLoading,
    user?.email,
    navigate,
    fetchApplication,
  ]);

  const [languagesListState, setLanguagesListState] = useState([
    "English",
    "Arabic",
    "Hindi",
    "Urdu",
    "Chinese",
  ]);
  const [formData, setFormData] = useState({
    photo: null,
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    abn: "",
    licencePlate: "",
    vehicleModel: "",
    qualifications: "",
    bio: "",

    languages: [],
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        name: user.name || "",
        phone: user.phone || "",
        dob: user.dateOfBirth || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({...prev, photo: file}));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const avatarSrc = user?.photo
    ? user.photo
    : user?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(user.photoKey)}`
      : "/profile-avatar.png";
  const toggleArrayValue = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      return toast.error("Phone Number must be provided");
    }
    if (formData.languages.length === 0) {
      return toast.error("Select at least 1 language");
    }
    try {
      setFormLoading(true);
      let photoKey = "";
      // upload selected photo to MinIO (private)
      if (formData.photo) {
        photoKey = await uploadProfilePhotoToMinio(formData.photo);
      }

      const {photo, ...rest} = formData; // remove File object before sending

      const instructorData = {
        ...rest,
        photo: user.photo || "",
        photoKey: photoKey || user.photoKey || "", // ✅ store MinIO key
        status: "pending",
        userId: user._id,
    
      };

      await axios.post("/api/instructors", instructorData);

      toast.success("Instructor application submitted 🚗");
      fetchApplication(user.email);
      setFormLoading(false);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error;

        if (status === 409) return toast.error(message || "Already applied");
        if (status === 400)
          return toast.error(message || "Invalid data submitted");
      }

      toast.error("Something went wrong. Please try again.");
      setFormLoading(false);
    }
  };

  const previewSrc = photoPreview || avatarSrc;

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  if (authLoading || isLoading || applied.loading) return <LoadingSpinner />;

  if (applied.data) {
    // applied exists in DB
    const status = applied.data.status; // "pending" | "approved" | "rejected"

    return (
      <Container className="py-16">
        <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Instructor Application</h2>

          {status === "pending" && (
            <p className="text-yellow-600 font-semibold">
              ✅ Already Submitted — Admin approval pending.
            </p>
          )}

          {status === "approved" && (
            <>
              <p className="text-green-600 font-semibold">
                🎉 Approved! You are now an instructor.
              </p>
              <button
                onClick={() =>
                  navigate.push("/dashboard/instructor-service-pacakge")
                }
                className="mt-4 bg-primary text-white px-4 py-2 rounded"
              >
                Manage Services
              </button>
            </>
          )}

          {status === "rejected" && (
            <div>
              <p className="text-red-600 font-semibold">
                ❌ Rejected. You can apply again.
              </p>
              <button
                onClick={() => setApplied({loading: false, data: null})}
                className="mt-4 bg-primary text-white px-4 py-2 rounded"
              >
                Apply Again
              </button>
            </div>
          )}
        </div>
      </Container>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-3xl w-full"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join As Instructor
          </h1>
          <p className="text-gray-600">
            Join our team of skilled instructors and help learners gain
            confidence on the road.
          </p>
        </div>

        {/* Photo */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="border border-border-color p-2 cursor-pointer"
          />

          {(photoPreview || user?.photo || user?.photoKey) && (
            <img
              src={previewSrc}
              alt="Preview"
              className="w-16 h-16 mt-3 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="font-medium mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              className="input-class"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              readOnly
              placeholder="Email"
              className="input-class "
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="font-medium mb-1">
              Phone
            </label>
            <PhoneInput
              country={"au"}
              value={formData.phone}
              onChange={(phone) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: `+${phone}`,
                }))
              }
              inputStyle={{
                width: "100%",
                height: "48px",
                borderRadius: "12px",
              }}
              containerStyle={{width: "100%"}}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dob" className="font-medium mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              required
              value={formData.dob}
              type="date"
              className="input-class"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              name="address"
              value={formData.address}
              required
              placeholder="Address"
              className="input-class"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="abn" className="font-medium mb-1">
              ABN
            </label>
            <input
              id="abn"
              name="abn"
              placeholder="ABN"
              className="input-class"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="licencePlate" className="font-medium mb-1">
              Licence Plate
            </label>
            <input
              id="licencePlate"
              name="licencePlate"
              placeholder="Licence Plate"
              className="input-class"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="vehicleModel" className="font-medium mb-1">
              Vehicle Model
            </label>
            <input
              id="vehicleModel"
              name="vehicleModel"
              placeholder="Vehicle Model"
              className="input-class"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Qualifications */}
        <div className="mt-6 flex flex-col">
          <label htmlFor="qualifications" className="font-medium mb-1">
            Qualifications
          </label>
          <input
            id="qualifications"
            name="qualifications"
            placeholder="Driving Instructor Certificate, etc."
            className="input-class"
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <div className="mt-6 flex flex-col">
          <label htmlFor="bio" className="font-medium mb-1">
            Short Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="Tell students about your experience..."
            className="input-class"
            onChange={handleChange}
          />
        </div>

        {/* Languages */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Languages Spoken</h3>

          <div className="flex flex-wrap gap-4 mb-3">
            {languagesListState.map((lang) => (
              <label key={lang} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(formData.languages) &&
                    formData.languages.includes(lang)
                  }
                  onChange={() => toggleArrayValue("languages", lang)}
                />
                {lang}
              </label>
            ))}
          </div>

          {/* Button to show custom language input */}
          {!formData.showCustomLanguage && (
            <PrimaryBtn
              type="button"
              onClick={() =>
                setFormData((prev) => ({...prev, showCustomLanguage: true}))
              }
            >
              + Others
            </PrimaryBtn>
          )}

          {/* Add custom language input */}
          {formData.showCustomLanguage && (
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                placeholder="Other language"
                className="input-class flex-1"
                value={formData.customLanguage || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customLanguage: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                className="bg-primary text-white px-3 py-1 rounded"
                onClick={() => {
                  const newLang = formData.customLanguage?.trim();
                  if (!newLang) return;

                  // Add to formData.languages if not exists
                  if (!formData.languages.includes(newLang)) {
                    setFormData((prev) => ({
                      ...prev,
                      languages: [...prev.languages, newLang],
                      customLanguage: "",
                      showCustomLanguage: false,
                    }));
                  }

                  // Add to languagesListState if not exists
                  if (!languagesListState.includes(newLang)) {
                    setLanguagesListState((prev) => [...prev, newLang]);
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      customLanguage: "",
                      showCustomLanguage: false,
                    }));
                  }
                }}
              >
                Add
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={formLoading}
          className="w-full mt-10 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Apply as Instructor
        </button>
      </form>
    </div>
  );
}
