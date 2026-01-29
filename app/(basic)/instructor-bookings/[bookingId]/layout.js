"use client";

import {useParams, usePathname, useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Container from "@/app/shared/ui/Container";
import BookingSidebar from "../components/BookingSidebar";
import BookingHeader from "../components/BookingHeader";
import BookingTabsNav from "../components/BookingTabsNav";

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
    pathname?.split(`/dashboard/bookings/${bookingId}/`)[1]?.split("/")[0] ||
    "booking";

  return (
    <section className="py-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="col-span-3">
            <BookingSidebar booking={booking} />
          </div>

          <div className="col-span-9 grid grid-cols-1 ">
            <BookingHeader booking={booking} />

            {/* ✅ real route tabs */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
              <BookingTabsNav bookingId={bookingId} activeTab={activeTab} />
            </div>

            {/* ✅ tab page content */}
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
