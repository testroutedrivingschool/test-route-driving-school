/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useEffect, useRef, useState} from "react";
import {
  FaUserCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import BookingCalendar from "./components/BookingCalendar";
import axios from "axios";
import Modal from "@/app/shared/ui/Modal";
import {IoMdAdd} from "react-icons/io";
import {useRouter} from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const weekdayShort = ["M", "T", "W", "TH", "F", "S", "SU"];

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
];

export default function BookingsPage() {
  const {user} = useAuth();
  const {data: instructors = [], isLoading} = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/instructors");
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
        console.error("Error fetching instructors:", error);
        return []; // return empty array if error occurs
      }
    },
  });
  console.log(instructors);
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Set selected instructor when data loads
  // if (instructors.length > 0 && !selectedInstructor) {
  //   setSelectedInstructor(instructors[0]);
  // }

  // Check if a time slot is booked (mock logic)
  const isBooked = (time, dayIndex) => {
    const dayName = weekdays[dayIndex];
    // Simple booking logic - in real app, fetch from API
    const morningBooked =
      time.includes("AM") && (dayName === "Monday" || dayName === "Wednesday");
    const specificTimes = time === "9:00AM" && dayName === "Tuesday";
    const afternoonBooked = time === "2:00PM" && dayName === "Friday";
    const eveningBooked = time === "4:00PM" && dayName === "Thursday";

    return morningBooked || specificTimes || afternoonBooked || eveningBooked;
  };

  // Get dates for the week of selectedDate
  const getWeekDates = (selectedDate) => {
    const dates = [];
    const startDate = new Date(selectedDate);

    // 🔒 normalize time to avoid timezone bugs
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };
  const weekDates = getWeekDates(selectedDate);

  // Handle booking
  const handleBookNow = (time, dayIndex) => {
    if (!selectedInstructor) return;

    const date = weekDates[dayIndex];

    if (!user) {
      router.push(`/login?redirect=/bookings`);
      return;
    }

    const bookingInfo = {
      instructorEmail: selectedInstructor.email,
      instructorName: selectedInstructor.name,

      date: date.toISOString(),
      time,
      location: selectedLocations,
    };
    console.log(bookingInfo);
    // ✅ Store booking info safely
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

  // useEffect(() => {
  //   if (selectedLocations) {
  //     const availableInstructors = instructors.filter((inst) =>
  //       inst.suburbs.some((s) => s.name === selectedLocations),
  //     );
  //     if (availableInstructors.length > 0) {
  //       setSelectedInstructor(availableInstructors[0]);
  //     } else {
  //       setSelectedInstructor(null);
  //     }
  //   }
  // }, [selectedLocations, instructors]);

useEffect(() => {
  // when location changes, reset selection
  setSelectedInstructor(null);
}, [selectedLocations]);

  const filteredInstructors = selectedLocations
    ? instructors.filter(
        (inst) =>
          inst.suburbs &&
          inst.suburbs.some((sub) => sub.name === selectedLocations),
      )
    : instructors;
const isAvailable = (instructor, dayIndex) => {
  if (!instructor || !selectedLocations) return false;

    const suburb = instructor.suburbs.find((s) => s.name === selectedLocations);

    if (!suburb) return false; // instructor not in this location

    return suburb.availableDays.includes(weekdayShort[dayIndex]);
  };
  useEffect(() => {
    setShowLocationModal(true);
  }, []);
  // Show loading spinner
  if (isLoading || isLoadingLocations) {
    return <LoadingSpinner />;
  }


// const otherInstructors = instructors.filter(
//   (inst) => inst._id !== selectedInstructor?._id
// );

// const otherCount = otherInstructors.length;



const displayedInstructors = selectedInstructor
  ? instructors.filter((inst) => inst._id !== selectedInstructor._id)
  : instructors;

const slidesToShow = Math.min(4, Math.max(1, displayedInstructors.length));
const canLoop = displayedInstructors.length > slidesToShow;


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
            <p className="text-gray-600">
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
              <div className="text-center">
                <h3 className="font-bold text-lg">{selectedLocations}</h3>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-primary font-medium hover:font-bold transition"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            {selectedLocations && filteredInstructors.length === 0 ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-border-color p-6">
                <FaUserCheck className="h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Instructors Available
                </h2>
                <p className="text-gray-600 mb-4">
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
                  <div className="md:col-span-3">
                    <BookingCalendar
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </div>

                  {/* Right Column - Schedule Table */}
                  <div className="md:col-span-6 ">
                    {/* Instructor Selection - Horizontal Scrollbar */}
                    <div className="overflow-auto mb-8 bg-white rounded-xl shadow-sm border border-border-color  p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Select Your Instructor
                          </h2>
                          <p className="text-gray-600 text-sm mt-1">
                            Click on an instructor to view their schedule
                          </p>
                        </div>
                      </div>

                      {/* Horizontal Scrollbar for Instructors */}
                      <div className="relative ">
                        {/* Scroll buttons */}

                        {/* Instructors Container */}
                        <div className={selectedInstructor && "flex items-start gap-6"}>
                          {/* Selected Instructor Card */}
                          <div className="w-[260px] shrink-0">
                            {selectedInstructor && (<div className="flex flex-col items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 border-primary bg-primary/10 shadow-md">
                              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-3">
                                <Image
                                  src={selectedInstructor.photo}
                                  alt={selectedInstructor.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML =
                                      '<FaUserCheck className="h-10 w-10 text-gray-500" />';
                                  }}
                                />
                              </div>
                              <h3 className="font-bold text-gray-900 text-sm mb-1 truncate max-w-[120px]">
                                {selectedInstructor.name}
                              </h3>
                              <span className="text-xs text-gray-500 mt-1">
                                Selected
                              </span>
                            </div>)}
                            
                          </div>

                          {/* Other Instructors - Horizontal Scroll */}
                          <div className="flex-1 min-w-0 relative">
  <Swiper
    className="w-full"
    onSwiper={(swiper) => (swiperRef.current = swiper)}
    slidesPerView={slidesToShow}
    spaceBetween={24}
    loop={canLoop}
    autoplay={
      canLoop
        ? { delay: 2000, disableOnInteraction: false }
        : false
    }
    modules={[Autoplay]}
  >
    {displayedInstructors.map((instructor) => (
      <SwiperSlide key={instructor._id} className="h-auto!">
        <div
          onClick={() => setSelectedInstructor(instructor)}
          className="w-full flex flex-col items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:border-primary/20 hover:shadow-sm border-border-color"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3">
            {instructor.photo ? (
              <Image
                src={instructor.photo}
                alt={instructor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCheck className="h-8 w-8 text-gray-500" />
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-1 truncate max-w-[120px]">
            {instructor.name}
          </h3>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* show arrows only if sliding is needed */}
  {canLoop && (
    <>
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md"
      >
        <FaChevronLeft className="text-primary w-4 h-4 md:w-5 md:h-5" />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
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
  <div className="rounded-xl border border-border-color bg-white p-8 text-center text-gray-600">
    Please select an instructor to view the schedule.
  </div>
) : (
                    <div className="rounded-xl shadow-sm border border-border-color overflow-hidden">
                      {/* Schedule Header */}
                      <div className="px-6 py-4 border-b border-border-color bg-linear-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {selectedInstructor.name}&apos;s Schedule
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
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                                <span className="text-sm text-gray-600">
                                  Booked
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                                <span className="text-sm text-gray-600">
                                  Available
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Table */}
                      <div
                        className="overflow-x-auto touch-pan-x scrollbar-hide"
                        style={{
                          WebkitOverflowScrolling: "touch",
                          cursor: "grab",
                        }}
                        ref={tableRef}
                      >
                        <table className="w-full min-w-[700px] border-collapse">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border border-border-color text-left text-sm font-medium uppercase tracking-wider sticky left-0 bg-[#DCDCDC] z-10">
                                Time
                              </th>
                              {weekDates.map((date, index) => (
                                <th
                                  key={index}
                                  className="py-2 px-2 border border-border-color text-center text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[140px]"
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
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-color">
                            {times.map((time) => (
                              <tr key={time} className="hover:bg-gray-50/50">
                                <td className="py-2 px-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-[#DCDCDC] z-10">
                                  {time}
                                </td>
                                {weekDates.map((date, dayIndex) => {
                                  const available = isAvailable(
                                    selectedInstructor,
                                    dayIndex,
                                  );
                                  return (
                                    <td key={dayIndex} className="text-center">
                                      <button
                                        onClick={() =>
                                          available &&
                                          handleBookNow(time, dayIndex)
                                        }
                                        disabled={!available}
                                        className={`w-full py-2 text-sm transition-all duration-200 min-h-11 flex items-center justify-center font-semibold ${
                                          available
                                            ? "bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm border border-green-100"
                                            : "bg-red-50 text-red-700 cursor-not-allowed border border-red-100"
                                        }`}
                                      >
                                        {available ? (
                                          <div className="flex items-center gap-2">
                                            <IoMdAdd className="h-4 w-4" />
                                            <span className="text-xs">
                                              Book Now
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <FaTimesCircle className="h-4 w-4" />
                                            <span className="text-xs">
                                              Unavailable
                                            </span>
                                          </div>
                                        )}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Table Footer */}
                      <div className="px-6 py-4 border-t border-border-color bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-sm text-neutral">
                            Showing {times.length} time slots
                          </div>
                        </div>
                      </div>
                    </div>)}



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
                call +61 412 018 593
              </p>
            </div>
          </div>
        </Container>
      </section>
      {showLocationModal && (
        <Modal onClose={() => setShowLocationModal(false)}>
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
                      setSelectedLocations(location.name);
                      setShowLocationModal(false);
                      setLocationSearch(""); // clear search after selection
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
