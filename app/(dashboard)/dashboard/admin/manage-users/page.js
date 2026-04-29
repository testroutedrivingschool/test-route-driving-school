"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {FaPhone} from "react-icons/fa";
import {FiMail} from "react-icons/fi";
import {toast} from "react-toastify";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const queryClient = useQueryClient();

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/api/users");
      return res.data;
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({email, role}) => {
      const res = await axios.patch(`/api/users`, {email, role});
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update role");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (email) => {
      const res = await axios.delete(`/api/users?email=${email}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete user");
    },
  });

  // Handle role change
const handleRoleChange = async (email, currentRole, newRole) => {
  // instructors are locked
  if (currentRole === "instructor") return;

  // only allow user <-> admin
  if (!["user", "admin"].includes(newRole)) return;

  // confirm when removing admin
  if (currentRole === "admin" && newRole !== "admin") {
    const result = await Swal.fire({
      title: `Change role to ${newRole}?`,
      text: "This user will lose admin privileges!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
    if (!result.isConfirmed) return;
  }

  updateRoleMutation.mutate({ email, role: newRole });
};

  // Handle delete user with SweetAlert2
  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: `Delete ${user.name}?`,
      text: "This action will remove the user from your database and Firebase!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteUserMutation.mutate(user.email);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to load users
          </h3>
          <p className="text-neutral">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage users</h1>
            <p className="text-neutral mt-2">
              Manage administrator accounts and permissions
            </p>
          </div>
        </div>
      </div>

      {/* users Table */}
      <div className="hidden md:block  bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-300">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {users.map((user) => {
                const avatarSrc = user?.photo
                  ? user.photo
                  : user?.photoKey
                    ? `/api/storage/proxy?key=${encodeURIComponent(user.photoKey)}`
                    : "/profile-avatar.png";
                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <Image
                            width={10}
                            height={10}
                            className="h-10 w-10 rounded-full object-cover"
                            src={avatarSrc}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaPhone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone || "Not provided"}
                        </div>
                      </div>
                    </td>
                   <td className="py-4 px-6">
  <div className="flex items-center gap-3">
    {user.role === "instructor" ? (
      // locked view-only
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        instructor
      </span>
    ) : (
      <>
        <select
          value={user.role}
          onChange={(e) => handleRoleChange(user.email, user.role, e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.role === "admin"
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.role}
        </span>
      </>
    )}
  </div>
</td>

                    <td className="py-4 px-6">
                      <div className="">
                        <PrimaryBtn
  className={`text-sm py-2! px-2! ${
    user.role === "instructor"
      ? "bg-gray-300! cursor-not-allowed!"
      : "bg-red-500"
  }`}
  onClick={() => {
    if (user.role === "instructor") {
      toast.error("Instructor cannot be deleted");
      return;
    }
    handleDeleteUser(user);
  }}
  disabled={user.role === "instructor"}
>
  Remove User
</PrimaryBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Cards */}
<div className="md:hidden space-y-3">
  {users.map((user) => {
    const avatarSrc = user?.photo
      ? user.photo
      : user?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(user.photoKey)}`
      : "/profile-avatar.png";

    return (
      <div
        key={user._id}
        className="bg-white rounded-xl border border-border-color shadow-sm p-4 w-full"
      >
        {/* top */}
<div className="flex items-start justify-between gap-3">
  <div className="flex items-center gap-3 min-w-0">
    <Image
      width={56}
      height={56}
      className="h-14 w-14 rounded-full object-cover shrink-0"
      src={avatarSrc}
      alt={user.name || "user"}
    />

    <div className="min-w-0">
      <div className="font-semibold truncate">{user.name}</div>
      <div className="text-xs text-gray-500">ID: {user._id.slice(-8)}</div>

      <div className="mt-1 text-sm text-gray-700 flex items-center gap-2 min-w-0">
        <FiMail className="text-gray-400 shrink-0" />
        <span className="truncate">{user.email}</span>
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-2">
        <FaPhone className="text-gray-400 shrink-0" />
        <span className="truncate">{user.phone || "Not provided"}</span>
      </div>
    </div>
  </div>

  {/* Remove button (top-right) */}
  <PrimaryBtn
  className={`text-xs px-1! md:px-3! py-2! ${
    user.role === "instructor"
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-red-500"
  }`}
  onClick={() => {
    if (user.role === "instructor") {
      toast.error("Instructor cannot be deleted");
      return;
    }
    handleDeleteUser(user);
  }}
  disabled={user.role === "instructor"}
>
  Remove user
</PrimaryBtn>
</div>

     
<div className="mt-3 flex items-center gap-3">
  {user.role === "instructor" ? (
    <span className="px-3 py-2 text-xs font-medium rounded-full bg-red-100 text-red-800">
      instructor
    </span>
  ) : (
    <>
      <select
        value={user.role}
        onChange={(e) => handleRoleChange(user.email, user.role, e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      <span
        className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
          user.role === "admin"
            ? "bg-primary/10 text-primary"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {user.role}
      </span>
    </>
  )}
</div>

       
      </div>
    );
  })}
</div>
    </div>
  );
}
