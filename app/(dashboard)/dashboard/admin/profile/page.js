"use client";
import useAuth from "@/app/hooks/useAuth";
import {useUserData} from "@/app/hooks/useUserData";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useMemo, useState} from "react";
import {FaEye, FaEyeSlash, FaUsersCog} from "react-icons/fa";
import {toast} from "react-toastify";
import Image from "next/image";
import {uploadProfilePhotoToMinio} from "@/app/utils/uploadProfilePhotoToMinio";

export default function AdminProfile() {
  const {changePassword} = useAuth();
  const {data: userData, isLoading} = useUserData();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    emergencyContact: "",
    address: "",
  });

  // ===== Photo state =====
  const [photoFile, setPhotoFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(""); // objectURL
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        dateOfBirth: userData?.dateOfBirth || "",
        emergencyContact: userData?.emergencyContact || "",
        address: userData?.address || "",
      });
    }
  }, [userData]);

  // Your avatar rule + local preview override
  const avatarSrc = useMemo(() => {
    if (localPreview) return localPreview;

    return userData?.photo
      ? userData.photo
      : userData?.photoKey
        ? `/api/storage/proxy?key=${encodeURIComponent(userData.photoKey)}`
        : "/profile-avatar.png";
  }, [localPreview, userData]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileChange = (e) => {
    const {name, value} = e.target;
    setProfile((prev) => ({...prev, [name]: value}));
  };

  const handlePasswordChange = (e) => {
    const {name, value} = e.target;
    setPasswordData((prev) => ({...prev, [name]: value}));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be under 5MB");
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

      // 2) update user doc (clear photo url so photoKey will be used)
      await axios.patch("/api/users", {
        email: profile.email,
        photoKey,
        photo: "", // ✅ clear old url if exists
      });

      toast.success("Profile photo updated!");

      // Show proxy-served image after upload
      setPhotoFile(null);
      setLocalPreview(`/api/storage/proxy?key=${encodeURIComponent(photoKey)}`);
    } catch (error) {
     
      toast.error(error?.response?.data?.error || "Failed to update photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch("/api/users", {
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        emergencyContact: profile.emergencyContact,
        address: profile.address,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
     
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
    
      toast.error(error.message || "Failed to update password");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
            <p className="text-neutral">
              View and manage your profile information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
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
                        className="block w-full text-sm text-neutral border p-3 border-gray-200 rounded-md cursor-pointer"
                      />

                      <div className="flex gap-2">
                        <PrimaryBtn
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
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500">
                        Allowed: JPG/PNG/WebP • Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal info */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Personal Information
                  </h2>
                  {!isEditing && (
                    <PrimaryBtn onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </PrimaryBtn>
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
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
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

            {/* Right */}
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
                        <p className="text-neutral mb-4">
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
                          {[
                            "currentPassword",
                            "newPassword",
                            "confirmPassword",
                          ].map((field, idx) => (
                            <div key={idx} className="relative">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === "currentPassword"
                                  ? "Current Password"
                                  : field === "newPassword"
                                    ? "New Password"
                                    : "Confirm New Password"}
                              </label>
                              <input
                                type={showPassword ? "text" : "password"}
                                name={field}
                                value={passwordData[field]}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-gray-400 hover:text-neutral"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          ))}

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
                    <Link
                      href="/dashboard/manage-admins"
                      className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-primary/10 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaUsersCog className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Manage Users
                          </p>
                          <p className="text-sm text-gray-500">
                            View, edit, and manage administrator accounts
                          </p>
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
