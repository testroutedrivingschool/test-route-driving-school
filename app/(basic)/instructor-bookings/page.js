/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useEffect, useRef, useState} from "react";

import Container from "@/app/shared/ui/Container";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Image from "next/image";

import axios from "axios";
import Modal from "@/app/shared/ui/Modal";
import {IoMdAdd} from "react-icons/io";
import BookingCalendar from "../bookings/components/BookingCalendar";
import {useUserData} from "@/app/hooks/useUserData";
import {toast} from "react-toastify";
import {FaCalendarPlus, FaEyeSlash} from "react-icons/fa";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const times = [
  "7:00AM",
  "7:15AM",
  "7:30AM",
  "7:45AM",
  "8:00AM",
  "8:15AM",
  "8:30AM",
  "8:45AM",
  "9:00AM",
  "9:15AM",
  "9:30AM",
  "9:45AM",
  "10:00AM",
  "10:15AM",
  "10:30AM",
  "10:45AM",
  "11:00AM",
  "11:15AM",
  "11:30AM",
  "11:45AM",
  "12:00PM",
  "12:15PM",
  "12:30PM",
  "12:45PM",
  "1:00PM",
  "1:15PM",
  "1:30PM",
  "1:45PM",
  "2:00PM",
  "2:15PM",
  "2:30PM",
  "2:45PM",
  "3:00PM",
  "3:15PM",
  "3:30PM",
  "3:45PM",
  "4:00PM",
  "4:15PM",
  "4:30PM",
  "4:45PM",
  "5:00PM",
  "5:15PM",
  "5:30PM",
  "5:45PM",
  "6:00PM",
  "6:15PM",
  "6:30PM",
  "6:45PM",
  "7:00PM",
  "7:15PM",
  "7:30PM",
  "7:45PM",
  "8:00PM",
  "8:15PM",
  "8:30PM",
  "8:45PM",
  "9:00PM",
  "9:15PM",
  "9:30PM",
  "9:45PM",
  "10:00PM",
  "10:15PM",
  "10:30PM",
  "10:45PM",
  "11:00PM",
  "11:15PM",
  "11:30PM",
  "11:45PM",
];

