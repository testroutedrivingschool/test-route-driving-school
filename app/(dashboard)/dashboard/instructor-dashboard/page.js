"use client";

import Container from "@/app/shared/ui/Container";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const days = [
  "20 Dec",
  "21 Dec",
  "22 Dec",
  "23 Dec",
  "24 Dec",
  "25 Dec",
  "26 Dec",
  "27 Dec",
  "28 Dec",
  "29 Dec",
  "30 Dec",
  "31 Dec",
  "01 Jan",
  "02 Jan",
  "03 Jan",
  "04 Jan",
  "05 Jan",
  "06 Jan",
  "07 Jan",
  "08 Jan",
  "09 Jan",
  "10 Jan",
  "11 Jan",
  "12 Jan",
  "13 Jan",
  "14 Jan",
  "15 Jan",
  "16 Jan",
  "17 Jan",
  "18 Jan",
  "19 Jan",
  "20 Jan",
];

const revenueData = [
  { d: "20 Dec", webSales: 0, webBookings: 0 },
  { d: "21 Dec", webSales: 220, webBookings: 0 },
  { d: "22 Dec", webSales: 0, webBookings: 0 },
  { d: "23 Dec", webSales: 160, webBookings: 0 },
  { d: "24 Dec", webSales: 0, webBookings: 0 },
  { d: "25 Dec", webSales: 0, webBookings: 0 },
  { d: "26 Dec", webSales: 0, webBookings: 0 },
  { d: "27 Dec", webSales: 0, webBookings: 0 },
  { d: "28 Dec", webSales: 0, webBookings: 0 },
  { d: "29 Dec", webSales: 0, webBookings: 0 },
  { d: "30 Dec", webSales: 0, webBookings: 0 },
  { d: "31 Dec", webSales: 0, webBookings: 0 },
  { d: "01 Jan", webSales: 180, webBookings: 0 },
  { d: "02 Jan", webSales: 260, webBookings: 0 },
  { d: "03 Jan", webSales: 240, webBookings: 0 },
  { d: "04 Jan", webSales: 0, webBookings: 0 },
  { d: "05 Jan", webSales: 300, webBookings: 0 },
  { d: "06 Jan", webSales: 280, webBookings: 0 },
  { d: "07 Jan", webSales: 0, webBookings: 0 },
  { d: "08 Jan", webSales: 0, webBookings: 0 },
  { d: "09 Jan", webSales: 0, webBookings: 0 },
  { d: "10 Jan", webSales: 320, webBookings: 0 },
  { d: "11 Jan", webSales: 340, webBookings: 0 },
  { d: "12 Jan", webSales: 360, webBookings: 0 },
  { d: "13 Jan", webSales: 380, webBookings: 0 },
  { d: "14 Jan", webSales: 220, webBookings: 0 },
  { d: "15 Jan", webSales: 240, webBookings: 0 },
  { d: "16 Jan", webSales: 260, webBookings: 0 },
  { d: "17 Jan", webSales: 280, webBookings: 0 },
  { d: "18 Jan", webSales: 210, webBookings: 0 },
  { d: "19 Jan", webSales: 230, webBookings: 0 },
  { d: "20 Jan", webSales: 250, webBookings: 0 },
];

const activityData = [
  { d: "10 Jan", totalBookings: 28, webBookings: 12, cancelled: 2 },
  { d: "11 Jan", totalBookings: 22, webBookings: 10, cancelled: 1 },
  { d: "12 Jan", totalBookings: 18, webBookings: 9, cancelled: 0 },
  { d: "13 Jan", totalBookings: 20, webBookings: 10, cancelled: 1 },
  { d: "14 Jan", totalBookings: 24, webBookings: 11, cancelled: 1 },
  { d: "15 Jan", totalBookings: 19, webBookings: 9, cancelled: 0 },
  { d: "16 Jan", totalBookings: 15, webBookings: 7, cancelled: 0 },
  { d: "17 Jan", totalBookings: 33, webBookings: 14, cancelled: 2 },
  { d: "18 Jan", totalBookings: 26, webBookings: 12, cancelled: 1 },
  { d: "19 Jan", totalBookings: 21, webBookings: 10, cancelled: 1 },
  { d: "20 Jan", totalBookings: 18, webBookings: 9, cancelled: 0 },
];

function Card({ title, right, children }) {
  return (
    <div className="bg-white border border-border-color rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-3 border-b border-border-color flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900">
            {title}
          </h2>
        </div>
        {right}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function RangeSelect({ value, onChange }) {
  return (
    <button
      type="button"
      className="text-xs sm:text-sm text-gray-700 flex items-center gap-2 hover:text-gray-900"
      onClick={() => {
        // simple toggle demo
        onChange(value === "Last 7 Days" ? "Last 30 Days" : "Last 7 Days");
      }}
    >
      {value} <FaChevronDown className="text-[10px]" />
    </button>
  );
}

export default function InstructorDashboard() {
  const [range, setRange] = useState("Last 7 Days");

  const revenueTotals = useMemo(() => {
    const webSales = revenueData.reduce((s, x) => s + (x.webSales || 0), 0);
    const webBookings = revenueData.reduce((s, x) => s + (x.webBookings || 0), 0);
    return { webSales, webBookings };
  }, []);

  return (
    <section className="py-8">
      <Container>
        <div className="space-y-6">
          {/* Top Revenue Card */}
          <Card
            title="Total Revenue"
            right={<RangeSelect value={range} onChange={setRange} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500">Sales</div>
                <div className="text-2xl font-extrabold text-gray-900">$0</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-gray-700">Web Sales</span>
                  <span className="font-semibold text-gray-900">
                    ${revenueTotals.webSales.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Bookings</div>
                <div className="text-2xl font-extrabold text-gray-900">$561</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-700" />
                  <span className="text-gray-700">Web Bookings</span>
                  <span className="font-semibold text-gray-900">
                    ${revenueTotals.webBookings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} interval={3} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="webSales" name="Web Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="webBookings" name="Web Bookings" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bottom Activity Card */}
          <Card
            title="New Booking Activity"
            right={<RangeSelect value={range} onChange={setRange} />}
          >
            <div className="h-60 sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalBookings" name="Total Bookings" stroke="#16a34a" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="webBookings" name="Web Bookings" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#a855f7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
