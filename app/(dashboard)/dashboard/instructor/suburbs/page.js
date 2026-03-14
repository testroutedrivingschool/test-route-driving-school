"use client";

import React, {useState, useEffect} from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Modal from "@/app/shared/ui/Modal";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import useAuth from "@/app/hooks/useAuth";
import {toast} from "react-toastify";
import {FaPlus} from "react-icons/fa";

const dayShort = [
  {label: "M", key: "mon"},
  {label: "T", key: "tue"},
  {label: "W", key: "wed"},
  {label: "TH", key: "thu"},
  {label: "F", key: "fri"},
  {label: "S", key: "sat"},
  {label: "SU", key: "sun"},
];
const zones = ["South", "North", "East", "West", "Central"];

const durationsOrder = [
  {label: "1 Hour", minutes: 60},
  {label: "1hr 30m", minutes: 90},
  {label: "2 Hours", minutes: 120},
  {label: "2hr 30m", minutes: 150},
  {label: "3 Hours", minutes: 180},
  {label: "3hr 30m", minutes: 210},
  {label: "4 Hours", minutes: 240},
];

const defaultServices = [
  "Automatic Driving Lesson",
  "Driving Test Assessment",
  "Driving Test Package",
  "Parking Package",
  "Highway Package",
  "Night Driving Lesson",
  "City Driving Package",
];

