"use client";
import {useEffect, useRef, useState} from "react";
import {FaUserCheck, FaChevronLeft, FaChevronRight} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import {Autoplay} from "swiper/modules";
import BookingCalendar from "./components/BookingCalendar";
import axios from "axios";
import Modal from "@/app/shared/ui/Modal";
import {useRouter, useSearchParams} from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import {toast} from "react-toastify";
import Swal from "sweetalert2";

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

async function confirmReschedule({bookingId, newDateISO, newTime}) {
  const newDateText = new Date(newDateISO).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const ok = await Swal.fire({
    title: "Confirm reschedule?",
    html: `
      <div style="text-align:left;line-height:1.7">
        <div><b>New date:</b> ${newDateText}</div>
        <div><b>New time:</b> ${newTime}</div>
        <hr/>
        <div style="font-size:12px;opacity:.8">
          Reschedule is allowed only if it’s at least <b>24 hours</b> before your booking time.
        </div>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reschedule",
    cancelButtonText: "Cancel",
  });

  if (!ok.isConfirmed) return;

  try {
    await axios.patch(`/api/bookings/${bookingId}`, {
      bookingDate: newDateISO,
      bookingTime: newTime,
      actorType: "USER",
    });

    toast.success("Rescheduled ✅");
    window.location.href = "/dashboard/user/my-bookings";
  } catch (e) {
    toast.error(e?.response?.data?.error || "Failed to reschedule");
  }
}

function toBookingDateTime(bookingDate, bookingTime) {
  const d = new Date(bookingDate);
  if (Number.isNaN(d.getTime())) return null;

  const t = String(bookingTime || "")
    .trim()
    .toUpperCase();
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!m) return d;

  let hh = Number(m[1]);
  const mm = Number(m[2] || 0);
  const ap = m[3];

  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;

  const combined = new Date(d);
  combined.setHours(hh, mm, 0, 0);
  return combined;
}

function canUserReschedule(bookingDate, bookingTime) {
  const dt = toBookingDateTime(bookingDate, bookingTime);
  if (!dt) return false;
  return dt.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}

export default function BookingsPage() {
  const {user} = useAuth();
  const searchParams = useSearchParams();
  const instructorId = searchParams.get("instructorId");
  const isReschedule = searchParams.get("reschedule") === "1";
  const bookingId = searchParams.get("bookingId");

  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const {data: instructors = [], isLoading} = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/instructors?status=approved");
        const data = res.data;

        return data.map((instructor) => ({
          id: instructor._id,
          name: instructor.name,
          photo: instructor.photo,
          status: instructor.status || "Available",
          suburbs: instructor.suburbs || [],
          ...instructor,
        }));
      } catch (error) {
        toast.error("Error fetching instructors:", error?.res?.data || "");
        return [];
      }
    },
  });

  const {data: locations = [], isLoading: isLoadingLocations} = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data;
    },
  });
  const router = useRouter();
  const swiperRef = useRef(null);
  const tableRef = useRef(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const formatYMD = (date) => {
    // Safe local YYYY-MM-DD (avoids timezone issues)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const normalizeTime = (t) => t?.replace(/\s+/g, ""); // "7:00AM" stays "7:00AM"

  // Get dates for the week of selectedDate
  const getWeekDates = (selectedDate) => {
    const dates = [];
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);

    // JS: Sun=0..Sat=6  ->  make Monday=0..Sunday=6
    const day = startDate.getDay();
    const diffToMonday = (day + 6) % 7;

    // go back to Monday
    startDate.setDate(startDate.getDate() - diffToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d);
    }

    return dates;
  };

  const weekDates = getWeekDates(selectedDate);

  const weekStart = formatYMD(weekDates[0]);
  const weekEnd = formatYMD(weekDates[6]);

  const startOfWeekMonday = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diffToMonday = (day + 6) % 7;
    d.setDate(d.getDate() - diffToMonday);
    return d;
  };

  const TODAY_WEEK_START = startOfWeekMonday(new Date());

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const goPrevWeek = () => {
    setSelectedDate((prev) => {
      const next = addDays(prev, -7);
      if (startOfWeekMonday(next) < TODAY_WEEK_START) return TODAY_WEEK_START;
      return next;
    });
  };

  const isPrevDisabled =
    startOfWeekMonday(selectedDate).getTime() <= TODAY_WEEK_START.getTime();

  const goNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7));
  };

  const {data: slots = [], isLoading: slotsLoading} = useQuery({
    queryKey: [
      "instructorSlots",
      selectedInstructor?._id,
      weekStart,
      weekEnd,
      selectedLocations,
    ],
    enabled: !!selectedInstructor && !!selectedLocations,
    queryFn: async () => {
      const res = await axios.get("/api/instructor-slots", {
        params: {
          instructorId: selectedInstructor._id,
          from: weekStart,
          to: weekEnd,
        },
      });
      return res.data;
    },
  });
  const slotsMap = slots.reduce((acc, s) => {
    acc[`${s.date}__${normalizeTime(s.time)}`] = s;
    return acc;
  }, {});

  const slotMatchesLocation = (slot) => {
    if (!slot) return false;

    if (slot.suburb === "ALL") return true;

    if (Array.isArray(slot.suburb)) {
      return slot.suburb.includes(selectedLocations);
    }

    return slot.suburb === selectedLocations;
  };

  const isHourStart = (time) => time?.includes(":00");

  // Handle booking
  const handleBookNow = (time, dayIndex, slot) => {
    if (!selectedInstructor) return;

    if (!user) {
      router.push(`/login?redirect=/bookings`);
      return;
    }

    const bookingInfo = {
      instructorEmail: selectedInstructor.email,
      instructorName: selectedInstructor.name,
      instructorId: selectedInstructor._id,

      date: weekDates[dayIndex].toISOString(),
      time,
      location: selectedLocations,

      slotId: slot?._id,
      duration: slot?.duration,
      bookingType: "website",
    };

    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingInfo));
    router.push("/booking-confirm");
  };

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
  useEffect(() => {
    if (!isReschedule || !bookingId) return;

    setRescheduleLoading(true);
    (async () => {
      try {
        const res = await axios.get(`/api/bookings/${bookingId}`);
        const b = res.data;

        if (!canUserReschedule(b.bookingDate, b.bookingTime)) {
          toast.error(
            "Reschedule is only allowed at least 24 hours before the booking time.",
          );
          router.push("/dashboard/my-bookings");
          return;
        }

        setRescheduleBooking(b);

        const loc = b.suburb || b.location || "";
        if (loc) {
          setSelectedLocations(loc);
          localStorage.setItem(LS_SELECTED_LOC, loc);
        }

        const bd = new Date(b.bookingDate);
        if (!Number.isNaN(bd.getTime())) setSelectedDate(bd);
      } catch (e) {
        toast.error(
          e?.response?.data?.error || "Failed to load booking for reschedule",
        );
        router.push("/dashboard/my-bookings");
      } finally {
        setRescheduleLoading(false);
      }
    })();
  }, [isReschedule, bookingId, router]);
  useEffect(() => {
    if (!isReschedule || !rescheduleBooking || !instructors?.length) return;

    const match = instructors.find(
      (i) => String(i._id) === String(rescheduleBooking.instructorId),
    );

    if (match) setSelectedInstructor(match);
  }, [isReschedule, rescheduleBooking, instructors]);

  useEffect(() => {
    if (isReschedule) return;
    setSelectedInstructor(null);
  }, [selectedLocations, isReschedule]);

  const {data: bookings = [], isLoading: bookingsLoading} = useQuery({
    queryKey: ["bookings", selectedInstructor?.email, weekStart, weekEnd],
    enabled: !!selectedInstructor?.email,
    queryFn: async () => {
      const res = await axios.get(
        `/api/bookings?email=${selectedInstructor.email}`,
      );

      // ✅ Filter only this week (because API doesn't support from/to yet)
      const from = new Date(weekStart);
      from.setHours(0, 0, 0, 0);

      const to = new Date(weekEnd);
      to.setHours(23, 59, 59, 999);

      return (res.data || []).filter((b) => {
        const d = new Date(b.bookingDate);
        return d >= from && d <= to;
      });
    },
  });

  const timeIndexMap = times.reduce((acc, t, i) => {
    acc[normalizeTime(t)] = i;
    return acc;
  }, {});

  const STEP_MIN = 15;

  const toMinutes = (b) => {
    if (typeof b?.minutes === "number") return b.minutes;

    const s = (b?.duration || "").toLowerCase();
    const hr = s.match(/(\d+)\s*h/);
    const mn = s.match(/(\d+)\s*m/);
    const hours = hr ? parseInt(hr[1], 10) : 0;
    const mins = mn ? parseInt(mn[1], 10) : 0;
    return hours * 60 + mins;
  };
  const bookedSlotsMap = (bookings || []).reduce((acc, b) => {
    const dateKey = formatYMD(new Date(b.bookingDate));
    const startTime = normalizeTime(b.bookingTime);

    const startIdx = timeIndexMap[startTime];
    if (startIdx == null) return acc;

    const mins = toMinutes(b);
    const span = Math.max(1, Math.ceil(mins / STEP_MIN));

    for (let k = 0; k < span; k++) {
      const t = normalizeTime(times[startIdx + k]);
      if (!t) break;
      acc[`${dateKey}__${t}`] = true;
    }

    return acc;
  }, {});
  useEffect(() => {
    if (instructorId) {
      const selectedInstructor = instructors.find(
        (inst) => inst._id === instructorId,
      );
      setSelectedInstructor(selectedInstructor);
    }
  }, [instructorId, instructors]);
  const filteredInstructors = selectedLocations
    ? instructors.filter((inst) =>
        inst.suburbs?.some((sub) => sub.name === selectedLocations),
      )
    : instructors;

  const displayedInstructors = selectedInstructor
    ? filteredInstructors.filter((inst) => inst._id !== selectedInstructor._id)
    : filteredInstructors;

  const LS_KEY = "bookingLocationModalLastShown";
  const LS_SELECTED_LOC = "bookingSelectedLocation";

  const getTodayYMD = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const markModalSeenToday = () => {
    localStorage.setItem(LS_KEY, getTodayYMD());
  };

  useEffect(() => {
    const saved = localStorage.getItem(LS_SELECTED_LOC);
    if (saved) setSelectedLocations(saved);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isReschedule) return;
    const savedLocation = localStorage.getItem(LS_SELECTED_LOC);
    const todayDate = getTodayYMD();
    const lastShownDate = localStorage.getItem(LS_KEY);

    if (savedLocation) return;

    if (lastShownDate !== todayDate) {
      setShowLocationModal(true);
      localStorage.setItem(LS_KEY, todayDate); // Mark that the modal was shown today
    }
  }, [isReschedule]);

  // Show loading spinner
  if (isLoading || isLoadingLocations) {
    return <LoadingSpinner />;
  }

  const getVisibility = (slot) => (slot?.visibility || "").trim();

  const slidesToShow = Math.min(4, Math.max(1, displayedInstructors.length));
  const canLoop = displayedInstructors.length > slidesToShow;

  if (slotsLoading || bookingsLoading || rescheduleLoading)
    return <LoadingSpinner />;
  // Show error if no instructors
  if (!isLoading && instructors.length === 0) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaUserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Instructors Available
            </h2>
            <p className="text-neutral">
              Please check back later or contact support.
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="py-10">
          <Container>
            <div>
              {/* Header */}
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold ">
                    Test Route Driving School
                  </h1>
                  <p className="text-neutral mt-2">
                    Book your driving lessons with certified instructors
                  </p>
                </div>
                {!isReschedule && (
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{selectedLocations}</h3>
                    <button
                      onClick={() => setShowLocationModal(true)}
                      className="text-primary font-medium hover:font-bold transition"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              {selectedLocations && filteredInstructors.length === 0 ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-border-color p-6">
                  <FaUserCheck className="h-16 w-16 text-gray-400 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    No Instructors Available
                  </h2>
                  <p className="text-neutral mb-4">
                    There are no instructors available in this location.
                  </p>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Change Location
                  </button>
                </div>
              ) : (
                filteredInstructors.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
                    {/* Left Column - Calendar */}
                    <div className="md:col-span-2">
                      <BookingCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                      />
                    </div>

                    {/* Right Column - Schedule Table */}
                    <div className="md:col-span-7 ">
                      {/* Instructor Selection - Horizontal Scrollbar */}
                      <div className="overflow-auto mb-8 bg-white rounded-xl shadow-sm border border-border-color  p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              Select Your Instructor
                            </h2>
                            <p className="text-neutral text-sm mt-1">
                              Click on an instructor to view their schedule
                            </p>
                          </div>
                        </div>

                        {/* Horizontal Scrollbar for Instructors */}
                        <div className="relative ">
                          {/* Scroll buttons */}

                          {/* Instructors Container */}
                          <div
                            className={
                              selectedInstructor && "flex items-start gap-6"
                            }
                          >
                            {/* Selected Instructor Card */}
                            <div className="w-[260px] shrink-0">
                              {selectedInstructor && (
                                <div className="flex flex-col items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 border-primary bg-primary/10 shadow-md">
                                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-3">
                                    <Image
                                      src={
                                        selectedInstructor?.photo
                                          ? selectedInstructor.photo
                                          : selectedInstructor?.photoKey
                                            ? `/api/storage/proxy?key=${encodeURIComponent(selectedInstructor.photoKey)}`
                                            : "/profile-avatar.png"
                                      }
                                      alt={selectedInstructor.name}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.parentElement.innerHTML =
                                          '<img src="/profile-avatar.png" className="h-10 w-10 text-gray-500" />';
                                      }}
                                    />
                                  </div>
                                  <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-1 truncate max-w-[120px]">
                                    {selectedInstructor.name}
                                  </h3>
                                  <span className="text-xs text-gray-500 mt-1">
                                    Selected
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Other Instructors - Horizontal Scroll */}
                            <div className="flex-1 min-w-0 relative">
                              <Swiper
                                className="w-full"
                                onSwiper={(swiper) =>
                                  (swiperRef.current = swiper)
                                }
                                slidesPerView={slidesToShow}
                                spaceBetween={24}
                                loop={canLoop}
                                autoplay={
                                  canLoop
                                    ? {delay: 2000, disableOnInteraction: false}
                                    : false
                                }
                                modules={[Autoplay]}
                              >
                                {displayedInstructors.map((instructor) => {
                                  const avatarSrc = instructor?.photo
                                    ? instructor.photo
                                    : instructor?.photoKey
                                      ? `/api/storage/proxy?key=${encodeURIComponent(instructor.photoKey)}`
                                      : "/profile-avatar.png";
                                  return (
                                    <SwiperSlide
                                      key={instructor._id}
                                      className="h-auto!"
                                    >
                                      <div
                                        onClick={() =>
                                          setSelectedInstructor(instructor)
                                        }
                                        className="w-full flex flex-col items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:border-primary/20 hover:shadow-sm border-border-color"
                                      >
                                        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3">
                                          <Image
                                            src={avatarSrc}
                                            alt={instructor.name || ""}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-xs md:text-sm wrap-break-word mb-1 truncate max-w-[120px]">
                                          {instructor.name}
                                        </h3>
                                      </div>
                                    </SwiperSlide>
                                  );
                                })}
                              </Swiper>

                              {/* show arrows only if sliding is needed */}
                              {canLoop && (
                                <>
                                  <button
                                    onClick={() =>
                                      swiperRef.current?.slidePrev()
                                    }
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md"
                                  >
                                    <FaChevronLeft className="text-primary w-4 h-4 md:w-5 md:h-5" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      swiperRef.current?.slideNext()
                                    }
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md"
                                  >
                                    <FaChevronRight className="text-primary w-4 h-4 md:w-5 md:h-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {!selectedInstructor ? (
                        <div className="rounded-xl border border-border-color bg-white p-8 text-center text-neutral">
                          Please select an instructor to view the schedule.
                        </div>
                      ) : (
                        <div className="rounded-xl shadow-sm border border-border-color overflow-hidden bg-white">
                          {/* ✅ Scroll container (vertical + horizontal) */}
                          {/* ✅ Schedule Table */}
                          <div className="rounded-xl shadow-sm border border-border-color overflow-hidden bg-white">
                            {/* Header */}
                            <div className="sticky top-0 z-40 px-4 md:px-6 py-4 border-b border-border-color bg-white">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                    {selectedInstructor.name}&apos;s Schedule
                                  </h2>

                                  <p className="text-neutral mt-1 text-sm">
                                    Week of{" "}
                                    {weekDates[0].toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                    {" - "}
                                    {weekDates[6].toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={goPrevWeek}
                                    disabled={isPrevDisabled}
                                    className={`h-9 w-9 flex items-center justify-center rounded-md border border-border-color bg-white
          ${isPrevDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                                    title="Previous week"
                                  >
                                    <FaChevronLeft />
                                  </button>

                                  <button
                                    onClick={goNextWeek}
                                    className="h-9 w-9 flex items-center justify-center rounded-md border border-border-color bg-white hover:bg-gray-100"
                                    title="Next week"
                                  >
                                    <FaChevronRight />
                                  </button>
                                </div>
                              </div>

                              {/* legend */}
                              <div className="mt-3 flex items-center gap-4 text-xs text-neutral">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-[#A2B5D8] rounded" />
                                  <span>Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-[#7DA730] rounded" />
                                  <span>Available</span>
                                </div>
                              </div>
                            </div>

                            {/* ✅ Desktop weekly grid (md+) */}
                            <div className="hidden md:block">
                              <div
                                ref={tableRef}
                                className="overflow-y-auto"
                                style={{
                                  maxHeight: "90vh",
                                  WebkitOverflowScrolling: "touch",
                                }}
                              >
                                <table className="w-full border-separate border-spacing-0 table-fixed">
                                  <thead>
                                    <tr>
                                      <th className="py-2 px-2 border border-border-color text-sm font-semibold sticky top-0 left-0 bg-[#DCDCDC] z-50 text-center">
                                        Time
                                      </th>

                                      {weekDates.map((date, index) => (
                                        <th
                                          key={index}
                                          className="py-2 px-1 border border-border-color text-center text-sm font-semibold sticky top-0 bg-white z-40"
                                        >
                                          <div className="flex flex-col items-center">
                                            <div className="font-bold text-gray-900">
                                              {weekdays[index]}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                              {date.toLocaleDateString(
                                                "en-US",
                                                {
                                                  month: "short",
                                                  day: "numeric",
                                                },
                                              )}
                                            </div>
                                          </div>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {times.map((time) => {
                                      const hourLine =
                                        isHourStart(time) && time !== times[0];
                                      const topBorder = hourLine
                                        ? "border-t border-t-black"
                                        : "border-t border-t-gray-400 border-dashed";
                                      const cellBorder = `${topBorder} border-r border-r-black`;

                                      return (
                                        <tr
                                          key={time}
                                          className="align-stretch"
                                        >
                                          <td
                                            className={`py-2 px-1 text-center whitespace-nowrap text-sm font-semibold sticky left-0 bg-[#DCDCDC] z-30 ${cellBorder}`}
                                          >
                                            {time}
                                          </td>

                                          {weekDates.map((date, dayIndex) => {
                                            const dateKey = formatYMD(date);
                                            const timeKey = normalizeTime(time);
                                            const tdClass = `p-0 ${cellBorder}`;

                                            const isBooked =
                                              bookedSlotsMap[
                                                `${dateKey}__${timeKey}`
                                              ];
                                            if (isBooked) {
                                              return (
                                                <td
                                                  key={dayIndex}
                                                  className={tdClass}
                                                >
                                                  <div className="w-full h-full min-h-11 py-2 text-xs font-semibold bg-[#A2B5D8] text-black/40 flex items-center justify-center">
                                                    Booked
                                                  </div>
                                                </td>
                                              );
                                            }

                                            const key = `${dateKey}__${normalizeTime(time)}`;
                                            const slot = slotsMap[key];

                                            if (
                                              !slot ||
                                              !slotMatchesLocation(slot)
                                            ) {
                                              return (
                                                <td
                                                  key={dayIndex}
                                                  className={tdClass}
                                                >
                                                  <div className="w-full h-full min-h-11 bg-[#eee]" />
                                                </td>
                                              );
                                            }

                                            const vis = getVisibility(slot);
                                            if (
                                              vis === "" ||
                                              vis === "hidden"
                                            ) {
                                              return (
                                                <td
                                                  key={dayIndex}
                                                  className={tdClass}
                                                >
                                                  <div className="w-full h-full min-h-11 bg-[#eee]" />
                                                </td>
                                              );
                                            }

                                            if (vis === "publicNote") {
                                              return (
                                                <td
                                                  key={dayIndex}
                                                  className={tdClass}
                                                >
                                                  <div className="w-full h-full min-h-11 px-2 py-2 bg-[#FF9933] font-bold text-black text-xs flex items-center justify-center text-center wrap-break-word">
                                                    {slot.publicNote || ""}
                                                  </div>
                                                </td>
                                              );
                                            }

                                            if (vis === "privateBooked") {
                                              return (
                                                <td
                                                  key={dayIndex}
                                                  className={tdClass}
                                                >
                                                  <div className="w-full h-full min-h-11 py-2 text-xs font-semibold bg-[#A2B5D8] text-black/40 flex items-center justify-center">
                                                    Booked
                                                  </div>
                                                </td>
                                              );
                                            }

                                            if (vis === "public") {
                                              return (
                                                <td
                                                  key={dayIndex}
                                                  className={tdClass}
                                                >
                                                  <button
                                                    onClick={async () => {
                                                      if (isReschedule) {
                                                        if (
                                                          !rescheduleBooking
                                                        ) {
                                                          toast.error(
                                                            "Booking info not loaded yet.",
                                                          );
                                                          return;
                                                        }
                                                        const newDateISO =
                                                          weekDates[
                                                            dayIndex
                                                          ].toISOString();
                                                        const newTime = time;
                                                        await confirmReschedule(
                                                          {
                                                            bookingId,
                                                            newDateISO,
                                                            newTime,
                                                          },
                                                        );
                                                        return;
                                                      }
                                                      handleBookNow(
                                                        time,
                                                        dayIndex,
                                                        slot,
                                                      );
                                                    }}
                                                    className={`w-full h-full min-h-11 py-2 text-xs font-semibold bg-[#7DA730] hover:bg-[#96C83A] text-white flex items-center justify-center`}
                                                  >
                                                    {isReschedule
                                                      ? "Reschedule"
                                                      : "Book Now"}
                                                  </button>
                                                </td>
                                              );
                                            }

                                            return (
                                              <td
                                                key={dayIndex}
                                                className={tdClass}
                                              >
                                                <div className="w-full h-full min-h-11 bg-[#eee]" />
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      );
                                    })}
                                  </tbody>

                                  {/* ✅ Proper footer (aligned with table columns) */}
                                  <tfoot className="bg-white sticky bottom-0 z-40">
                                    <tr>
                                      <td className="py-2 px-2 border border-border-color text-center font-semibold bg-[#DCDCDC] sticky left-0 z-50">
                                        Date
                                      </td>
                                      {weekDates.map((date, index) => (
                                        <td
                                          key={index}
                                          className="py-2 px-2 border border-border-color text-center text-xs font-semibold"
                                        >
                                          {date.toLocaleDateString("en-US", {
                                            weekday: "short",
                                          })}
                                          ,{" "}
                                          {date.toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                          })}
                                        </td>
                                      ))}
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>

                            {/* ✅ Mobile (one day view, no horizontal scroll) */}

                            <div className="md:hidden">
                              {(() => {
                                const visibleDayIdx = [0, 1, 2, 3, 4, 5, 6];
                                const formatMobileTime = (t) => {
                                  const match = t.match(/^(\d+):(\d+)(AM|PM)$/);
                                  if (!match) return t;

                                  const [, hour, minute, period] = match;
                                  return {hour: `${hour}.${minute}`, period};
                                };
                                return (
                                  <div className="max-h-[75vh] overflow-y-auto">
                                    <table className="w-full table-fixed border-separate border-spacing-0">
                                      {/* ✅ force widths so it fits mobile without x-scroll */}
                                      <colgroup>
                                        <col style={{width: "35px"}} />
                                        {visibleDayIdx.map((i) => (
                                          <col
                                            key={i}
                                            style={{
                                              width: `calc((100% - 35px) / ${visibleDayIdx.length})`,
                                            }}
                                          />
                                        ))}
                                      </colgroup>

                                      <thead>
                                        <tr>
                                          <th className="w-5 py-2 px-1 border border-border-color text-[10px] font-bold sticky top-0 left-0 bg-[#DCDCDC] z-40 text-center">
                                            <div className="leading-tight">
                                              <div>Time</div>
                                              <span className="font-semibold opacity-80">
                                                AEDT
                                              </span>
                                            </div>
                                          </th>

                                          {visibleDayIdx.map((dayIndex) => (
                                            <th
                                              key={dayIndex}
                                              className="py-2 px-0.5 border border-border-color text-center text-[10px] font-bold sticky top-0 bg-white z-30"
                                            >
                                              <div className="leading-tight">
                                                <div className="text-gray-900">
                                                  {weekdays[dayIndex].slice(
                                                    0,
                                                    3,
                                                  )}
                                                </div>
                                                <div className="text-gray-600 font-semibold">
                                                  {weekDates[
                                                    dayIndex
                                                  ].toLocaleDateString(
                                                    "en-US",
                                                    {
                                                      day: "numeric",
                                                      month: "short",
                                                    },
                                                  )}
                                                </div>
                                              </div>
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {times.map((time) => {
                                          const hourLine =
                                            isHourStart(time) &&
                                            time !== times[0];
                                          const topBorder = hourLine
                                            ? "border-t border-t-black"
                                            : "border-t border-t-gray-400 border-dashed";

                                          return (
                                            <tr
                                              key={time}
                                              className="align-stretch"
                                            >
                                              <td
                                                className={`w-5 py-2 px-0.5 text-center whitespace-nowrap text-[10px] font-bold text-gray-900 sticky left-0 bg-[#DCDCDC] z-20 border border-border-color ${topBorder}`}
                                              >
                                                {(() => {
                                                  const ft =
                                                    formatMobileTime(time);
                                                  if (!ft) return time;

                                                  return (
                                                    <div className="flex flex-col leading-tight">
                                                      <span>{ft.hour}</span>
                                                      <span className="text-[8px]">
                                                        {ft.period}
                                                      </span>
                                                    </div>
                                                  );
                                                })()}
                                              </td>

                                              {visibleDayIdx.map((dayIndex) => {
                                                const date =
                                                  weekDates[dayIndex];
                                                const dateKey = formatYMD(date);
                                                const timeKey =
                                                  normalizeTime(time);

                                                const isBooked =
                                                  bookedSlotsMap[
                                                    `${dateKey}__${timeKey}`
                                                  ];

                                                const key = `${dateKey}__${normalizeTime(time)}`;
                                                const slot = slotsMap[key];
                                                const vis = slot
                                                  ? getVisibility(slot)
                                                  : "";

                                                // cell container (tight like screenshot)
                                                const cellClass = `p-0 border border-border-color ${topBorder}`;

                                                if (isBooked) {
                                                  return (
                                                    <td
                                                      key={dayIndex}
                                                      className={cellClass}
                                                    >
                                                      <div className="w-full min-h-10 flex items-center justify-center bg-[#A2B5D8] text-black/40 text-[8px] font-bold">
                                                        Booked
                                                      </div>
                                                    </td>
                                                  );
                                                }

                                                if (
                                                  !slot ||
                                                  !slotMatchesLocation(slot) ||
                                                  vis === "" ||
                                                  vis === "hidden"
                                                ) {
                                                  return (
                                                    <td
                                                      key={dayIndex}
                                                      className={cellClass}
                                                    >
                                                      <div className="w-full min-h-10 bg-[#eee]" />
                                                    </td>
                                                  );
                                                }

                                                if (vis === "publicNote") {
                                                  return (
                                                    <td
                                                      key={dayIndex}
                                                      className={cellClass}
                                                    >
                                                      <div className="w-full min-h-10 px-1 py-1 bg-[#FF9933] text-[8px] font-bold text-black flex items-center justify-center text-center wrap-break-word leading-tight">
                                                        {slot.publicNote || ""}
                                                      </div>
                                                    </td>
                                                  );
                                                }

                                                if (vis === "privateBooked") {
                                                  return (
                                                    <td
                                                      key={dayIndex}
                                                      className={cellClass}
                                                    >
                                                      <div className="w-full min-h-10 flex items-center justify-center bg-[#A2B5D8] text-black/40 text-[10px] font-bold">
                                                        Booked
                                                      </div>
                                                    </td>
                                                  );
                                                }

                                                if (vis === "public") {
                                                  return (
                                                    <td
                                                      key={dayIndex}
                                                      className={cellClass}
                                                    >
                                                      <button
                                                        onClick={async () => {
                                                          if (isReschedule) {
                                                            if (
                                                              !rescheduleBooking
                                                            ) {
                                                              toast.error(
                                                                "Booking info not loaded yet.",
                                                              );
                                                              return;
                                                            }
                                                            const newDateISO =
                                                              date.toISOString();
                                                            const newTime =
                                                              time;
                                                            await confirmReschedule(
                                                              {
                                                                bookingId,
                                                                newDateISO,
                                                                newTime,
                                                              },
                                                            );
                                                            return;
                                                          }

                                                          handleBookNow(
                                                            time,
                                                            dayIndex,
                                                            slot,
                                                          );
                                                        }}
                                                        className="w-full min-h-10 bg-[#7DA730] hover:bg-[#96C83A] text-white text-[8px] font-bold flex items-center justify-center wrap-break-word"
                                                      >
                                                        {isReschedule
                                                          ? "Confirm"
                                                          : "Book Now"}
                                                      </button>
                                                    </td>
                                                  );
                                                }

                                                return (
                                                  <td
                                                    key={dayIndex}
                                                    className={cellClass}
                                                  >
                                                    <div className="w-full min-h-10 bg-[#eee]" />
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          );
                                        })}
                                      </tbody>

                                      {/* ✅ Footer aligned with same columns */}
                                      <tfoot className="sticky bottom-0 z-30 bg-white">
                                        <tr>
                                          <td className="py-2 px-1 border border-border-color text-center text-[10px] font-bold bg-[#DCDCDC] sticky left-0 z-40">
                                            Date
                                          </td>

                                          {visibleDayIdx.map((dayIndex) => (
                                            <td
                                              key={dayIndex}
                                              className="py-2 px-0.5 border border-border-color text-center text-[10px] font-bold"
                                            >
                                              {weekDates[
                                                dayIndex
                                              ].toLocaleDateString("en-US", {
                                                weekday: "short",
                                              })}
                                            </td>
                                          ))}
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* Footer Info */}
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                  Note: All bookings are subject to instructor availability.
                  You&apos;ll receive a confirmation email within 24 hours.
                </p>
                <p className="mt-2">
                  Need help? Contact us at testroutedrivingschool@gmail.com or
                  call
                  <a
                    href="tel:61412018593"
                    className="px-1 rounded-lg  font-bold "
                  >
                    <span>0412 018 593</span>
                  </a>
                </p>
              </div>
            </div>
          </Container>
      </section>

      {showLocationModal && (
        <Modal
          onClose={() => {
            markModalSeenToday();
            setShowLocationModal(false);
          }}
        >
          <h2 className="text-lg font-bold mb-4">Select Location</h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full mb-4 px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />

          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {locations
              .filter((loc) =>
                loc.name.toLowerCase().includes(locationSearch.toLowerCase()),
              )
              .map((location, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      localStorage.setItem(LS_SELECTED_LOC, location.name);
                      markModalSeenToday();
                      setSelectedLocations(location.name);
                      setShowLocationModal(false);
                      setLocationSearch("");
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    {location.name}
                  </button>
                </li>
              ))}
          </ul>
        </Modal>
      )}
    </>
  );
}
