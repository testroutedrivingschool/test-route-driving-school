"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import { useEffect, useMemo, useState } from "react";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import { toast } from "react-toastify";

const DURATIONS = [
  { label: "1 Hour", minutes: 60 },
  { label: "1hr 30m", minutes: 90 },
  { label: "2 Hours", minutes: 120 },
  { label: "2hr 30m", minutes: 150 },
  { label: "3 Hours", minutes: 180 },
  { label: "3hr 30m", minutes: 210 },
  { label: "4 Hours", minutes: 240 },
];

function getSuburbBasedServices(
  instructor = {},
  selectedSuburb = "",
  maxAvailableMinutes = Infinity
) {
  const instructorServices = instructor?.services || [];
  const suburbConfig = instructor?.suburbs?.find(
    (s) => s.name === selectedSuburb
  );

  return instructorServices
    .filter(
      (service) =>
        Array.isArray(service.prices) &&
        service.prices.some((price) => price != null)
    )
    .map((service) => {
      const suburbPkg = suburbConfig?.packages?.find(
        (p) => p.serviceName === service.name
      );

      const prices = DURATIONS.map((_, i) => service.prices?.[i] ?? null);

      const globalActiveDurations = DURATIONS.map(
        (_, i) =>
          !!service.activeDurations?.[i] &&
          prices[i] != null &&
          DURATIONS[i].minutes <= maxAvailableMinutes
      );

      // If no suburb package found, fall back to global availability
      const finalActiveDurations = DURATIONS.map((_, i) => {
        if (prices[i] == null) return false;
        if (DURATIONS[i].minutes > maxAvailableMinutes) return false;
        if (!globalActiveDurations[i]) return false;

        if (!suburbPkg) return true;

        return !!suburbPkg.activeDurations?.[i];
      });

      return {
        name: service.name,
        prices,
        activeDurations: finalActiveDurations,
      };
    })
    .filter((service) => service.activeDurations.some(Boolean));
}
export default function BookingConfirmPage() {
  const router = useRouter();
  const { data: userData, isUserLoading } = useUserData();
  const [booking, setBooking] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [overridePrice, setOverridePrice] = useState("");

  useEffect(() => {
  if (isUserLoading) return;

  if (!userData) {
    router.push("/login?redirect=/booking-confirm");
  }
}, [userData,isUserLoading,router]);
  useEffect(() => {
    const data = sessionStorage.getItem("pendingBooking");

    if (!data) {
      router.push("/bookings");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooking(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { data: instructor, isLoading } = useQuery({
    queryKey: ["instructor", booking?.instructorEmail],
    queryFn: async () => {
      const res = await axios.get(`/api/instructors?email=${booking.instructorEmail}`);
      return res.data;
    },
    enabled: !!booking,
  });

  const selectedSuburb = booking?.suburb || booking?.location || "";
  const isManualBooking = booking?.bookingType === "manual";

const services = useMemo(() => {
  return getSuburbBasedServices(
    instructor || {},
    selectedSuburb,
    booking?.maxAvailableMinutes ?? Infinity
  );
}, [instructor, selectedSuburb, booking?.maxAvailableMinutes]);

  const parsedOverridePrice =
    overridePrice !== "" && !Number.isNaN(Number(overridePrice))
      ? Number(overridePrice)
      : null;

  const finalPrice =
    isManualBooking && parsedOverridePrice != null && parsedOverridePrice > 0
      ? parsedOverridePrice
      : selectedBooking?.price ?? 0;

  const hasOverride =
    isManualBooking &&
    parsedOverridePrice != null &&
    parsedOverridePrice > 0 &&
    selectedBooking &&
    Number(parsedOverridePrice) !== Number(selectedBooking.price);

  const handleConfirmBooking = async () => {
    if (parsedOverridePrice != null && !selectedBooking) {
      return toast.error("Please select a package first");
    }

    if (!selectedBooking) {
      return toast.error("Please select a service");
    }

    if (parsedOverridePrice != null && parsedOverridePrice <= 0) {
      return toast.error("Override price must be greater than 0");
    }

    if (booking.bookingType === "website") {
      const bookingData = {
        userId: userData._id,
        clientId: userData.clientId,
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
        originalPrice: selectedBooking.price,
        overridePrice: null,
        isPriceOverridden: false,

        bookingDate: booking.date,
        bookingTime: booking.time,
        location: booking.location,
        suburb: booking.suburb || booking.location,
        status: "pending",
        bookingType: booking.bookingType,
      };

      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      router.push("/booking-confirm/payment-confirm");
      return;
    }

    const hasClient = !!(booking?.clientId || booking?.skipClientSelect);

    if (hasClient) {
      const bookingData = {
        instructorEmail: instructor.email,
        instructorName: instructor.name,
        instructorId: instructor._id,

        serviceName: selectedBooking.service,
        duration: selectedBooking.duration,
        minutes: selectedBooking.minutes,
        price: finalPrice,
        originalPrice: selectedBooking.price,
        overridePrice: hasOverride ? finalPrice : null,
        isPriceOverridden: !!hasOverride,

        bookingDate: booking.date,
        bookingTime: booking.time,
        location: booking.location,
        suburb: booking.suburb || booking.location,
        status: "pending",
        bookingType: "manual",

        clientId: booking.clientId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        clientAddress: booking.clientAddress,
      };

      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      router.push("/booking-confirm/payment-confirm");
      return;
    }

    const bookingData = {
      instructorEmail: instructor.email,
      instructorName: instructor.name,
      instructorId: instructor._id,

      serviceName: selectedBooking.service,
      duration: selectedBooking.duration,
      minutes: selectedBooking.minutes,
      price: finalPrice,
      originalPrice: selectedBooking.price,
      overridePrice: hasOverride ? finalPrice : null,
      isPriceOverridden: !!hasOverride,

      bookingDate: booking.date,
      bookingTime: booking.time,
      location: booking.location,
      suburb: booking.suburb || booking.location,
      status: "pending",
      bookingType: "manual",
    };

    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    router.push("/select-client");
  };

  const avatarSrc = instructor?.photo
    ? instructor.photo
    : instructor?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(instructor.photoKey)}`
      : "/profile-avatar.png";

  if (isLoading || isUserLoading || !instructor || !booking) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-5">
      <Container>
        <div className="border border-border-color rounded shadow bg-white">
          <div className="bg-green-600 text-white text-center py-3 font-semibold text-lg">
            {booking.bookingType === "manual"
              ? "Booking User"
              : `Booking For ${userData?.name || "User"}`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="col-span-1">
              <div className="mt-5 flex justify-center">
                <Image
                  src={avatarSrc}
                  alt={instructor.name}
                  width={180}
                  height={180}
                  className="border object-cover rounded-full w-30 md:w-40 h-30 md:h-40"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
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
                    {
                      selectedSuburb && <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Suburb:</p>
                      <p>{selectedSuburb || "-"}</p>
                    </div>
                    }
                    
                    <div className="flex items-center gap-6">
                      <p className="font-semibold w-45">Booking Length:</p>
                      <p>{selectedBooking ? selectedBooking.duration : "0 mins"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {services.length === 0 ? (
                <div className="w-full py-10 flex flex-col items-center justify-center text-center gap-3 bg-base-100 border border-dashed border-border-color rounded">
                  <p className="w-full text-lg font-semibold text-gray-700">
                    No Services Available
                  </p>
                  <p className="text-sm text-gray-500">
                    This instructor does not have any services available for the selected Slots/Suburbs.
                  </p>

                  <PrimaryBtn className="mt-3" onClick={() => router.back()}>
                    Go Back                  </PrimaryBtn>
                </div>
              ) : (
                <>
                  {isMobile ? (
                    <MobileTable
                      services={services}
                      durations={DURATIONS}
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                    />
                  ) : (
                    <DesktopTable
                      services={services}
                      durations={DURATIONS}
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                    />
                  )}

                  {isManualBooking && (
                    <div className="px-4 md:px-4 mt-6">
                      <div className=" space-y-4">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                          <div className="w-full flex flex-col md:flex-row items-center gap-2 md:gap-2">
                            <label className="w-40 block text-sm md:text-base font-semibold mb-2">
                              Override Price :
                            </label>
                            <div className="w-full relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={overridePrice}
                                onChange={(e) => setOverridePrice(e.target.value)}
                                placeholder={
                                  selectedBooking
                                    ? ``
                                    : ""
                                }
                                className="w-full border border-border-color rounded-lg pl-8 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            
                          </div>

                         
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="mt-6 mb-6 md:px-8 px-2">
                <PrimaryBtn
                  className="w-full md:w-auto text-center! justify-center!"
                  onClick={handleConfirmBooking}
                >
                  Proceed
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ServiceRow({
  name,
  prices,
  activeDurations,
  onSelect,
  selectedBooking,
  index,
}) {
  const rowBg = index % 2 === 0 ? "bg-white" : "bg-base-300";

  return (
    <tr className={`${rowBg} border-t border-border-color`}>
      <td className="px-2 md:px-3 py-2 font-semibold text-[10px] md:text-sm">
        {name}
      </td>

      {DURATIONS.map((d, i) => (
        <td key={i} className="text-center py-2">
          {prices[i] != null && activeDurations[i] ? (
            <label className="flex flex-col items-center font-medium gap-1 cursor-pointer text-[8px] md:text-sm">
              <input
                type="radio"
                name="servicePick"
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
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileTable({ services, durations, selectedBooking, setSelectedBooking }) {
  return (
    <div className="px-2 overflow-x-auto ">
      <table className="w-full  border border-border-color text-[11px]">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="text-left px-2 py-2">Service</th>
            {durations.map((d) => (
              <th key={d.minutes} className="px-1 py-2 text-center font-bold">
                {d.minutes === 60 && "1 hr"}
                {d.minutes === 90 && "1hr 30m"}
                {d.minutes === 120 && "2 hrs"}
                {d.minutes === 150 && "2hr 30m"}
                {d.minutes === 180 && "3 hrs"}
                {d.minutes === 210 && "3hr 30m"}
                {d.minutes === 240 && "4 hrs"}
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
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}