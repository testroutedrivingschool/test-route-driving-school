"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useUserData} from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import {useEffect, useState} from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {toast} from "react-toastify";

export default function BookingConfirmPage() {
  const router = useRouter();
  const {data: userData, isUserLoading} = useUserData();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("pendingBooking");

    if (!data) {
      router.push("/bookings");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooking(JSON.parse(data));
  }, [router]);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
}, []);
  const {data: instructor, isLoading} = useQuery({
    queryKey: ["instructor", booking?.instructorEmail],
    queryFn: async () => {
      const res = await axios.get(
        `/api/instructors?email=${booking.instructorEmail}`,
      );
      return res.data;
    },
    enabled: !!booking,
  });

  const [selectedBooking, setSelectedBooking] = useState(null);

  // Transform backend services for table
  const durations = [
    {label: "1 Hour", minutes: 60},
    {label: "1hr 30m", minutes: 90},
    {label: "2 Hours", minutes: 120},
    {label: "2hr 30m", minutes: 150},
    {label: "3 Hours", minutes: 180},
    {label: "3hr 30m", minutes: 210},
    {label: "4 Hours", minutes: 240},
  ];
  const handleConfirmBooking = async () => {
    if (!selectedBooking) {
      return toast.error("Please select a service");
    }


    if (booking.bookingType === "website") {
      const bookingData = {
        userId: userData._id,
        clientId:userData.clientId,
        userEmail: userData.email,
        userName: userData.name,
        userAddress: userData.address,
        userPhone: userData.phone,
        instructorEmail: instructor.email,
        instructorName: instructor.name,
        instructorId: instructor._id,

        serviceName: selectedBooking.service,
        duration: selectedBooking.duration,
        minutes: selectedBooking.minutes,
        price: selectedBooking.price,

        bookingDate: booking.date,
        bookingTime: booking.time,
        location: booking.location,
        status: "pending",
        bookingType: booking.bookingType,
      };
  
   
  
      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      router.push("/booking-confirm/payment-confirm");
    } else {
     

      const hasClient = !!(booking?.clientId || booking?.skipClientSelect);

if (hasClient) {
  const bookingData = {
    instructorEmail: instructor.email,
    instructorName: instructor.name,
    instructorId: instructor._id,

    serviceName: selectedBooking.service,
    duration: selectedBooking.duration,
    minutes: selectedBooking.minutes,
    price: selectedBooking.price,

    bookingDate: booking.date,
    bookingTime: booking.time,
    location: booking.location,
    status: "pending",
    bookingType: "manual",

    // ✅ keep client details
    clientId: booking.clientId,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    clientAddress: booking.clientAddress,
    suburb: booking.suburb,
  };

  sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
  router.push("/booking-confirm/payment-confirm");
  return;
}

// fallback: normal manual flow
const bookingData = {
  instructorEmail: instructor.email,
  instructorName: instructor.name,
  instructorId: instructor._id,
  serviceName: selectedBooking.service,
  duration: selectedBooking.duration,
  minutes: selectedBooking.minutes,
  price: selectedBooking.price,
  bookingDate: booking.date,
  bookingTime: booking.time,
  location: booking.location,
  status: "pending",
  bookingType: "manual",
};

sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
router.push("/select-client");

      
    }
  };
    const avatarSrc = instructor?.photo
    ? instructor.photo
    : instructor?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(instructor.photoKey)}`
      : "/profile-avatar.png";
      console.log(booking);
  if (isLoading || isUserLoading || !instructor || !booking)
    return <LoadingSpinner />;
  const services =
    instructor?.services?.map((s) => ({
      name: s.name,
      prices: durations.map((_, i) => s.prices?.[i] ?? null),
      activeDurations: durations.map((_, i) => s.activeDurations?.[i] ?? false),
    })) ?? [];
    
  return (
    <section className="py-5">
      <Container>
        <div className="border border-border-color rounded shadow">
          {/* Header */}
          <div className="bg-green-600 text-white text-center py-3 font-semibold text-lg">
            {booking.bookingType === "manual"
              ? "Booking User"
              : `Booking For ${userData?.name || "User"}`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="col-span-1">
              {/* Instructor Photo */}
              <div className="mt-5 flex justify-center ">
                <Image
                  src={avatarSrc}
                  alt={instructor.name}
                  width={180}
                  height={180}
                  className="border object-cover rounded-full w-30 md:w-40 h-30 md:h-40"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<img src="/profile-avatar.png" width="100" height="100" className="h-10 w-10 object-cover border ring-2 text-gray-500" />`;
                  }}
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              {/* Booking Info */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3 space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Date:</p>
                      <p>{new Date(booking.date).toDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Time:</p>
                      <p>{booking.time}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Instructor:</p>
                      <p>{instructor.name}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Available Time:</p>
                      <p>4 hours 30 mins</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Booking Length:</p>
                      <p>
                        {selectedBooking ? selectedBooking.duration : "0 mins"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {services.length === 0 ? (
                <div className="w-full py-10 flex flex-col items-center justify-center text-center gap-3 bg-base-100 border border-dashed border-border-color rounded">
                  <p className="w-full text-lg font-semibold text-gray-700">
                    No Services Available
                  </p>
                  <p className="text-sm text-gray-500 ">
                    This instructor does not have any services available for the
                    selected date. Please try a different instructor or choose
                    another date.
                  </p>

                  <PrimaryBtn className="mt-3" onClick={() => router.back()}>
                    Choose Another Instructor
                  </PrimaryBtn>
                </div>
              ) : (
                <>
                  {/* Services Table */}
{isMobile ? (
  <MobileTable
    services={services}
    durations={durations}
    selectedBooking={selectedBooking}
    setSelectedBooking={setSelectedBooking}
  />
) : (
  <DesktopTable
    services={services}
    durations={durations}
    selectedBooking={selectedBooking}
    setSelectedBooking={setSelectedBooking}
  />
)}
                </>
              )}
              <div className="mt-6 mb-6 md:px-8 px-2"> <PrimaryBtn className="w-full md:w-auto text-center! justify-center!" onClick={handleConfirmBooking}> Proceed </PrimaryBtn> </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Helper Row Component ---------- */
function ServiceRow({
  name,
  prices,
  activeDurations,
  onSelect,
  selectedBooking,
  index,
}) {
  const durations = [
    {label: "1 Hour", minutes: 60},
    {label: "1hr 30m", minutes: 90},
    {label: "2 Hours", minutes: 120},
    {label: "2hr 30m", minutes: 150},
    {label: "3 Hours", minutes: 180},
    {label: "3hr 30m", minutes: 210},
    {label: "4 Hours", minutes: 240},
  ];

  const rowBg = index % 2 === 0 ? "bg-white" : "bg-base-300";

  return (
    <tr className={`${rowBg} border-t border-border-color`}>
      <td className="px-3 py-2 font-semibold">{name}</td>
      {durations.map((d, i) => (
        <td key={i} className="text-center py-2">
          {prices[i] && activeDurations[i] ? (
            <label className="flex flex-col items-center font-medium gap-1 cursor-pointer text-xs md:text-sm">
              <input
                type="radio"
                name={`servicePick`}
                checked={
                  selectedBooking?.service === name &&
                  selectedBooking?.minutes === d.minutes
                }
                onChange={() =>
                  onSelect({
                    service: name,
                    duration: d.label,
                    minutes: d.minutes,
                    price: prices[i],
                  })
                }
              />
              <span>${prices[i]}</span>
            </label>
          ) : (
            "--"
          )}
        </td>
      ))}
    </tr>
  );
}

function DesktopTable({ services, durations, selectedBooking, setSelectedBooking }) {
  return (
    <div className="px-4 overflow-x-auto">
      <table className="w-full min-w-[700px] border border-border-color text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="text-left px-3 py-2">Service</th>
            {durations.map((d) => (
              <th key={d.minutes} className="px-2 py-2 text-center">
                {d.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {services.map((service, index) => (
            <ServiceRow
              key={service.name}
              name={service.name}
              prices={service.prices}
              activeDurations={service.activeDurations}
              selectedBooking={selectedBooking}
              onSelect={setSelectedBooking}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileTable({ services, durations, selectedBooking, setSelectedBooking }) {
  return (
    <div className="px-2">
      <table className="w-full table-fixed border border-border-color text-[11px]">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="text-left px-2 py-2 w-[40%]">Service</th>
            {durations.map((d) => (
              <th key={d.minutes} className="px-1 py-2 text-center font-bold">
                {d.minutes === 60 && "1hr"}
                {d.minutes === 90 && "1hr30"}
                {d.minutes === 120 && "2hrs"}
                {d.minutes === 150 && "2hr30"}
                {d.minutes === 180 && "3hrs"}
                {d.minutes === 210 && "3hr30"}
                {d.minutes === 240 && "4hrs"}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {services.map((service, index) => (
            <ServiceRow
              key={service.name}
              name={service.name}
              prices={service.prices}
              activeDurations={service.activeDurations}
              selectedBooking={selectedBooking}
              onSelect={setSelectedBooking}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}