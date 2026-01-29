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
    console.log(booking);

    if (booking.bookingType === "website") {
      const bookingData = {
        userId:userData._id,
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
      console.log("Booking:", bookingData);

      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      router.push("/booking-confirm/payment-confirm");
    } else {
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
        bookingType: booking.bookingType,
      };
      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      router.push("/select-client");
      console.log(bookingData);
    }
  };

  if (isLoading || isUserLoading || !instructor || !booking)
    return <LoadingSpinner />;
  const services =
    instructor?.services?.map((s) => ({
      name: s.name,
      prices: durations.map((_, i) => s.prices?.[i] ?? null),
      activeDurations: durations.map((_, i) => s.activeDurations?.[i] ?? false),
    })) ?? [];
  return (
    <section className="py-16">
      <Container>
        <div className="border border-border-color rounded shadow">
          {/* Header */}
          <div className="bg-green-600 text-white text-center py-3 font-semibold text-lg">
            {booking.bookingType === "manual"
              ? "Booking User"
              : `Booking ${userData?.name || "User"}`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="col-span-1">
              {/* Instructor Photo */}
              <div className="mt-5 flex justify-center ">
                <Image
                  src={instructor.photo || "/profile-avatar.png"}
                  alt={instructor.name}
                  width={180}
                  height={180}
                  className="border object-cover "
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      `<img src="/profile-avatar.png" width="100" height="100" className="h-10 w-10 object-cover border ring-2 text-gray-500" />`;
                  }}
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              {/* Booking Info */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
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
                  <div className="px-8 pb-8 overflow-x-auto">
                    <table className="w-full min-w-[700px] md:min-w-full border border-border-color text-sm">
                      <thead className="bg-secondary text-white">
                        <tr>
                          <th className="text-left px-3 py-2">Service</th>
                          {durations.map((d) => (
                            <th key={d.minutes}>{d.label}</th>
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
                            onSelect={setSelectedBooking}
                            selectedBooking={selectedBooking}
                            index={index}
                          />
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-6">
                      <PrimaryBtn onClick={handleConfirmBooking}>
                        Proceed
                      </PrimaryBtn>
                    </div>
                  </div>
                </>
              )}
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
            <label className="flex flex-col items-center font-medium gap-1 cursor-pointer">
              <input
                type="radio"
                name={`service-${index}`}
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
