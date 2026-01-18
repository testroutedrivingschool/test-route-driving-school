"use client";

import Container from "@/app/shared/ui/Container";
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
import { HiOutlineMenuAlt3 } from "react-icons/hi";



const websiteData = [
  { name: "Dec", webSales: 25, webBookings: 0 },
  { name: "Jan", webSales: 45, webBookings: 0 },
  { name: "Feb", webSales: 31, webBookings: 0 },
  { name: "Mar", webSales: 33, webBookings: 0 },
  { name: "Apr", webSales: 24, webBookings: 0 },
  { name: "May", webSales: 23, webBookings: 0 },
  { name: "Jun", webSales: 19, webBookings: 0 },
  { name: "Jul", webSales: 27, webBookings: 1 },
  { name: "Aug", webSales: 25, webBookings: 18 },
  { name: "Sep", webSales: 35, webBookings: 40 },
  { name: "Oct", webSales: 27, webBookings: 20 },
  { name: "Nov", webSales: 39, webBookings: 28 },
  { name: "Dec", webSales: 30, webBookings: 32 },
  { name: "Jan", webSales: 22, webBookings: 35 },
];

const bookingData = [
  { name: "Dec", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Jan", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Feb", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Mar", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Apr", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "May", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Jun", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Jul", bookings: 0, attended: 0, cancelled: 0, unattended: 0 },
  { name: "Aug", bookings: 40, attended: 38, cancelled: 2, unattended: 0 },
  { name: "Sep", bookings: 90, attended: 82, cancelled: 8, unattended: 0 },
  { name: "Oct", bookings: 50, attended: 42, cancelled: 7, unattended: 1 },
  { name: "Nov", bookings: 85, attended: 72, cancelled: 11, unattended: 2 },
  { name: "Dec", bookings: 70, attended: 58, cancelled: 12, unattended: 0 },
  { name: "Jan", bookings: 100, attended: 90, cancelled: 8, unattended: 2 },
];

function Card({ title, children }) {
  return (
    <div className="bg-white border border-border-color rounded-xl p-5 shadow-sm">
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
  return (
    <section className="py-8">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Website Activity */}
          <Card title="Website Activity">
            <div className="h-80 ">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={websiteData}  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
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
  dataKey="webBookings"
  stroke="#16a34a"    
  strokeWidth={3}
  dot={false}
  name="Web Bookings"
/>
<Line
  type="monotone"
  dataKey="webSales"
  stroke="#2563eb"  
  strokeWidth={3}
  dot={false}
  name="Web Sales"
/>

                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Booking Activity */}
          <Card title="Booking Activity">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingData}  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
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
      <h3 className="text-lg font-bold text-gray-900">January Statistics</h3>
    </div>

    <div className="border-t border-border-color my-4" />

    <div className="space-y-6 text-base">
      <StatRow label="Active Bookings:" value="896" />
      <StatRow label="Booked Clients:" value="384" />
      <StatRow label="Paid Bookings:" value="762" />
      <StatRow label="Cancelled Bookings:" value="116" />
      <StatRow label="Unattended Bookings:" value="0" />
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
        <StatRow label="Booked Clients:" value="8,973" />
        <StatRow label="Total Bookings:" value="1,012" />
        <StatRow
          label="Web Bookings:"
          value="9,628"
          valueClass="text-primary"
          labelClass="text-primary"
        />
        <StatRow
          label="New Web Clients:"
          value="3,205"
          valueClass="text-primary"
          labelClass="text-primary"
        />
        <StatRow
          label="Clients with Web Accounts:"
          value="4,093"
          valueClass="text-primary"
          labelClass="text-primary"
        />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <StatRow label="Newsletter Subscribers:" value="7,087" />
        <StatRow label="Clients with Email:" value="8,973" />
        <StatRow
          label="Rejected Email Addresses:"
          value="192"
          valueClass="text-primary"
          labelClass="text-primary"
        />
        <StatRow label="Clients with Mobile Phones:" value="8,945" />
        <StatRow
          label="Rejected SMS Mobiles:"
          value="0"
          valueClass="text-primary"
          labelClass="text-primary"
        />
      </div>
    </div>
  </div>
</div>

      </Container>
    </section>
  );
}
