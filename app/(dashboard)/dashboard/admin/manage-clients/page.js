"use client";

import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "react-toastify";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ManageClients() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [q, setQ] = useState("");


  const {data: clients = [], isLoading} = useQuery({
    queryKey: ["manage-clients", q],
    queryFn: async () => {
      const res = await axios.get("/api/clients", {
        params: q ? {q} : {},
      });
      return res.data || [];
    },
  });

 
const handleDelete = async (client) => {
  const result = await Swal.fire({
    title: "Delete client?",
    html: `
      <div style="text-align:left;line-height:1.6">
        <b>${client.firstName || ""} ${client.lastName || ""}</b><br/>
        ${client.email || ""}<br/>
        <small>This action cannot be undone.</small>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`/api/clients/${client._id}`);
    toast.success("Client deleted successfully");
    queryClient.invalidateQueries({queryKey: ["manage-clients"]});
  } catch (err) {
    toast.error(err?.response?.data?.error || "Failed to delete client");
  }
};

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manage Clients</h1>

        <input
          type="text"
          placeholder="Search client..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-border-color rounded-lg px-4 py-2 w-full md:w-80"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-border-color shadow">
        <table className="w-full min-w-[900px] text-sm">
       <thead className="bg-gray-100">
  <tr>
    <th className="text-left p-3">Name</th>
    <th className="text-left p-3">Email</th>
    <th className="text-left p-3">Mobile</th>
    <th className="text-left p-3">Suburb</th>
    <th className="text-left p-3">Assigned</th>
    <th className="text-left p-3">Balance</th>
    <th className="text-left p-3">Bookings</th>
    <th className="text-left p-3">Status</th>
    <th className="text-right p-3">Action</th>
  </tr>
</thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client._id} className="border-t border-border-color">
                <td className="p-3 font-semibold">
  <button
    onClick={() =>
      router.push(`/clients?clientId=${client._id}`)
    }
    className="text-primary hover:underline"
  >
    {client.firstName} {client.lastName}
  </button>
</td>
                <td className="p-3">{client.email || "-"}</td>
                <td className="p-3">{client.mobile || "-"}</td>
                <td className="p-3">{client.suburb || "-"}</td>
                <td className="p-3">
  {client.assignedTo === "Anyone"
    ? "Anyone"
    : client.assignedInstructorName || "Not Assigned"}
</td>
                <td className="p-3 font-bold">
                  ${Number(client.accountBalance || 0).toFixed(2)}
                </td>
                <td className="p-3">{client.bookingCount || 0}</td>
                <td className="p-3">
                  {client.activeClient ? "Active" : "Inactive"}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                   onClick={() =>
  router.push(`/clients?clientId=${client._id}`)
}
                      className="px-3 py-1 rounded bg-primary text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(client)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!clients.length && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
    </div>
  );
}