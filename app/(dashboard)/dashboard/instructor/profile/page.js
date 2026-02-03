
"use client";
import useAuth from "@/app/hooks/useAuth";
import {useUserData} from "@/app/hooks/useUserData";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {FaGear, FaLocationDot} from "react-icons/fa6";
import {GoPackage} from "react-icons/go";
import {toast} from "react-toastify";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {useMemo} from "react";
import {uploadProfilePhotoToMinio} from "@/app/utils/uploadProfilePhotoToMinio";
export default function InstructorProfile() {
  const {data: userData, isLoading} = useUserData();
  const {changePassword} = useAuth();
  const [photoFile, setPhotoFile] = useState(null);
  const [localPreview, setLocalPreview] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    homePhone: "",
    workPhone: "",
    mobile: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
    abn: "",
    vehicleModel: "",
    licencePlate: "",
    carInsuranceNumber: "",
    carInsuranceExpiry: "",
    instructorLicenceNumber: "",
    instructorLicenceExpiry: "",
    licenceNumber: "",
    licenceExpiry: "",
    piPlInsuranceNumber: "",
    piPlInsuranceExpiry: "",
    workingWithChildrenNumber: "",
    workingWithChildrenExpiry: "",
    vouchers: "None",
  });

  const {data: locations = [], isLoading: isLocationsLoading} = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data || [];
    },
  });

  const suburbOptions = React.useMemo(() => {
    const names = locations.map((l) => (l?.name || "").trim()).filter(Boolean);

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [locations]);

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        homePhone: userData?.homePhone || "",
        workPhone: userData?.workPhone || "",
        dateOfBirth: userData?.dateOfBirth || "",
        emergencyContact: userData?.emergencyContact || "",
        address: userData?.address || "",
        suburb: userData?.suburb || "",
        state: userData?.state || "",
        postCode: userData?.postCode || "",
        abn: userData?.abn || "",
        licencePlate: userData?.licencePlate || "",
        carInsuranceNumber: userData?.carInsuranceNumber || "",
        carInsuranceExpiry: userData?.carInsuranceExpiry || "",
        vouchers: userData?.vouchers || "None",
        vehicleModel: userData?.vehicleModel || "",
      });
    }
  }, [userData]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleProfileChange = (e) => {
    const {name, value} = e.target;
    setProfile((prev) => ({...prev, [name]: value}));
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // max 1MB (same as your UserProfile)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image size should be under 1MB");
      return;
    }

    setPhotoFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const handleCancelPhoto = () => {
    setPhotoFile(null);
    setLocalPreview("");
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return toast.error("Please select a photo first");

    try {
      setIsUploadingPhoto(true);

      // 1) upload to MinIO
      const photoKey = await uploadProfilePhotoToMinio(photoFile);

      await axios.patch("/api/instructors", {
        email: profile.email,
        photoKey,
        photo: "", // clear old direct url if exists
      });

      toast.success("Profile photo updated!");

      setPhotoFile(null);
      setLocalPreview(`/api/storage/proxy?key=${encodeURIComponent(photoKey)}`);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to update photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const avatarSrc = useMemo(() => {
    if (localPreview) return localPreview;

    return userData?.photo
      ? userData.photo
      : userData?.photoKey
        ? `/api/storage/proxy?key=${encodeURIComponent(userData.photoKey)}`
        : "/profile-avatar.png";
  }, [localPreview, userData]);

  const handlePasswordChange = (e) => {
    const {name, value} = e.target;
    setPasswordData((prev) => ({...prev, [name]: value}));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch("/api/instructors", {
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        homePhone: profile.homePhone,
        workPhone: profile.workPhone,
        dob: profile.dateOfBirth,
        emergencyContact: profile.emergencyContact,
        address: profile.address,
        suburb: profile.suburb,
        state: profile.state,
        postCode: profile.postCode,
        abn: profile.abn,
        licencePlate: profile.licencePlate,
        carInsuranceNumber: profile.carInsuranceNumber,
        carInsuranceExpiry: profile.carInsuranceExpiry,
        vouchers: profile.vouchers,
        vehicleModel: profile.vehicleModel,
      });

      console.log("Profile updated:", response.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const {currentPassword, newPassword, confirmPassword} = passwordData;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update password");
    }
  };
  if (isLoading || isLocationsLoading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen ">
      <div className="">
        <div className="">
          {/* Header */}
          <div className="py-4 border-b border-border-color">
            <h1 className="text-2xl font-bold text-gray-800">
              Instructor Profile
            </h1>
            <p className="text-gray-600">
              View and manage your profile information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-2 space-y-6">
               {/* Photo Card */}
                <div className=" border border-gray-200 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Profile Photo</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-50">
                        <Image
                          src={avatarSrc}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="block w-full text-sm text-gray-600 border p-3 border-gray-200 rounded-md cursor-pointer"
                        />

                        <div className="flex gap-2">
                          <PrimaryBtn
                            type="button"
                            onClick={handleUploadPhoto}
                            disabled={isUploadingPhoto || !photoFile}
                            className="justify-center"
                          >
                            {isUploadingPhoto ? "Uploading..." : "Update Photo"}
                          </PrimaryBtn>

                          {photoFile && (
                            <button
                              type="button"
                              onClick={handleCancelPhoto}
                              className="px-4 py-2 border border-border-color rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-gray-500">
                          Allowed: JPG/PNG/WebP • Max size: 1MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              <div className="bg-white border border-border-color rounded-lg shadow-sm">
               
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <PrimaryBtn onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </PrimaryBtn>
                  ) : (
                    <button
                      type="button"
                      onClick={handleProfileSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profile.dateOfBirth}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={profile.emergencyContact}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suburb
                        </label>
                        <select
                          name="suburb"
                          value={profile.suburb}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="">Select suburb</option>
                          {suburbOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profile.state}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Post Code
                        </label>
                        <input
                          type="text"
                          name="postCode"
                          value={profile.postCode}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vouchers
                        </label>
                        <input
                          type="text"
                          name="vouchers"
                          value={profile.vouchers}
                          onChange={handleProfileChange}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Home Phone
                        </label>
                        <input
                          type="text"
                          name="homePhone"
                          value={profile.homePhone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Phone
                        </label>
                        <input
                          type="text"
                          name="workPhone"
                          value={profile.workPhone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehical Model
                        </label>
                        <input
                          type="text"
                          name="Vehical Model"
                          value={profile.vehicleModel}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ABN
                        </label>
                        <input
                          type="text"
                          name="abn"
                          value={profile.abn}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Licence Plate
                        </label>
                        <input
                          type="text"
                          name="licencePlate"
                          value={profile.licencePlate}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Car Insurance
                        </label>
                        <input
                          type="text"
                          name="carInsuranceNumber"
                          value={profile.carInsuranceNumber}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Car Insurance Expiry
                        </label>
                        <input
                          type="date"
                          name="carInsuranceExpiry"
                          value={profile.carInsuranceExpiry}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      {/* Add similar fields for instructorLicenceNumber, instructorLicenceExpiry, licenceNumber, licenceExpiry, piPlInsuranceNumber, piPlInsuranceExpiry, workingWithChildrenNumber, workingWithChildrenExpiry */}
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-6">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Password Change and Quick Actions */}
            <div className="space-y-6">
              {userData.provider === "Credential" && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Change Password
                    </h2>
                  </div>

                  <div className="p-6">
                    {!isChangingPassword ? (
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">
                          For security, you should change your password
                          regularly
                        </p>
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                        >
                          Change Password
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0  top-5 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0  top-5 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0  top-5 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>

                          <div className="flex justify-end space-x-3 pt-4">
                            <button
                              type="button"
                              onClick={() => setIsChangingPassword(false)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                            >
                              Update Password
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {userData.provider === "Google" && (
                <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Links
                  </h2>
                  <div className="space-y-3">
                    {/* Manage Users */}
                    <Link
                      href="/dashboard/instructor/suburbs"
                      className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-primary/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaLocationDot className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Manage Suburbs
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/instructor/instructor-service-pacakge"
                      className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-primary/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <GoPackage className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Manage Service Package
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/instructor/settings"
                      className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-primary/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaGear className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">Settings</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
