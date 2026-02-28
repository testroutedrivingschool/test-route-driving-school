"use client";

import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";





function Card({ title, children }) {
  return (
    <div className="bg-white border border-border-color rounded-xl p-5 shadow-sm min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      
      </div>
      {children}
    </div>
  );
}
function StatRow({ label, value, labelClass = "", valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className={`text-gray-900 ${labelClass}`}>{label}</p>
      <p className={`font-medium text-gray-900 ${valueClass}`}>{value}</p>
    </div>
  );
}

export default function InstructorReportPage() {
  const { data: user } = useUserData();
    const instructorEmail = user?.email; // or user?.instructorEmail

  const { data, isLoading } = useQuery({
    queryKey: ["instructorStats", instructorEmail],
    enabled: !!instructorEmail,
    queryFn: async () => {
      const res = await axios.get(
        `/api/stats/instructor-stats?instructorEmail=${encodeURIComponent(instructorEmail)}`
      );
      return res.data;
    },
  });
  // put this near top (inside component)

  const websiteData = data?.websiteActivity || [];
  const bookingData = data?.bookingActivity || [];
  const monthStats = data?.monthStats;
  const generalStats = data?.generalStats;
  const monthTitle = (() => {
  const ym = monthStats?.month; 
  if (!ym) return "Monthly Statistics";
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString("en-AU", { month: "long" }); 
})();
  console.log(websiteData);
  console.log(bookingData);
  if (isLoading) return <LoadingSpinner/>;
  return (
    <section className="py-8">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Website Activity */}
        <Card title="Sales & Website Activity">
  <div className="h-80  min-w-0 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={websiteData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
      <XAxis
  dataKey="key"
  tickFormatter={(v) => websiteData.find(x => x.key === v)?.name || v}
/>
        <YAxis />
        <Tooltip
  labelFormatter={(key) => {
    const row = websiteData.find(x => x.key === key);
    return row ? `${row.name} (${row.key})` : key;
  }}
  formatter={(value, name) => {
    // Only add $ for sales fields
    if (name.includes("Sales")) {
      return [`$${Number(value).toLocaleString()}`, name];
    }

    return [value, name];
  }}
/>
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 20, fontSize: 15, lineHeight: "16px" }} />

        {/* bookings */}
        <Line type="monotone" dataKey="webBookings" stroke="#16a34a" strokeWidth={3} dot={false} name="Web Bookings" />
        <Line type="monotone" dataKey="manualBookings" stroke="#ea580c" strokeWidth={3} dot={false} name="Manual Bookings" />

        {/* sales */}
        <Line type="monotone" dataKey="webSales" stroke="#2563eb" strokeWidth={3} dot={false} name="Web Sales" />
        <Line type="monotone" dataKey="manualSales" stroke="#7c3aed" strokeWidth={3} dot={false} name="Manual Sales" />

        {/* optional total */}
        <Line type="monotone" dataKey="totalSales" stroke="#111827" strokeWidth={3} dot={false} name="Total Sales" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>

          {/* Booking Activity */}
          <Card title="Booking Activity">
            <div className="h-80  min-w-0 w-full">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={bookingData}  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                 <XAxis
  dataKey="key"
  tickFormatter={(v) => bookingData.find(x => x.key === v)?.name || v}
/>
                  <YAxis />
                  <Tooltip
  labelFormatter={(key) => {
    const row = bookingData.find(x => x.key === key);
    return row ? `${row.name} (${row.key})` : key;
  }}
/>
                  <Legend
  verticalAlign="bottom"
  align="center"
  wrapperStyle={{
    paddingTop: 20,
    fontSize: 15,
    lineHeight: "16px",
  }}
/>

                  <Line
  type="monotone"
  dataKey="bookings"
  stroke="#16a34a"   
  strokeWidth={3}
  dot={false}
  name="Bookings"
/>
<Line
  type="monotone"
  dataKey="attended"
  stroke="#2563eb"     
  strokeWidth={3}
  dot={false}
  name="Attended"
/>
<Line
  type="monotone"
  dataKey="cancelled"
  stroke="#7c3aed"    
  strokeWidth={3}
  dot={false}
  name="Cancelled"
/>
<Line
  type="monotone"
  dataKey="unattended"
  stroke="#ea580c"   
  strokeWidth={3}
  dot={false}
  name="Unattended"
/>

                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>


        {/* ✅ Statistics Cards (after charts) */}
<div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* January Statistics */}
  <div className="bg-white border border-border-color rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="text-xl">📊</span>
      <h3 className="text-lg font-bold text-gray-900">  {monthTitle} Statistics</h3>
    </div>

    <div className="border-t border-border-color my-4" />

    <div className="space-y-6 text-base">
<StatRow label="Active Bookings:" value={monthStats?.activeBookings ?? 0} />
<StatRow label="Booked Clients:" value={monthStats?.bookedClients ?? 0} />
<StatRow label="Paid Bookings:" value={monthStats?.paidBookings ?? 0} />
<StatRow label="Cancelled Bookings:" value={monthStats?.cancelledBookings ?? 0} />
<StatRow label="Unattended Bookings:" value={monthStats?.unattendedBookings ?? 0} />
    </div>
  </div>

  {/* General Statistics (takes 2 columns on large screens) */}
  <div className="lg:col-span-2 bg-white border border-border-color rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="text-xl">📈</span>
      <h3 className="text-lg font-bold text-gray-900">General Statistics</h3>
    </div>

    <div className="border-t border-border-color my-4" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-base">
      {/* Left column */}
      <div className="space-y-6">
        <StatRow label="Booked Clients:" value={generalStats?.bookedClients ?? 0} />
<StatRow label="Total Bookings:" value={generalStats?.totalBookings ?? 0} />
<StatRow label="Web Bookings:" value={generalStats?.webBookings ?? 0} />
<StatRow label="Paid Bookings:" value={generalStats?.paidBookings ?? 0} />
<StatRow label="Clients with Email:" value={generalStats?.clientsWithEmail ?? 0} />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <StatRow label="Newsletter Subscribers:" value={generalStats?.newsletterSubscribers ?? 0} />
<StatRow label="Clients with Email:" value={generalStats?.clientsWithEmail ?? 0} />
<StatRow label="Clients with Mobile Phones:" value={generalStats?.clientsWithMobile ?? 0} />
        
      </div>
    </div>
  </div>
</div>

      </Container>
    </section>
  );
}