function buildDefaultSuburbPackages(instructorServices = []) {
  if (Array.isArray(instructorServices) && instructorServices.length > 0) {
    return instructorServices
      .filter((service) =>
        Array.isArray(service.prices) && service.prices.some((p) => p != null)
      )
      .map((service) => {
        const activeDurations = durationsOrder.map((_, i) => {
          const hasPrice = service.prices?.[i] != null;
          const isActive = !!service.activeDurations?.[i];
          return hasPrice && isActive;
        });

        return {
          serviceName: service.name,
          activeDurations,
        };
      });
  }

  return [];
}
export default function InstructorSuburbs() {
  const {user} = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSuburb, setNewSuburb] = useState({name: "", zone: "South"});
  const [isAdding, setIsAdding] = useState(false);
  const [packageDraft, setPackageDraft] = useState(null);
  const {
    data: suburbs = [],
    isLoading: isSuburbsLocations,
    refetch: refetchLocations,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations?isSort=true");
      return res.data;
    },
  });

  const {data: instructorData = {}, isLoading: isInstructorLoading, refetch: refetchInstructor,} = useQuery({
    queryKey: ["instructor", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  const [suburbsData, setSuburbsData] = useState([]);
  const [selectedSuburb, setSelectedSuburb] = useState(null);
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isUpdatingPackages, setIsUpdatingPackages] = useState(false);
  const ALL_DAYS = dayShort.map((d) => d.label);

const openManagePackagesModal = (suburb) => {
  setSelectedSuburb(suburb);
  setPackageDraft({
    name: suburb.name,
    packages: JSON.parse(JSON.stringify(suburb.packages || [])),
  });
};



const toggleDraftPackageDuration = (serviceName, durationIdx) => {
  setPackageDraft((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      packages: prev.packages.map((pkg) => {
        if (pkg.serviceName !== serviceName) return pkg;

        const updated = [...pkg.activeDurations];
        updated[durationIdx] = !updated[durationIdx];

        return {
          ...pkg,
          activeDurations: updated,
        };
      }),
    };
  });
};

const applyPackageChanges = async () => {
  if (!selectedSuburb || !packageDraft || !user?.email) return;

  try {
    setIsUpdatingPackages(true);

    const updatedSuburbs = suburbsData.map((suburb) =>
      suburb.name === selectedSuburb.name
        ? {
            ...suburb,
            packages: packageDraft.packages,
          }
        : suburb
    );

    const activeSuburbs = updatedSuburbs
      .filter((s) => s.active)
      .map((s) => ({
        name: s.name,
        availableDays: s.availableDays,
        packages: (s.packages || []).map((pkg) => ({
  serviceName: pkg.serviceName,
  activeDurations: (pkg.activeDurations || []).map(Boolean),
})),
      }));

   await axios.patch("/api/instructors", {
  email: user.email,
  suburbs: activeSuburbs,
});

await refetchInstructor();
setSuburbsData(updatedSuburbs);
setSelectedSuburb(null);
setPackageDraft(null);

toast.success("Packages updated successfully!");
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to update package settings"
    );
  } finally {
    setIsUpdatingPackages(false);
  }
};
const closePackagesModal = () => {
  setSelectedSuburb(null);
  setPackageDraft(null);
};
  // Initialize suburbsData after fetching
 useEffect(() => {
  if (
    !isSuburbsLocations &&
    !isInstructorLoading &&
    suburbs.length &&
    !suburbsData.length
  ) {
    const initialSuburbs = suburbs.map((loc) => {
      const name = loc.name;
      const suburbData = instructorData.suburbs?.find((s) => s.name === name);

      return {
        name,
        active: suburbData ? suburbData.availableDays.length > 0 : false,
        availableDays: suburbData
          ? [...suburbData.availableDays]
          : [...ALL_DAYS],
       packages:
  suburbData?.packages?.length > 0
    ? suburbData.packages.map((p) => ({
        serviceName: p.serviceName,
        activeDurations: durationsOrder.map((_, i) => !!p.activeDurations?.[i]),
      }))
    : buildDefaultSuburbPackages(instructorData?.services || []),
      };
    });

    setSuburbsData(initialSuburbs);
  }
}, [
  suburbs,
  instructorData,
  isSuburbsLocations,
  isInstructorLoading,
  suburbsData.length,
  ALL_DAYS,
]);



  const toggleActiveByName = (name) => {
    setSuburbsData((prev) =>
      prev.map((s) => (s.name === name ? {...s, active: !s.active} : s)),
    );
  };

  const toggleDayByName = (name, day) => {
    setSuburbsData((prev) =>
      prev.map((s) => {
        if (s.name !== name) return s;
        const exists = s.availableDays.includes(day);
        return {
          ...s,
          availableDays: exists
            ? s.availableDays.filter((d) => d !== day)
            : [...s.availableDays, day],
        };
      }),
    );
  };

  const handleAddSuburb = async () => {
    const name = newSuburb.name.trim();
    const zone = newSuburb.zone?.trim();

    if (!name) return toast.error("Suburb name is required");
    if (!zone) return toast.error("Zone is required");

    try {
      setIsAdding(true);

      const res = await axios.post("/api/locations", {name, zone});

      toast.success("Suburb added!");
      setIsAddOpen(false);
      setNewSuburb({name: "", zone: "South"});

      // refresh locations list
      await refetchLocations();

      // also push into local table instantly
      setSuburbsData((prev) => {
        const exists = prev.some(
          (s) => s.name.toLowerCase() === name.toLowerCase(),
        );
        if (exists) return prev;
       return [
  ...prev,
  {
    name,
    active: true,
    availableDays: [...ALL_DAYS],
    packages: buildDefaultSuburbPackages(instructorData?.services || []),
  },
];
      });
    } catch (err) {
  
      toast.error(err?.response?.data?.message || "Failed to add suburb");
    } finally {
      setIsAdding(false);
    }
  };

 const handleSave = async () => {
  try {
    const activeSuburbs = suburbsData
      .filter((s) => s.active)
      .map((s) => ({
        name: s.name,
        availableDays: s.availableDays,
       packages: (s.packages || []).map((pkg) => ({
  serviceName: pkg.serviceName,
  activeDurations: pkg.activeDurations.map(Boolean),
})),
      }));

    await axios.patch("/api/instructors", {
      email: user.email,
      suburbs: activeSuburbs,
    });

    toast.success("Suburbs availability updated successfully!");
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to update suburbs availability"
    );
  }
};

  // Filtered view
  const filteredSuburbs = suburbsData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesActive = showActiveOnly ? s.active : true;
    return matchesSearch && matchesActive;
  });

  if (isInstructorLoading || isSuburbsLocations) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
        <div className="sticky top-18.5 md:top-0 z-30 bg-white border-b border-gray-200 py-3 flex justify-between items-center px-2">
          <h1 className="text-lg md:text-3xl font-bold">Manage Suburbs Availability</h1>

          <div className="flex gap-2">
            <PrimaryBtn
              onClick={() => setIsAddOpen(true)}
              className="justify-center text-xs! md:text-base px-2! md:px-4! "
            >
              <FaPlus className="hidden md:block"/> Add Suburb
            </PrimaryBtn>

            <PrimaryBtn
              onClick={handleSave}
              className="justify-center text-xs! md:text-base px-2! md:px-4! "
            >
              Update All
            </PrimaryBtn>
          </div>
        </div>

      <div className="mt-4 flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />
          Active Only
        </label>
        <input
          type="text"
          placeholder="Search suburb..."
          className="flex-1 p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-auto md:w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-2 md:px-4 text-left text-xs font-medium uppercase">
                  Active
                </th>
                <th className="py-3 px-2 md:px-4 text-left text-xs font-medium uppercase">
                  Suburb
                </th>
                <th className="py-3 px-2 md:px-4 text-left text-xs font-medium uppercase">
  Days Available