export default function InstructorBookings() {
  const {data: user} = useUserData();
  const {data: instructor} = useQuery({
    queryKey: ["instructor", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${user.email}`);
      return res.data;
    },
  });
  console.log(instructor);
  const tableRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [showMoreTimes, setShowMoreTimes] = useState(false);


 

  const visibleTimes = showMoreTimes
    ? times
    : times.slice(0, times.indexOf("10:30PM") + 1);

  const [slotForm, setSlotForm] = useState({
    length: "15 mins",
    visibility: "public",
    privateNote: "",
    publicNote: "",
    allSuburbs: true,
    bulkAction: "",
    reuseSettings: false,
  });
const formatDate = (d) => {
  const date = new Date(d);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`; // local YYYY-MM-DD
};


  const openSlotModal = ({date, time}) => {
    const dateKey = formatDate(date);
    const key = `${dateKey}__${time}`;
    const existing = slotMap[key];

    setSelectedSlot({
      date,
      time,
      staff: instructor?.name || "Staff",
      location: "Sydney",
    });

    // if already scheduled previously, load it into form
    if (existing) {
      setSlotForm((p) => ({
        ...p,
        length: existing.duration || "15 mins",
        visibility: existing.visibility || "public",
        privateNote: existing.privateNote || "",
        publicNote: existing.publicNote || "",
        allSuburbs: existing.suburb === "ALL",
      }));
    } else {
      // reset to defaults for new slot
      setSlotForm((p) => ({
        ...p,
        length: "15 mins",
        visibility: "public",
        privateNote: "",
        publicNote: "",
        allSuburbs: true,
      }));
    }

    setShowSlotModal(true);
  };

  const closeSlotModal = () => {
    setShowSlotModal(false);
    setSelectedSlot(null);
  };

  // Get dates for the week of selectedDate
  const getWeekDates = (selectedDate) => {
    const dates = [];
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);

    // JS: Sun=0, Mon=1 ... Sat=6
    const day = startDate.getDay();
    const diffToMonday = (day + 6) % 7;

    // Move to Monday of that week
    startDate.setDate(startDate.getDate() - diffToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d);
    }

    return dates;
  };

  const weekDates = getWeekDates(selectedDate);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      table.classList.add("cursor-grabbing");
      startX = e.pageX - table.offsetLeft;
      scrollLeft = table.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      table.classList.remove("cursor-grabbing");
    };

    const onMouseUp = () => {
      isDown = false;
      table.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - table.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast
      table.scrollLeft = scrollLeft - walk;
    };

    table.addEventListener("mousedown", onMouseDown);
    table.addEventListener("mouseleave", onMouseLeave);
    table.addEventListener("mouseup", onMouseUp);
    table.addEventListener("mousemove", onMouseMove);

    return () => {
      table.removeEventListener("mousedown", onMouseDown);
      table.removeEventListener("mouseleave", onMouseLeave);
      table.removeEventListener("mouseup", onMouseUp);
      table.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const weekFrom = formatDate(weekDates[0]);
  const weekTo = formatDate(weekDates[6]);
  const {
    data: slots = [],
    refetch: refetchSlots,
    isLoading: slotsLoading,
  } = useQuery({
    queryKey: ["instructorSlots", instructor?._id, weekFrom, weekTo],
    enabled: !!instructor?._id,
    queryFn: async () => {
      const res = await axios.get(
        `/api/instructor-slots?instructorId=${instructor._id}&from=${weekFrom}&to=${weekTo}`,
      );
      return res.data;
    },
  });

  // quick lookup map: key = "YYYY-MM-DD__7:15AM"
  const slotMap = slots.reduce((acc, s) => {
    acc[`${s.date}__${s.time}`] = s;
    return acc;
  }, {});

 const STEP_MIN = 15;

const durationToMinutes = (str = "") => {
  const s = str.toLowerCase().replace(/\s+/g, " ").trim();

  // examples: "15 mins", "1 hour", "1 hour 15 mins", "2 hours", "2 hour 15 mins"
  const hourMatch = s.match(/(\d+)\s*hour/);
  const minMatch = s.match(/(\d+)\s*min/);

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const mins = minMatch ? parseInt(minMatch[1], 10) : 0;

  // if only "45 mins" -> hours=0 mins=45
  return hours * 60 + mins;
};

// index of each time for quick lookup
const timeIndexMap = times.reduce((acc, t, i) => {
  acc[t] = i;
  return acc;
}, {});

// coverage[dateKey][time] = { skip: true }  OR { rowSpan: n } on start
const coverage = {};

const sortedSlots = [...slots].sort((a, b) => {
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  return (timeIndexMap[a.time] ?? 0) - (timeIndexMap[b.time] ?? 0);
});

for (const s of sortedSlots) {
  const dateKey = s.date;
  const startIdx = timeIndexMap[s.time];
  if (startIdx == null) continue;

  const durMin = durationToMinutes(s.duration || "15 mins");
  const span = Math.max(1, Math.ceil(durMin / STEP_MIN));

  coverage[dateKey] ??= {};

  // ✅ If this start time is already covered by an earlier slot, ignore this slot
  if (coverage[dateKey][s.time]) {
    console.warn("Overlapping slot ignored:", s);
    continue;
  }

  // mark start
  coverage[dateKey][s.time] = { rowSpan: span };

  // mark covered times to skip (but don't overwrite an existing start cell)
  for (let k = 1; k < span; k++) {
    const t = times[startIdx + k];
    if (!t) break;

    if (!coverage[dateKey][t]) {
      coverage[dateKey][t] = { skip: true };
    } else {
      // another slot already starts here -> overlap conflict
      console.warn("Overlap conflict at", dateKey, t);
    }
  }
}


const parseBulkMinutes = (bulkAction) => {
  if (!bulkAction) return 0;
  if (bulkAction === "restOfDay") return -1;
  const [type, val] = bulkAction.split(":");
  if (type === "next") return parseInt(val, 10) || 0;
  return 0;
};

const getTimeRangeFrom = (startTime, totalMinutes) => {
  const startIdx = timeIndexMap[startTime];
  if (startIdx == null) return [];

  const steps = Math.max(1, Math.ceil(totalMinutes / STEP_MIN));
  return times.slice(startIdx, startIdx + steps);
};


const getRestOfDayRange = (startTime) => {
  const startIdx = timeIndexMap[startTime];
  if (startIdx == null) return [];
  return times.slice(startIdx); // from start time to end
};



  const handleSchedule = async () => {
  try {
    if (!instructor?._id || !selectedSlot?.date || !selectedSlot?.time) return;

    if (slotForm.visibility === "publicNote" && !slotForm.publicNote.trim()) {
      return toast.error("Public Note is required for Public note only.");
    }
const hasConflict = blockTimes.some((t) => slotMap[`${dateStr}__${t}`] && t !== selectedSlot.time);
if (hasConflict) {
  return toast.error("Conflict: Another slot already exists inside this duration.");
}

    const dateStr = formatDate(selectedSlot.date);

    const bulkMinutes = parseBulkMinutes(slotForm.bulkAction);

    // Build list of times to update
    let targetTimes = [];
    if (bulkMinutes > 0) {
      targetTimes = getTimeRangeFrom(selectedSlot.time, bulkMinutes);
    } else if (bulkMinutes === -1) {
      targetTimes = getRestOfDayRange(selectedSlot.time);
    } else {
      targetTimes = [selectedSlot.time]; // normal single slot
    }

    if (!targetTimes.length) return;

    // duration of the "block" should come from slotForm.length
    const blockMinutes = durationToMinutes(slotForm.length);
    const blockSteps = Math.max(1, Math.ceil(blockMinutes / STEP_MIN));

    // If bulk action is selected, you probably want to apply the block duration
    // from the start time, and only cover the next X of the "block".
    // Example: length=1 hour => cover 4 slots.
    const blockTimes = targetTimes.slice(0, blockSteps);

    // Build requests:
    // - first slot = duration = slotForm.length
    // - covered slots after first = duration = "15 mins" but mark them as "privateBooked/hidden" etc
    const requests = blockTimes.map((t, idx) => {
      const payload = {
        instructorId: instructor._id,
        date: dateStr,
        time: t,
        duration: idx === 0 ? slotForm.length : "15 mins",
        visibility: slotForm.visibility,
        privateNote: slotForm.privateNote,
        publicNote: slotForm.publicNote,
        suburb: slotForm.allSuburbs ? "ALL" : "ALL",
      };

      return axios.put("/api/instructor-slots", payload);
    });

    await Promise.all(requests);

    toast.success("Bulk slots updated ✅");
    closeSlotModal();
    await refetchSlots();
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};


  if (slotsLoading) return <LoadingSpinner />;

  return (
    <>
      <section className="py-10">
        <Container>
          <div>
            {/* Main Content Area */}

            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
              {/* Left Column - Calendar */}
              <div className="lg:col-span-2">
                <BookingCalendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>

              {/* Right Column - Schedule Table */}
              <div className="lg:col-span-7 ">
                <div className="rounded-xl shadow-sm border border-border-color overflow-hidden ">
                  <div className="">
                    {/* Schedule Header */}
                    <div className="sticky top-0 z-50 px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                            {user?.name}&apos;s Schedule
                          </h2>
                          <p className="text-gray-600 mt-1">
                            Week of{" "}
                            {weekDates[0].toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {weekDates[6].toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Table */}
                    <div
                      ref={tableRef}
                      className="overflow-x-auto overflow-y-auto touch-pan-x select-none scrollbar-hide"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        cursor: "grab",
                        touchAction: "pan-x",
                        maxHeight: "calc(100vh - 88px)",
                      }}
                    >
                      <table className="w-full min-w-150 md:min-w-[700px] border-separate border-spacing-0 table-fixed h-full">
                        <thead className="bg-white">
                          <tr>
                            <th className="py-2 px-1 border border-border-color  text-xs md:text-sm font-medium uppercase tracking-wider sticky top-0 left-0 bg-[#DCDCDC] z-50 text-center">
                              Time
                            </th>

                            {weekDates.map((date, index) => (
                              <th
                                key={index}
                                className="py-2 px-2 border border-border-color text-center text-xs md:text-sm font-medium text-gray-500 md:uppercase md:tracking-wider sticky top-0 z-20 bg-white"
                              >
                                <div className="flex flex-col items-center">
                                  <div className="font-bold text-gray-900 wrap-break-word">
                                    {weekdays[index]}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {date.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                          {visibleTimes.map((time) => (
                            <tr
                              key={time}
                              className="hover:bg-gray-50/50 align-stretch"
                            >
                              <td className="py-2 px-1 whitespace-nowrap text-xs md:text-sm  font-medium text-gray-900 sticky left-0 bg-[#DCDCDC] z-10 text-center ">
                                {time}
                              </td>
                              {weekDates.map((date, dayIndex) => {
  const dateKey = formatDate(date);
  const key = `${dateKey}__${time}`;
  const slot = slotMap[key];

  const cov = coverage?.[dateKey]?.[time];
  if (cov?.skip) return null; // ✅ this is what makes it collapse

  const rowSpan = cov?.rowSpan || 1;
  const visibility = slot?.visibility || "public";

  return (
    <td
      key={dayIndex}
      rowSpan={rowSpan}                 // ✅ merged height
      className="p-0 align-stretch"
    >
      {/* IMPORTANT: button must fill the cell */}
      {visibility === "hidden" ? (
        <button
          onClick={() => openSlotModal({ date, time })}
          className="w-full h-full min-h-11 bg-[#d3d3d3] hover:bg-[#E7E7E7] border border-border-color px-5 py-2 flex flex-col items-center justify-center gap-2"
        >
          <FaEyeSlash className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs text-center">{slot?.privateNote}</span>
          <IoMdAdd className="h-5 w-5 text-primary shrink-0" />
        </button>
      ) : visibility === "privateBooked" ? (
        <button
          onClick={() => openSlotModal({ date, time })}
          className="w-full h-full min-h-11 text-xs font-semibold bg-[#8d8d8d] hover:bg-[#B2B2B2] border border-red-100 px-2 py-2 flex items-center justify-between gap-2"
        >
          <FaCalendarPlus className="h-4 w-4 text-white shrink-0" />
          <span className="flex-1 text-left text-white whitespace-normal break-words leading-snug">
            {slot?.privateNote}
          </span>
          <IoMdAdd className="h-5 w-5 text-white shrink-0" />
        </button>
      ) : visibility === "publicNote" ? (
        <button
          onClick={() => openSlotModal({ date, time })}
          className="w-full h-full min-h-11 bg-gray-100 text-primary border border-border-color hover:bg-[#B2B2B2] px-2 py-2 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-xs text-center whitespace-normal break-words leading-snug">
            {slot?.publicNote}
          </span>
          <IoMdAdd className="h-5 w-5 text-primary shrink-0" />
        </button>
      ) : (
        <button
          onClick={() => openSlotModal({ date, time })}
          className="w-full h-full min-h-11 bg-[#7DA730] hover:bg-[#96C83A] border border-dashed border-border-color flex items-center justify-center gap-2 text-xs font-semibold text-white"
        >
          <span>Available</span>
          <IoMdAdd className="h-4 w-4" />
        </button>
      )}
    </td>
  );
})}

                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="sticky bottom-0 left-0 right-0 bg-white z-50">
                        <div className="flex  items-center  justify-between">
                          {!showMoreTimes ? (
                            <button
                              onClick={() => setShowMoreTimes(true)}
                              className="text-primary font-semibold hover:underline ml-4  "
                            >
                              More
                            </button>
                          ) : (
                            <button
                              onClick={() => setShowMoreTimes(false)}
                              className="text-primary font-semibold hover:underline ml-4 "
                            >
                              Less
                            </button>
                          )}
                          {weekDates.map((date, index) => (
                            <div
                              key={index}
                              className="py-2    text-center text-sm font-medium text-gray-500 uppercase tracking-wider "
                            >
                              <div className="flex flex-col items-center">
                                <div className="font-bold text-gray-900">
                                  {weekdays[index]}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {showSlotModal && selectedSlot && (
        <Modal onClose={closeSlotModal}>
          <div className="w-full max-w-3xl">
            {/* Top info */}
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1 text-base text-gray-800">
                <div>
                  <span className="font-bold">Date:</span>{" "}
                  {formatDate(selectedSlot.date)}
                </div>
                <div>
                  <span className="font-bold">Time:</span> {selectedSlot.time}
                </div>
                <div>
                  <span className="font-bold">Staff:</span> {selectedSlot.staff}
                </div>
                <div>
                  <span className="font-bold">Location:</span>{" "}
                  {selectedSlot.location}
                </div>
              </div>
            </div>

            <hr className="my-5" />

            {/* Length */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Length:</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {[
                  "15 mins",
                  "30 mins",
                  "45 mins",
                  "1 hour",
                  "1 hour 15 mins",
                  "1 hour 30 mins",
                  "1 hour 45 mins",
                  "2 hours",
                  "2 hour  15 mins",
                ].map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="length"
                      checked={slotForm.length === opt}
                      onChange={() => setSlotForm((p) => ({...p, length: opt}))}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Visibility:</h4>

              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    checked={slotForm.visibility === "public"}
                    onChange={() =>
                      setSlotForm((p) => ({
                        ...p,
                        visibility: "public",
                        publicNote: "",
                      }))
                    }
                  />
                  <span>Publicly Available to book</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    checked={slotForm.visibility === "privateBooked"}
                    onChange={() =>
                      setSlotForm((p) => ({...p, visibility: "privateBooked"}))
                    }
                  />
                  <span>Privately Available, shown as booked</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    checked={slotForm.visibility === "hidden"}
                    onChange={() =>
                      setSlotForm((p) => ({...p, visibility: "hidden"}))
                    }
                  />
                  <span>Hidden note or booking. Hidden from clients</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    checked={slotForm.visibility === "publicNote"}
                    onChange={() =>
                      setSlotForm((p) => ({...p, visibility: "publicNote"}))
                    }
                  />
                  <span>Public note only</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Private Note:
                </label>
                <input
                  value={slotForm.privateNote}
                  onChange={(e) =>
                    setSlotForm((p) => ({...p, privateNote: e.target.value}))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Public Note:
                </label>
                <textarea
                  value={slotForm.publicNote}
                  onChange={(e) =>
                    setSlotForm((p) => ({...p, publicNote: e.target.value}))
                  }
                  required={slotForm.visibility === "publicNote"}
                  disabled={slotForm.visibility !== "publicNote"}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 min-h-20
    ${
      slotForm.visibility === "publicNote"
        ? "focus:ring-primary/30"
        : "bg-gray-100 cursor-not-allowed"
    }`}
                  placeholder={
                    slotForm.visibility === "publicNote"
                      ? "Write a public note..."
                      : ""
                  }
                />
              </div>
            </div>

            {/* Suburbs */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Suburbs:</h4>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slotForm.allSuburbs}
                  onChange={(e) =>
                    setSlotForm((p) => ({...p, allSuburbs: e.target.checked}))
                  }
                />
                <span>Available in all Suburbs</span>
              </label>
            </div>

            {/* Bulk Action */}
            <div className="mb-6">
  <h4 className="font-semibold text-gray-900 mb-2">Bulk Action:</h4>

  <select
    value={slotForm.bulkAction}
    onChange={(e) =>
      setSlotForm((p) => ({ ...p, bulkAction: e.target.value }))
    }
    className="w-full border border-gray-300 rounded-lg px-3 py-2"
  >
    <option value="">Select Time Frame</option>

    {/* Next X minutes/hours */}
    {[
      30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180,
      240, 300, 360, 420, 480,
    ].map((mins) => {
      const isHours = mins >= 60;
      const hours = mins / 60;

      const label = isHours
        ? `Next ${Number.isInteger(hours) ? hours : hours} Hours`
        : `Next ${mins} Minutes`;



      return (
        <option key={mins} value={`next:${mins}`}>
          {label}
        </option>
      );
    })}

    <option value="restOfDay">Rest of Day</option>
  </select>
</div>

            {/* Reuse */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slotForm.reuseSettings}
                  onChange={(e) =>
                    setSlotForm((p) => ({
                      ...p,
                      reuseSettings: e.target.checked,
                    }))
                  }
                />
                <span>Reuse these selected settings and skip this screen.</span>
              </label>
            </div>

            {/* Footer button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  handleSchedule();
                }}
                className="bg-primary hover:bg-primary text-white font-semibold px-6 py-3 rounded-lg"
              >
                Schedule
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
