"use client";
import {useEffect, useRef, useState} from "react";

import Container from "@/app/shared/ui/Container";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";

import axios from "axios";
import Modal from "@/app/shared/ui/Modal";
import {IoMdAdd} from "react-icons/io";
import BookingCalendar from "../bookings/components/BookingCalendar";
import {useUserData} from "@/app/hooks/useUserData";
import {toast} from "react-toastify";
import {
  FaCalendarPlus,
  FaChevronLeft,
  FaChevronRight,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";
import {useRouter, useSearchParams} from "next/navigation";
import Swal from "sweetalert2";
import {TbCopyPlusFilled} from "react-icons/tb";

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
  const router = useRouter();
  const {data: user} = useUserData();
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [selectedCopyWeeks, setSelectedCopyWeeks] = useState([]);
  const [sendingSummary, setSendingSummary] = useState(false);
  const [clearWeekLoading, setClearWeekLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copyOptions, setCopyOptions] = useState({
    copyBookingsIfFree: false,
    deleteBookingsWhenClearing: false,
  });
  const {data: instructor} = useQuery({
    queryKey: ["instructor", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${user.email}`);
      return res.data;
    },
  });
  const searchParams = useSearchParams();
  const moveBookingId = searchParams.get("moveBookingId"); // string | null
  const moveMode = !!moveBookingId;
  const rebookClientId = searchParams.get("rebookClientId");
  const rebookMode = !!rebookClientId;

  const {data: rebookClient} = useQuery({
    queryKey: ["client", rebookClientId],
    enabled: !!rebookClientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${rebookClientId}`);
      return res.data;
    },
  });
  const tableRef = useRef(null);
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [moving, setMoving] = useState(false);
  const [showMoreTimes, setShowMoreTimes] = useState(false);
  const [suburbSearch, setSuburbSearch] = useState("");
  const [selectedSuburbs, setSelectedSuburbs] = useState([]);

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
  const LENGTH_OPTIONS = [
    "15 mins",
    "30 mins",
    "45 mins",
    "1 hour",
    "1 hour 15 mins",
    "1 hour 30 mins",
    "1 hour 45 mins",
    "2 hours",
    "2 hours 15 mins",
  ];
  const isHourStart = (time) => time?.includes(":00");

  const {data: movingBooking} = useQuery({
    queryKey: ["booking", moveBookingId],
    enabled: !!moveBookingId,
    queryFn: async () => {
      const res = await axios.get(`/api/bookings/${moveBookingId}`);
      return res.data;
    },
  });
  const canSwapWith = (movingBooking, slotBooking) => {
    if (!movingBooking || !slotBooking) return false;
    if (String(movingBooking._id) === String(slotBooking._id)) return false;

    const movingMinutes = Number(movingBooking.minutes || 0);
    const slotMinutes = Number(slotBooking.minutes || 0);

    if (!movingMinutes || !slotMinutes) return false;
    if (movingMinutes !== slotMinutes) return false;

    const blocked = new Set(["completed", "cancelled"]);
    if (blocked.has(String(slotBooking.status || "").toLowerCase()))
      return false;

    const movingDateStr = formatDate(
      movingBooking.bookingDate || movingBooking.date,
    );
    const movingTime = movingBooking.bookingTime || movingBooking.time;

    const targetDateStr = formatDate(
      slotBooking.bookingDate || slotBooking.date,
    );
    const targetTime = slotBooking.bookingTime || slotBooking.time;

    if (isPastSlotDateTime(movingDateStr, movingTime)) return false;
    if (isPastSlotDateTime(targetDateStr, targetTime)) return false;

    return true;
  };

  const shouldShowMovingBlock = (dateStr, time) => {
    if (!moveMode || !movingBooking) return false;
    return canMoveToAvailableRange(dateStr, time);
  };

  const getMaxContinuousAvailableMinutes = (dateStr, startTime) => {
    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) return 0;

    let totalMinutes = 0;

    for (let i = startIdx; i < times.length; i++) {
      const t = times[i];
      if (!t) break;

      const bookingCell = bookingCoverage?.[dateStr]?.[t];
      if (bookingCell?.booking || bookingCell?.skip) break;

      const slot = slotMap[`${dateStr}__${t}`];
      if (!slot) break;

      // for manual booking, all saved slot types should behave same
      const vis = slot.visibility || "";
      const allowed =
        vis === "public" ||
        vis === "hidden" ||
        vis === "privateBooked" ||
        vis === "publicNote";

      if (!allowed) break;

      totalMinutes += STEP_MIN;
    }

    return totalMinutes;
  };
  const formatDate = (d) => {
    const date = new Date(d);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
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

    const dateStr = formatDate(date);
    const maxMins = getMaxEmptyExtendMinutes(dateStr, time);
    const defaultLen = "15 mins";
    if (existing) {
      const isAll = existing.suburb === "ALL";

      const current = existing?.duration || "15 mins";
      const safe = durationToMinutes(current) <= maxMins ? current : "15 mins";

      setSlotForm((p) => ({
        ...p,
        length: safe,
        visibility: existing.visibility || "public",
        privateNote: existing.privateNote || "",
        publicNote: existing.publicNote || "",
        allSuburbs: isAll,
        bulkAction: "",
        reuseSettings: false,
      }));

      setSelectedSuburbs(Array.isArray(existing.suburb) ? existing.suburb : []);
    } else {
      setSlotForm((p) => ({
        ...p,
        length: defaultLen,
        visibility: "public",
        privateNote: "",
        publicNote: "",
        allSuburbs: true,
        bulkAction: "",
        reuseSettings: false,
      }));

      setSelectedSuburbs([]);
    }

    setShowSlotModal(true);
  };

  const closeSlotModal = () => {
    setShowSlotModal(false);
    setSelectedSlot(null);
  };

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const goPrevWeek = () => setSelectedDate((d) => addDays(d, -7));
  const goNextWeek = () => setSelectedDate((d) => addDays(d, 7));

  // Get dates for the week of selectedDate
  const getWeekDates = (selectedDate) => {
    const dates = [];
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);

    // JS: Sun=0..Sat=6  -> Monday start
    const day = startDate.getDay();
    const diffToMonday = (day + 6) % 7;

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

  const {data: bookings = [], isLoading: bookingsLoading} = useQuery({
    queryKey: ["bookings", user?.email, weekFrom, weekTo],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get("/api/bookings", {
        params: {
          email: user.email,
          from: weekFrom,
          to: weekTo,
        },
      });

      // ✅ only bookings of this instructor
      return (res.data || []).filter(
        (b) =>
          (b.instructorEmail || "").toLowerCase() ===
          (user.email || "").toLowerCase(),
      );
    },
  });

  // quick lookup map: key = "YYYY-MM-DD__7:15AM"
  const slotMap = slots.reduce((acc, s) => {
    acc[`${s.date}__${s.time}`] = s;
    return acc;
  }, {});
  const selectedKey = selectedSlot
    ? `${formatDate(selectedSlot.date)}__${selectedSlot.time}`
    : "";

  const existingSlot = selectedKey ? slotMap[selectedKey] : null;

  // ✅ show Remove if there is any saved slot in DB (public/private/hidden/etc)
  const shouldShowRemove = !!existingSlot;

  const STEP_MIN = 15;

  const toMinutes = (b) => {
    if (typeof b?.minutes === "number") return b.minutes;
    // fallback parse from "1hr 30m"
    const s = (b?.duration || "").toLowerCase();
    const hr = s.match(/(\d+)\s*h/);
    const mn = s.match(/(\d+)\s*m/);
    const hours = hr ? parseInt(hr[1], 10) : 0;
    const mins = mn ? parseInt(mn[1], 10) : 0;
    return hours * 60 + mins || 15;
  };

  // your timeIndexMap already exists
  // your formatDate already exists
  const timeIndexMap = times.reduce((acc, t, i) => {
    acc[t] = i;
    return acc;
  }, {});

  const bookingCoverage = {};
  const bookingsSorted = [...bookings].sort((a, b) => {
    const da = formatDate(a.bookingDate || a.date);
    const db = formatDate(b.bookingDate || b.date);
    if (da !== db) return da.localeCompare(db);
    return (
      (timeIndexMap[a.bookingTime || a.time] ?? 0) -
      (timeIndexMap[b.bookingTime || b.time] ?? 0)
    );
  });

  for (const b of bookingsSorted) {
    const dateKey = formatDate(b.bookingDate || b.date);
    const startTime = b.bookingTime || b.time;
    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) continue;

    const mins = toMinutes(b);
    const span = Math.max(1, Math.ceil(mins / STEP_MIN));

    bookingCoverage[dateKey] ??= {};

    // if something already starts here, skip (or handle conflict)
    if (bookingCoverage[dateKey][startTime]) continue;

    bookingCoverage[dateKey][startTime] = {rowSpan: span, booking: b};

    for (let k = 1; k < span; k++) {
      const t = times[startIdx + k];
      if (!t) break;
      if (!bookingCoverage[dateKey][t])
        bookingCoverage[dateKey][t] = {skip: true};
    }
  }

  const isStopSlot = (slot) => {
    // stop if empty OR public (available-to-book)
    if (!slot) return true;
    return slot.visibility === "public";
  };

  const getMaxExtendMinutes = (dateStr, startTime) => {
    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) return STEP_MIN;

    let steps = 1; // at least 15 mins
    for (let i = startIdx + 1; i < times.length; i++) {
      const t = times[i];
      const nextSlot = slotMap[`${dateStr}__${t}`];

      if (isStopSlot(nextSlot)) break; // hit public OR empty → stop
      steps += 1; // can extend through hidden/privateBooked/publicNote
    }

    return steps * STEP_MIN; // minutes
  };

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

  const isSlotBusy = (dateStr, time) => {
    // If any slot exists in DB at this time => NOT empty
    return !!slotMap[`${dateStr}__${time}`];
  };

  const getBookingDateStr = (b) => formatDate(b.bookingDate || b.date);
  const getBookingTime = (b) => b.bookingTime || b.time;

  const bookingStartMap = {}; // key => booking (only at start time)

  const sortedBookings = [...bookings].sort((a, b) => {
    const da = getBookingDateStr(a);
    const db = getBookingDateStr(b);
    if (da !== db) return da.localeCompare(db);
    return (
      (timeIndexMap[getBookingTime(a)] ?? 0) -
      (timeIndexMap[getBookingTime(b)] ?? 0)
    );
  });

  for (const b of sortedBookings) {
    const dateKey = getBookingDateStr(b);
    const time = getBookingTime(b);
    const startIdx = timeIndexMap[time];
    if (startIdx == null) continue;

    const durMin = durationToMinutes(b.duration || "15 mins");
    const span = Math.max(1, Math.ceil(durMin / STEP_MIN));

    bookingCoverage[dateKey] ??= {};

    // ignore overlap (optional)
    if (bookingCoverage[dateKey][time]) continue;

    bookingCoverage[dateKey][time] = {rowSpan: span};
    bookingStartMap[`${dateKey}__${time}`] = b;

    for (let k = 1; k < span; k++) {
      const t = times[startIdx + k];
      if (!t) break;
      if (!bookingCoverage[dateKey][t])
        bookingCoverage[dateKey][t] = {skip: true};
    }
  }

  // how many minutes we can extend while NEXT slots are empty
  const getMaxEmptyExtendMinutes = (dateStr, startTime) => {
    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) return 15;

    let steps = 1; // at least the clicked slot itself (15 mins)

    // check next times one by one until we hit a busy slot
    for (let i = startIdx + 1; i < times.length; i++) {
      const t = times[i];
      if (!t) break;

      if (isSlotBusy(dateStr, t)) break; // stop at first non-empty slot
      steps++;
    }

    return steps * STEP_MIN; // STEP_MIN = 15
  };

  const dateStrForModal = selectedSlot?.date
    ? formatDate(selectedSlot.date)
    : "";

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
    coverage[dateKey][s.time] = {rowSpan: span};

    // mark covered times to skip (but don't overwrite an existing start cell)
    for (let k = 1; k < span; k++) {
      const t = times[startIdx + k];
      if (!t) break;

      if (!coverage[dateKey][t]) {
        coverage[dateKey][t] = {skip: true};
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

  const getBlockTimes = (startTime, lengthStr) => {
    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) return [];

    const mins = durationToMinutes(lengthStr);
    const steps = Math.max(1, Math.ceil(mins / STEP_MIN));
    return times.slice(startIdx, startIdx + steps);
  };

  const modalDateStr = selectedSlot ? formatDate(selectedSlot.date) : "";
  const modalMaxMins = selectedSlot
    ? existingSlot
      ? getMaxExtendMinutes(modalDateStr, selectedSlot.time) // your existing logic for non-empty edits
      : getMaxEmptyExtendMinutes(modalDateStr, selectedSlot.time) // ✅ empty logic
    : 15;

  const allowedLengths = LENGTH_OPTIONS.filter(
    (opt) => durationToMinutes(opt) <= modalMaxMins,
  );

  const isCreatedToday = (value) => {
    if (!value) return false;

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return false;

    const now = new Date();

    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const startOfWeekMonday = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diffToMonday = (day + 6) % 7;
    d.setDate(d.getDate() - diffToMonday);
    return d;
  };

  const formatDateLong = (date) => {
    return new Date(date).toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const parseTimeTo24h = (t) => {
    const m = String(t || "")
      .trim()
      .match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
    if (!m) return null;

    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ap = m[3].toUpperCase();

    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;

    return {hh, mm};
  };

  const isPastSlotDateTime = (dateStr, time) => {
    const d = new Date(dateStr);
    const tm = parseTimeTo24h(time);

    if (Number.isNaN(d.getTime()) || !tm) return true;

    d.setHours(tm.hh, tm.mm, 0, 0);
    return d.getTime() < Date.now();
  };

  const getFutureCopyWeeks = (baseDate, count = 16) => {
    const start = startOfWeekMonday(baseDate);

    return Array.from({length: count}, (_, i) => {
      const weekOffset = i + 1;
      const d = new Date(start);
      d.setDate(d.getDate() + weekOffset * 7);

      return {
        value: weekOffset,
        label:
          weekOffset === 1
            ? `Next Week - starting ${formatDateLong(d)}`
            : `${weekOffset} Weeks - starting ${formatDateLong(d)}`,
        startDate: formatDate(d),
      };
    });
  };

  const toggleCopyWeek = (weekNo) => {
    setSelectedCopyWeeks((prev) =>
      prev.includes(weekNo)
        ? prev.filter((x) => x !== weekNo)
        : [...prev, weekNo],
    );
  };

  const handleClearWeekSchedule = async () => {
    if (!instructor?._id) return toast.error("Instructor not found");
    if (clearWeekLoading) return;

    const weekStart = formatDate(startOfWeekMonday(selectedDate));
    const weekEnd = formatDate(addDays(startOfWeekMonday(selectedDate), 6));

    const confirm = await Swal.fire({
      title: "Clear this week's schedule?",
      html: `
      <div style="text-align:left;line-height:1.7">
        <div><b>From:</b> ${weekStart}</div>
        <div><b>To:</b> ${weekEnd}</div>
        <hr/>
        <div>This will remove all availability slots for this week.</div>
        <div style="margin-top:8px;font-size:12px;opacity:.8">
          Bookings will stay unless you enabled "Delete bookings when clearing".
        </div>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear week",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      setClearWeekLoading(true);

      const res = await axios.post("/api/instructor-slots/clear-week", {
        instructorId: instructor._id,
        weekStart,
        deleteBookingsWhenClearing: copyOptions.deleteBookingsWhenClearing,
      });

      toast.success(`Week cleared }`);

      setShowCopyModal(false);
      setSelectedCopyWeeks([]);
      setCopyOptions({
        copyBookingsIfFree: false,
        deleteBookingsWhenClearing: false,
      });

      await refetchSlots();
      await queryClient.invalidateQueries({queryKey: ["bookings"]});
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to clear week");
    } finally {
      setClearWeekLoading(false);
    }
  };

  const handleCopySchedule = async () => {
    if (!instructor?._id) return toast.error("Instructor not found");
    if (!selectedCopyWeeks.length)
      return toast.error("Select at least one week");

    try {
      setCopyLoading(true);

      const fromWeekStart = formatDate(startOfWeekMonday(selectedDate));

      const res = await axios.post(
        "/api/instructor-slots/copy-weekly-schedule",
        {
          instructorId: instructor._id,
          fromWeekStart,
          targetWeeks: selectedCopyWeeks,
          copyBookingsIfFree: copyOptions.copyBookingsIfFree,
          deleteBookingsWhenClearing: copyOptions.deleteBookingsWhenClearing,
        },
      );

      const skipped = res?.data?.skippedDates || [];

      if (skipped.length) {
        toast.success(`Weekly schedule copied. Skipped some existing date(s).`);
      } else {
        toast.success("Weekly schedule copied");
      }
      setShowCopyModal(false);
      setSelectedCopyWeeks([]);
      setCopyOptions({
        copyBookingsIfFree: false,
        deleteBookingsWhenClearing: false,
      });

      await refetchSlots();
      await queryClient.invalidateQueries({queryKey: ["bookings"]});
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to copy schedule");
    } finally {
      setCopyLoading(false);
    }
  };

  const handleSendWeeklySummary = async () => {
    if (!instructor?._id) return toast.error("Instructor not found");
    if (sendingSummary) return;

    try {
      setSendingSummary(true);

      const weekStart = formatDate(startOfWeekMonday(selectedDate));

      await axios.post("/api/instructor-slots/send-weekly-summary", {
        instructorId: instructor._id,
        instructorEmail: instructor.email,
        instructorName: instructor.name,
        weekStart,
      });

      toast.success("Weekly summary sent");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send summary");
    } finally {
      setSendingSummary(false);
    }
  };

  const isAvailableSlot = (slot) => {
    return slot?.visibility === "public";
  };

  const getMovingBookingMinutes = () => {
    if (!movingBooking) return 0;
    return Number(movingBooking.minutes || toMinutes(movingBooking) || 0);
  };

  const canMoveToAvailableRange = (dateStr, startTime) => {
    if (!moveMode || !movingBooking) return false;

    // do not allow past datetime
    if (isPastSlotDateTime(dateStr, startTime)) return false;

    const neededMinutes = getMovingBookingMinutes();
    if (!neededMinutes) return false;

    const stepsNeeded = Math.ceil(neededMinutes / STEP_MIN);
    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) return false;

    for (let i = 0; i < stepsNeeded; i++) {
      const t = times[startIdx + i];
      if (!t) return false;

      // optional but safer: every covered 15-min block must also not be in past
      if (isPastSlotDateTime(dateStr, t)) return false;

      const bookingCell = bookingCoverage?.[dateStr]?.[t];
      if (bookingCell?.booking || bookingCell?.skip) return false;

      const slot = slotMap[`${dateStr}__${t}`];
      if (!isAvailableSlot(slot)) return false;
    }

    return true;
  };
  const handleSchedule = async () => {
    if (scheduleLoading) return;
    try {
      setScheduleLoading(true);
      if (!instructor?._id || !selectedSlot?.date || !selectedSlot?.time)
        return;

      if (slotForm.visibility === "publicNote" && !slotForm.publicNote.trim()) {
        return toast.error("Public Note is required for Public note only.");
      }
      if (!slotForm.allSuburbs && selectedSuburbs.length === 0) {
        return toast.error(
          "Please select at least 1 suburb or enable All Suburbs.",
        );
      }

      const dateStr = formatDate(selectedSlot.date);

      // ✅ Which times are affected by bulk action?
      const bulkMinutes = parseBulkMinutes(slotForm.bulkAction);

      let bulkRange = [];
      if (bulkMinutes > 0)
        bulkRange = getTimeRangeFrom(selectedSlot.time, bulkMinutes);
      else if (bulkMinutes === -1)
        bulkRange = getRestOfDayRange(selectedSlot.time);
      else bulkRange = [selectedSlot.time];

      // ✅ For each time in bulkRange, we will create a block START
      // and delete covered slots of that block
      const requests = bulkRange.map(async (startTime) => {
        const blockTimes = getBlockTimes(startTime, slotForm.length); // e.g. 1 hour => 4 times

        // ✅ conflict check: if another slot exists inside this block (except itself)
        const conflict = blockTimes.some((t) => {
          const k = `${dateStr}__${t}`;
          return slotMap[k] && t !== startTime;
        });
        if (conflict) {
          throw new Error(`Conflict inside ${startTime} block`);
        }

        // ✅ 1) delete covered slots (except startTime)
        const covered = blockTimes.slice(1);
        if (covered.length) {
          await axios.delete("/api/instructor-slots", {
            data: {
              instructorId: instructor._id,
              date: dateStr,
              times: covered,
            },
          });
        }

        // ✅ 2) upsert only the start slot with long duration
        await axios.put("/api/instructor-slots", {
          instructorId: instructor._id,
          date: dateStr,
          time: startTime,
          duration: slotForm.length,
          visibility: slotForm.visibility,
          privateNote: slotForm.privateNote,
          publicNote: slotForm.publicNote,
          suburb: slotForm.allSuburbs ? "ALL" : selectedSuburbs,
        });
      });

      await Promise.all(requests);

      toast.success("Slots updated ✅");
      setSlotForm((p) => ({
        ...p,
        bulkAction: "",
      }));
      closeSlotModal();
      await refetchSlots();
    } catch (err) {
      toast.error(err?.message || "Update failed");
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      if (!instructor?._id || !selectedSlot?.date || !selectedSlot?.time)
        return;

      const dateStr = formatDate(selectedSlot.date);

      // ✅ use DB duration if exists
      const durationStr = existingSlot?.duration || "15 mins";
      const blockTimes = getBlockTimes(selectedSlot.time, durationStr);

      await axios.delete("/api/instructor-slots", {
        data: {
          instructorId: instructor._id,
          date: dateStr,
          times: blockTimes.length ? blockTimes : [selectedSlot.time],
        },
      });

      toast.success("Removed ✅");

      setSlotForm((p) => ({
        ...p,
        length: "15 mins",
        visibility: "public",
        privateNote: "",
        publicNote: "",
        bulkAction: "",
        allSuburbs: true,
        reuseSettings: false,
      }));

      closeSlotModal();
      await refetchSlots();
    } catch (err) {
      toast.error("Remove failed");
    }
  };
  const handleMoveToEmptySlot = async (date, time) => {
    const dateStr = formatDate(date);

    if (isPastSlotDateTime(dateStr, time)) {
      toast.error("Cannot move booking to a past date or time");
      return;
    }

    try {
      setSaving(true);

      await axios.patch(`/api/bookings/${moveBookingId}`, {
        bookingDate: new Date(date).toISOString(),
        bookingTime: time,
      });

      toast.success("Booking moved successfully");
      await queryClient.invalidateQueries({queryKey: ["bookings"]});
      await queryClient.invalidateQueries({
        queryKey: ["booking", moveBookingId],
      });
      router.push("/instructor-bookings");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to move booking");
    } finally {
      setSaving(false);
    }
  };
  const handleSwapBooking = async (targetBooking) => {
    const movingDateStr = formatDate(
      movingBooking?.bookingDate || movingBooking?.date,
    );
    const movingTime = movingBooking?.bookingTime || movingBooking?.time;

    const targetDateStr = formatDate(
      targetBooking?.bookingDate || targetBooking?.date,
    );
    const targetTime = targetBooking?.bookingTime || targetBooking?.time;

    if (isPastSlotDateTime(movingDateStr, movingTime)) {
      toast.error("Cannot swap because the moving booking is already over");
      return;
    }

    if (isPastSlotDateTime(targetDateStr, targetTime)) {
      toast.error("Cannot swap with a booking that is already over");
      return;
    }

    try {
      setSaving(true);

      await axios.post("/api/bookings/swap", {
        sourceBookingId: moveBookingId,
        targetBookingId: targetBooking._id,
      });

      toast.success("Bookings swapped successfully");
      await queryClient.invalidateQueries({queryKey: ["bookings"]});
      await queryClient.invalidateQueries({
        queryKey: ["booking", moveBookingId],
      });
      router.push("/instructor-bookings");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to swap bookings");
    } finally {
      setSaving(false);
    }
  };
  const handleBooking = (date, slot, time) => {
    if (!slot?._id) return toast.error("Slot not found!");

    const dateStr = formatDate(date);
    const maxAvailableMinutes = getMaxContinuousAvailableMinutes(dateStr, time);

    const bookingInfo = {
      instructorEmail: instructor?.email,
      instructorName: instructor?.name,
      instructorId: instructor?._id,

      date: new Date(date).toISOString(),
      time,
      location: "",
      suburb: "",
      slotId: slot._id,
      duration: slot.duration,
      maxAvailableMinutes,
      bookingType: "manual",

      ...(rebookMode
        ? {
            clientId: rebookClientId,
            clientName: rebookClient
              ? `${rebookClient.firstName || ""} ${rebookClient.lastName || ""}`.trim()
              : "",
            clientEmail: rebookClient?.email || "",
            clientPhone: rebookClient?.mobile || rebookClient?.phone || "",
            clientAddress: rebookClient?.address || "",
            suburb: rebookClient?.suburb || "",
            skipClientSelect: true,
          }
        : {}),
    };

    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingInfo));
    router.push("/booking-confirm");
  };

  if (slotsLoading || bookingsLoading) return <LoadingSpinner />;

  return (
    <>
      <section className="py-5 md:py-10">
        <Container>
          <div>
            {/* Main Content Area */}

            <div className="grid grid-cols-1 lg:grid-cols-9 gap-2 md:gap-6">
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
                    <div className="sticky top-0 z-50 px-2 md:px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center justify-between gap-4">
                        {/* left: title + range */}
                        <div className="">
                          <div className="flex gap-2">
                            <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900">
                              {user?.name}&apos;s Schedule
                            </h2>
                            <button
                              onClick={() => setShowCopyModal(true)}
                              className="text-xl border border-border-color text-primary p-1"
                            >
                              <TbCopyPlusFilled />
                            </button>
                          </div>
                          <p className="text-neutral mt-1 text-xs md:text-base">
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

                        {/* right: prev/next week */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goPrevWeek}
                            className="h-9 w-9 flex items-center justify-center rounded-md border border-border-color bg-white hover:bg-gray-100"
                            title="Previous 7 days"
                          >
                            <FaChevronLeft />
                          </button>

                          <button
                            onClick={goNextWeek}
                            className="h-9 w-9 flex items-center justify-center rounded-md border border-border-color bg-white hover:bg-gray-100"
                            title="Next 7 days"
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Table */}
                    {moveBookingId && movingBooking && (
                      <div className="mb-4 rounded-lg border bg-primary text-white p-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">
                              Move / Swap Mode
                            </div>
                            <div className="text-sm mt-1">
                              Moving: {movingBooking.userName} •{" "}
                              {movingBooking.serviceName} •{" "}
                              {movingBooking.duration}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => router.push("/instructor-bookings")}
                            className="shrink-0 rounded-md p-2 transition"
                            title="Cancel move mode"
                            aria-label="Cancel move mode"
                          >
                            <FaTimes className="h-4 w-4 " />
                          </button>
                        </div>
                      </div>
                    )}
                    {rebookMode && (
                      <div className="m-3 p-3 rounded-md border border-secondary bg-secondary text-white text-sm flex justify-between items-center">
                        <span>
                          Rebook Mode: choose a slot for{" "}
                          <b>
                            {rebookClient?.firstName} {rebookClient?.lastName}
                          </b>
                        </span>
                        <button
                          className="underline font-semibold"
                          onClick={() => router.push("/instructor-bookings")}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {/* table*/}
                    <div className="">
                      <div
                        ref={tableRef}
                        className="overflow-x-auto overflow-y-auto touch-pan-x select-none scrollbar-hide"
                        style={{
                          WebkitOverflowScrolling: "touch",
                          cursor: "grab",
                          touchAction: "auto",
                          maxHeight: "calc(100vh - 60px)",
                        }}
                      >
                        <table className="w-full min-w-150 md:min-w-[700px] border-separate border-spacing-0 table-fixed h-full">
                          <thead className="bg-white">
                            <tr>
                              <th className="py-2 px-1 border border-border-color text-xs md:text-sm font-medium uppercase tracking-wider sticky top-0 left-0 bg-[#DCDCDC] z-50 text-center w-[55px] max-w-[55px] min-w-[55px] md:w-[65px] md:max-w-[65px] md:min-w-[65px]">
                                Time
                              </th>

                              {weekDates.map((date, index) => (
                                <th
                                  key={index}
                                  className="py-2 px-1 border border-border-color text-center text-xs md:text-sm font-medium text-gray-500 md:uppercase md:tracking-wider sticky top-0 z-20 bg-white"
                                >
                                  <div className="flex flex-col items-center">
                                    <div className="font-bold text-gray-900">
                                      {date.toLocaleDateString("en-US", {
                                        weekday: "long",
                                      })}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {date.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
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
                                <td className="py-2 px-1 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900 sticky left-0 bg-[#DCDCDC] z-10 text-center border-b border-dashed border-gray-500 max-w-[30px]">
                                  {time}
                                </td>

                                {weekDates.map((date, dayIndex) => {
                                  const dateKey = formatDate(date);
                                  const key = `${dateKey}__${time}`;
                                  const slot = slotMap[key];
                                  const canMoveHere = shouldShowMovingBlock(
                                    dateKey,
                                    time,
                                  );
                                  const suburbLabel =
                                    slot?.suburb === "ALL" ? (
                                      ""
                                    ) : Array.isArray(slot?.suburb) ? (
                                      <>
                                        S <sup>{slot.suburb.length}</sup>
                                      </>
                                    ) : (
                                      ""
                                    );

                                  const bCov =
                                    bookingCoverage?.[dateKey]?.[time];
                                  if (bCov?.skip) return null;

                                  if (bCov?.booking) {
                                    const b = bCov.booking;
                                    const name =
                                      b.clientName || b.userName || "Client";
                                    const paid = b.paymentStatus === "paid";
                                    const isNewBooking = isCreatedToday(
                                      b.createdAt,
                                    );
                                    const canSwap =
                                      moveMode && canSwapWith(movingBooking, b);
                                    const isMovingSource =
                                      moveMode &&
                                      String(b._id) === String(moveBookingId);

                                    if (isMovingSource) {
                                      return (
                                        <td
                                          key={dayIndex}
                                          rowSpan={bCov.rowSpan}
                                          className="p-0 align-stretch"
                                        >
                                          <div className="w-full h-full min-h-11 bg-red-600 border border-border-color px-2 py-2 flex items-center justify-center text-center">
                                            <div className="text-white font-bold text-sm md:text-base">
                                              Moving
                                            </div>
                                          </div>
                                        </td>
                                      );
                                    }

                                    return (
                                      <td
                                        key={dayIndex}
                                        rowSpan={bCov.rowSpan}
                                        className="p-0 align-stretch"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!moveMode) {
                                              router.push(
                                                `/instructor-bookings/${b._id}`,
                                              );
                                              return;
                                            }

                                            if (!canSwap) {
                                              toast.error(
                                                "Swap allowed only with same lesson duration",
                                              );
                                              return;
                                            }

                                            handleSwapBooking(b);
                                          }}
                                          className="relative w-full h-full min-h-11 bg-[#c9b0cf] hover:brightness-95 border border-border-color px-2 py-2 pt-6 md:pt-0 flex flex-col items-center justify-center text-center overflow-hidden"
                                        >
                                          {isNewBooking && (
                                            <div
                                              className="absolute -top-3 -left-5 -rotate-45 bg-yellow-400 text-black text-[8px] font-medium w-12 h-8 shadow pt-4"
                                              title="New booking today"
                                            >
                                              NEW
                                            </div>
                                          )}

                                          {paid && (
                                            <span
                                              className="absolute top-1 right-1 h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary text-white text-[9px] md:text-[11px] font-bold flex items-center justify-center"
                                              title="Paid"
                                            >
                                              P
                                            </span>
                                          )}

                                          <div className="text-red-600 font-semibold text-sm">
                                            {name}
                                          </div>
                                          <div className="text-red-600 text-xs font-semibold mt-1">
                                            {b.serviceName || "Driving lesson"}{" "}
                                            {b.duration || ""}
                                          </div>
                                          <div className="text-red-600 text-[11px] mt-1 wrap-break-word">
                                            {b.address || b.userAddress || ""}{" "}
                                            {b.suburb || b.location || ""}
                                          </div>

                                          {moveMode && canSwap && (
                                            <div className="mt-2 px-4 py-1 rounded bg-red-600 text-white text-xs font-bold">
                                              SWAP
                                            </div>
                                          )}
                                        </button>
                                      </td>
                                    );
                                  }

                                  const cov = coverage?.[dateKey]?.[time];
                                  if (cov?.skip) return null;

                                  const rowSpan = cov?.rowSpan || 1;
                                  const visibility =
                                    slot?.visibility || "empty";

                                  return (
                                    <td
                                      key={dayIndex}
                                      rowSpan={rowSpan}
                                      className="p-0 align-stretch"
                                    >
                                      {visibility === "empty" ? (
                                        <button
                                          type="button"
                                          disabled={moveMode}
                                          onClick={() => {
                                            if (moveMode) return;
                                            openSlotModal({date, time});
                                          }}
                                          className={`w-full h-full min-h-11 border border-border-color flex items-center justify-between px-2 ${
                                            moveMode
                                              ? "bg-white text-gray-400 cursor-not-allowed opacity-60"
                                              : "bg-white hover:bg-gray-50"
                                          }`}
                                          title={
                                            moveMode
                                              ? "Disabled in move mode"
                                              : "Add"
                                          }
                                        >
                                          <div></div>
                                          <span
                                            className={`text-base md:text-lg ${moveMode ? "text-gray-400" : "text-primary"}`}
                                          >
                                            +
                                          </span>
                                        </button>
                                      ) : visibility === "hidden" ? (
                                        <button
                                          type="button"
                                          disabled={moveMode}
                                          onClick={() => {
                                            if (moveMode) return;
                                            return handleBooking(
                                              date,
                                              slot,
                                              time,
                                            );
                                          }}
                                          className="w-full h-full min-h-11 bg-[#d3d3d3] hover:bg-[#E7E7E7] border border-border-color px-2 py-2 flex flex-col justify-between items-stretch"
                                        >
                                          <div className="flex items-start justify-between gap-1">
                                            <FaEyeSlash className="h-3 w-3 md:h-4 md:w-4 text-primary shrink-0 mt-0.5" />

                                            {!!suburbLabel && (
                                              <span className="text-[10px] opacity-90 text-gray-700 shrink-0">
                                                {suburbLabel}
                                              </span>
                                            )}

                                            <IoMdAdd
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (moveMode) return;
                                                openSlotModal({date, time});
                                              }}
                                              className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0"
                                            />
                                          </div>

                                          {slot?.privateNote && (
                                            <div className="mt-2 text-xs text-center wrap-break-word whitespace-normal">
                                              {slot.privateNote}
                                            </div>
                                          )}
                                        </button>
                                      ) : visibility === "privateBooked" ? (
                                        <button
                                          type="button"
                                          disabled={moveMode}
                                          onClick={() => {
                                            if (moveMode) return;
                                            return handleBooking(
                                              date,
                                              slot,
                                              time,
                                            );
                                          }}
                                          className="w-full h-full min-h-11 bg-[#8d8d8d] hover:bg-[#B2B2B2] border border-red-100 px-2 py-2 flex flex-col justify-between items-stretch"
                                        >
                                          <div className="flex items-start justify-between gap-1">
                                            <FaCalendarPlus className="h-3 w-3 md:h-4 md:w-4 text-white shrink-0 mt-0.5" />

                                            {!!suburbLabel && (
                                              <span className="text-[10px] opacity-90 text-white shrink-0">
                                                {suburbLabel}
                                              </span>
                                            )}

                                            <IoMdAdd
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (moveMode) return;
                                                openSlotModal({date, time});
                                              }}
                                              className="h-3 w-3 md:h-5 md:w-5 text-white shrink-0"
                                            />
                                          </div>

                                          {slot?.privateNote && (
                                            <div className="mt-2 text-xs text-center text-white wrap-break-word whitespace-normal">
                                              {slot.privateNote}
                                            </div>
                                          )}
                                        </button>
                                      ) : visibility === "publicNote" ? (
                                        <button
                                          type="button"
                                          disabled={moveMode}
                                          onClick={() => {
                                            if (moveMode) return;
                                            return handleBooking(
                                              date,
                                              slot,
                                              time,
                                            );
                                          }}
                                          className="w-full h-full min-h-11 bg-[#FF9933] text-black font-bold border border-border-color hover:bg-[#FFB83D] px-2 py-2 flex flex-col md:flex-row wrap-break-word items-center justify-center gap-2"
                                        >
                                          <span className="text-xs text-center leading-snug break-all">
                                            {slot?.publicNote}{" "}
                                            {!!suburbLabel && (
                                              <span className="text-[10px] opacity-90">
                                                {suburbLabel}
                                              </span>
                                            )}
                                          </span>
                                          <IoMdAdd
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (moveMode) return;
                                              openSlotModal({date, time});
                                            }}
                                            className="h-5 w-5 text-black shrink-0"
                                          />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            if (moveMode) {
                                              if (!canMoveHere) return;
                                              return handleMoveToEmptySlot(
                                                date,
                                                time,
                                              );
                                            }
                                            return handleBooking(
                                              date,
                                              slot,
                                              time,
                                            );
                                          }}
                                          disabled={moveMode && !canMoveHere}
                                          className={`w-full h-full min-h-11 border border-dashed border-border-color flex items-center justify-center gap-2 text-[10px] md:text-sm font-semibold px-2 py-2 ${
                                            moveMode
                                              ? canMoveHere
                                                ? "bg-[#7DA730] hover:bg-[#96C83A] text-white"
                                                : "bg-[#7DA730] text-white opacity-60 cursor-not-allowed"
                                              : "bg-[#7DA730] hover:bg-[#96C83A] text-white"
                                          }`}
                                        >
                                          <span>
                                            {moveMode
                                              ? canMoveHere
                                                ? "Available"
                                                : "Available"
                                              : "Available"}
                                          </span>
                                          <div>
                                            {!!suburbLabel && (
                                              <span className="text-[10px] opacity-90">
                                                {suburbLabel}
                                              </span>
                                            )}
                                            <IoMdAdd
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (moveMode) return;
                                                openSlotModal({date, time});
                                              }}
                                              className="h-4 w-4"
                                            />
                                          </div>
                                        </button>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Desktop footer: keep your More/Less bar */}
                        <div className="sticky bottom-0 left-0 right-0 bg-white z-50">
                          <div className="flex items-stretch justify-between gap-1 md:gap-2">
                            {!showMoreTimes ? (
                              <button
                                onClick={() => setShowMoreTimes(true)}
                                className="text-primary font-semibold hover:underline ml-4"
                              >
                                More
                              </button>
                            ) : (
                              <button
                                onClick={() => setShowMoreTimes(false)}
                                className="text-primary font-semibold hover:underline ml-4"
                              >
                                Less
                              </button>
                            )}

                            {weekDates.map((date, index) => (
                              <div
                                key={index}
                                className="flex-1 min-w-0 py-1 md:py-2 text-center font-medium  text-gray-500 "
                              >
                                <div className="flex flex-col items-center leading-tight ">
                                  <div className="font-bold text-[10px] md:text-sm text-gray-900 truncate">
                                    {weekdays[index].slice(0, 3)}
                                  </div>
                                  <div className="text-[9px] md:text-xs text-gray-500 mt-0.5 md:mt-1 truncate">
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
                {allowedLengths.map((opt) => (
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

              <label className="flex items-center gap-2 text-sm mb-3">
                <input
                  type="checkbox"
                  checked={slotForm.allSuburbs}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSlotForm((p) => ({...p, allSuburbs: checked}));
                    if (checked) setSelectedSuburbs([]); // reset list when switching to ALL
                  }}
                />
                <span>Available in all Suburbs</span>
              </label>

              {!slotForm.allSuburbs && (
                <div className="border border-border-color rounded-lg p-3">
                  <input
                    value={suburbSearch}
                    onChange={(e) => setSuburbSearch(e.target.value)}
                    placeholder="Search suburb..."
                    className="w-full border border-border-color rounded-md px-3 py-2 mb-3"
                  />

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {(instructor?.suburbs || [])
                      .filter((s) =>
                        s.name
                          .toLowerCase()
                          .includes(suburbSearch.toLowerCase()),
                      )
                      .map((s) => {
                        const checked = selectedSuburbs.includes(s.name);
                        return (
                          <label
                            key={s.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setSelectedSuburbs((prev) =>
                                  e.target.checked
                                    ? [...prev, s.name]
                                    : prev.filter((x) => x !== s.name),
                                );
                              }}
                            />
                            <span>{s.name}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Action */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Bulk Action:</h4>

              <select
                value={slotForm.bulkAction}
                onChange={(e) =>
                  setSlotForm((p) => ({...p, bulkAction: e.target.value}))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select Time Frame</option>

                {/* Next X minutes/hours */}
                {[
                  30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 240, 300,
                  360, 420, 480,
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
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                {shouldShowRemove && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <button
                onClick={handleSchedule}
                disabled={scheduleLoading}
                className={`text-white font-semibold px-6 py-3 rounded-lg transition ${
                  scheduleLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {scheduleLoading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showCopyModal && (
        <Modal onClose={() => setShowCopyModal(false)}>
          <div className="w-full ">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Copy Weekly Schedule
              </h2>
            </div>

            <div className="mb-2 border-t border-border-color" />

            <div className="space-y-3">
              <div className="grid grid-cols-[70px_1fr] gap-3 items-start">
                <div className="font-medium text-gray-700">From:</div>
                <div className="font-semibold">
                  Week starting - {formatDate(startOfWeekMonday(selectedDate))}
                </div>
              </div>

              <div className="grid grid-cols-[70px_1fr] gap-3 items-start">
                <div className="font-medium text-gray-700">To:</div>
                <div className="space-y-1  max-h-[420px] overflow-y-auto pr-2">
                  {getFutureCopyWeeks(selectedDate, 16).map((w, idx) => (
                    <div key={w.value}>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedCopyWeeks.includes(w.value)}
                          onChange={() => toggleCopyWeek(w.value)}
                        />
                        <span className="font-medium">{w.label}</span>
                      </label>

                      {(idx + 1) % 4 === 0 && idx !== 15 && (
                        <div className="h-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1">
                <h4 className="font-semibold text-gray-900 mb-1">Bookings</h4>
                <div className="text-primary text-sm mb-3">
                  Blockout weekly schedule
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={copyOptions.copyBookingsIfFree}
                      onChange={(e) =>
                        setCopyOptions((prev) => ({
                          ...prev,
                          copyBookingsIfFree: e.target.checked,
                        }))
                      }
                    />
                    <span>
                      Copy bookings when there is no conflicting booking or
                      hidden schedule.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={copyOptions.deleteBookingsWhenClearing}
                      onChange={(e) =>
                        setCopyOptions((prev) => ({
                          ...prev,
                          deleteBookingsWhenClearing: e.target.checked,
                        }))
                      }
                    />
                    <span>Delete bookings when clearing schedule</span>
                  </label>
                </div>

                <p className="mt-3 text-sm italic text-gray-600">
                  Note: Existing bookings and hidden schedules with private
                  notes are not affected.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-border-color">
              <button
                type="button"
                onClick={handleClearWeekSchedule}
                disabled={clearWeekLoading || copyLoading}
                className={`font-medium text-sm hover:underline ${
                  clearWeekLoading || copyLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary"
                }`}
              >
                {clearWeekLoading ? "Clearing..." : "Clear Week's Schedule"}
              </button>
              <button
                type="button"
                onClick={handleSendWeeklySummary}
                disabled={sendingSummary || copyLoading || clearWeekLoading}
                className={`font-medium text-sm hover:underline ${
                  sendingSummary || copyLoading || clearWeekLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary"
                }`}
              >
                {sendingSummary ? "Sending..." : "Send Weekly Summary"}
              </button>
              <button
                type="button"
                onClick={handleCopySchedule}
                disabled={copyLoading}
                className={`px-6 py-3 rounded-lg text-white font-semibold ${
                  copyLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {copyLoading ? "Copying..." : "Copy"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