</th>
<th className="py-3 px-2 md:px-4 text-left text-xs font-medium uppercase">
  Packages
</th>
             
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuburbs.map((suburb) => (
                <tr
                  key={suburb.name}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 md:px-4 py-4  text-center">
                    <input
                      type="checkbox"
                      checked={suburb.active}
                      onChange={() => toggleActiveByName(suburb.name)}
                    />
                  </td>

                  <td className="px-2 md:px-4 py-4 text-xs md:text-base font-medium">{suburb.name}</td>

                  <td className="px-2 md:px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {dayShort.map((day) => (
                        <span
                          key={day.key}
                          onClick={() =>
                            toggleDayByName(suburb.name, day.label)
                          }
                          className={`cursor-pointer px-2 md:px-4  py-1 rounded text-xs font-semibold ${
                            suburb.availableDays.includes(day.label)
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {day.label}
                        </span>
                      ))}
                    </div>
                  </td>
<td className="px-2 md:px-4 py-4 align-top">
  {suburb.active ? (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-500">
       {(suburb.packages || []).filter((p) => p.activeDurations?.some(Boolean)).length} package(s) selected
      </span>

      <PrimaryBtn
        onClick={() => openManagePackagesModal(suburb)}
        className="justify-center text-xs! md:text-sm px-3! py-2!"
      >
        Packages
      </PrimaryBtn>
    </div>
  ) : (
    <span className="text-xs text-gray-400">Activate suburb first</span>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     {selectedSuburb && (
<Modal onClose={closePackagesModal}>
   <div className="max-h-[80vh] overflow-y-auto">
  <div className="space-y-4">
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 pb-3 pt-1">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="text-xl font-bold">
        Manage Packages - {selectedSuburb.name}
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Enable packages and durations for this suburb.
      </p>
    </div>

   <PrimaryBtn
  className="justify-center px-3! py-2! text-xs! md:text-sm hover:scale-100!"
  onClick={applyPackageChanges}
  disabled={isUpdatingPackages}
>
  {isUpdatingPackages ? "Updating..." : "Update"}
</PrimaryBtn>
  </div>
</div>

      <div className="space-y-3">
  {(packageDraft?.packages || []).length > 0 ? (
  packageDraft.packages.map((pkg) => (
            <div
              key={pkg.serviceName}
              className="border border-gray-200 rounded-lg p-3"
            >
              <div className="mb-3">
  <p className="text-sm md:text-base font-semibold">
    {pkg.serviceName}
  </p>
</div>

              <div className="flex flex-wrap gap-2">
  {durationsOrder.map((duration, idx) => {
    const instructorService = instructorData?.services?.find(
      (s) => s.name === pkg.serviceName
    );

    const price = instructorService?.prices?.[idx];
    const hasPrice = price != null;

    if (!hasPrice) return null;

    return (
      <button
  type="button"
  key={duration.minutes}
  onClick={() => toggleDraftPackageDuration(pkg.serviceName, idx)}
  className={`px-2 py-2 rounded text-xs font-semibold border leading-tight ${
    pkg.activeDurations?.[idx]
      ? "bg-primary text-white border-primary"
      : "bg-gray-100 text-gray-600 border-gray-300"
  }`}
>
        <div className="flex flex-col items-center">
          <span>{duration.label}</span>
          <span className="text-[11px] font-bold">
            ${price}
          </span>
        </div>
      </button>
    );
  })}
</div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">
            No packages available for this instructor.
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2 gap-2">
          <PrimaryBtn className={`hover:scale-100!`} onClick={closePackagesModal} disabled={isUpdatingPackages}>
            Cancel
          </PrimaryBtn>
          <PrimaryBtn className={`hover:scale-100!`} onClick={applyPackageChanges} disabled={isUpdatingPackages}>
  {isUpdatingPackages ? "Updating..." : "Update"}
</PrimaryBtn>
        </div>
    </div>
  </div>
  </Modal>
)}
      {isAddOpen && (
        <Modal onClose={() => setIsAddOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add New Suburb</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Suburb Name</label>
              <input
                type="text"
                value={newSuburb.name}
                onChange={(e) =>
                  setNewSuburb((p) => ({...p, name: e.target.value}))
                }
                placeholder="e.g. Kogarah, NSW"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <select
                value={newSuburb.zone}
                onChange={(e) =>
                  setNewSuburb((p) => ({...p, zone: e.target.value}))
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <PrimaryBtn className={`hover:scale-100!`} onClick={() => setIsAddOpen(false)}>
                Cancel
              </PrimaryBtn>
              <PrimaryBtn  className={`hover:scale-100!`} onClick={handleAddSuburb} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add"}
              </PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
