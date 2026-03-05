"use client";

import {useParams, usePathname, useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Container from "@/app/shared/ui/Container";
import BookingSidebar from "../components/BookingSidebar";
import BookingHeader from "../components/BookingHeader";
import BookingTabsNav from "../components/BookingTabsNav";
import {BookingProvider} from "./BookingContext";

export default function BookingDetailLayout({children}) {
  const {bookingId} = useParams();
  const pathname = usePathname();
  const {data: booking, isLoading} = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings/${bookingId}`);
      return res.data;
    },
    enabled: !!bookingId,
  });

  if (isLoading || !booking) return <LoadingSpinner />;

  // Which tab is active based on URL
  const activeTab =
    pathname?.split(`/instructor-bookings/${bookingId}/`)[1]?.split("/")[0] ||
    "booking";

  if (isLoading) return <LoadingSpinner />;

  if (!booking) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Booking Not Found
        </h2>
        <p className="text-sm text-neutral mt-2">
          The booking does not exist or was deleted.
        </p>
      </div>
    );
  }
  return (
   <section className="py-6">
      <Container >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Sidebar */}
          <div className="md:col-span-3 h-screen overflow-y-auto">
            <BookingSidebar booking={booking} />
          </div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-9 flex flex-col">
            <BookingHeader booking={booking} />

            <div className="mb-3">
              <BookingTabsNav bookingId={bookingId} activeTab={activeTab} />
            </div>

            {/* Tab Page Content */}
            <div className="grow-0">{/* Content Area */}</div>

            {/* Wrapping content in a BookingProvider */}
            <BookingProvider value={booking}>{children}</BookingProvider>
          </div>
        </div>
      </Container>
    </section>
  );
}
