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
import { useMemo, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";

// Function to fetch instructor stats from API
const fetchAdminStats = async ( days) => {
const res = await axios.get(
  `/api/stats/admin-stats?days=${days}`
);
  return res.data;
};

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
      <div className="p-4 sm:p-6 min-w-0">{children}</div>
    </div>
  );
}

function RangeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Today", days: 1 },
    { label: "Last 7 Days", days: 7 },
    { label: "Last 14 Days", days: 14 },
    { label: "Last 30 Days", days: 30 },
  ];

  const current = options.find((o) => o.days === value) || options[1];

  return (
    <div className="relative">
      <button
        type="button"
        className="text-xs sm:text-sm text-gray-700 flex items-center gap-2 hover:text-gray-900"
        onClick={() => setOpen((v) => !v)}
      >
        {current.label} <FaChevronDown className="text-[10px]" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-border-color rounded-md shadow-lg z-50 overflow-hidden">
          {options.map((o) => (
            <button
              key={o.days}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                o.days === value ? "bg-gray-50 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(o.days);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [range, setRange] = useState(7);
  const [statsData, setStatsData] = useState(null);

useEffect(() => {
  const getStats = async () => {
    const data = await fetchAdminStats(range);
    setStatsData(data);
  };

  getStats();
}, [range]);


  const revenueTotals = useMemo(() => {
    if (!statsData) return { totalSales: 0, webBookings: 0 };
 const webSales = statsData.revenueData.reduce((s, x) => s + (x.webSales || 0), 0);
   
    const totalSales = statsData.revenueData.reduce(
      (s, x) => s + (x.webSales || 0) + (x.manualSales || 0),
      0
    );
    const webBookings = statsData.revenueData.reduce((s, x) => s + (x.webBookings || 0), 0);

    return { totalSales, webBookings,webSales };
  }, [statsData]);
  const monthLabel = useMemo(() => {
  const key = statsData?.monthStats?.month; // "2026-02"
  if (!key) return "This Month";
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, (m || 1) - 1, 1);
  return d.toLocaleDateString("en-AU", { month: "long" }); // "February"
}, [statsData?.monthStats?.month]);
console.log(statsData);
  if (!statsData) {
    return <LoadingSpinner/>;
  }

  return (
   <section className="">
      <Container>
        {/* Header Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
   <StatCard
    title="Total Bookings (All Time)"
    value={statsData?.generalStats?.totalBookings ?? 0}
  />
  <StatCard
    title={`${monthLabel} Active Bookings`}
    value={statsData?.monthStats?.activeBookings ?? 0}
  />
  <StatCard
    title={`${monthLabel} Paid Bookings`}
    value={statsData?.monthStats?.paidBookings ?? 0}
  />
 
  <StatCard
    title={`${monthLabel} Cancelled Bookings`}
    value={statsData?.monthStats?.cancelledBookings ?? 0}
  />
</div>
        <div className="mt-6 space-y-6">
          {/* Top Revenue Card */}
          <Card
            title="Total Revenue"
            right={<RangeSelect value={range} onChange={setRange} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500">Sales</div>
                <div className="text-2xl font-extrabold text-gray-900">${revenueTotals?.totalSales?.toLocaleString()}</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-gray-700">Web Sales</span>
                  <span className="font-semibold text-gray-900">
                    ${revenueTotals?.webSales?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Bookings</div>
                <div className="text-2xl font-extrabold text-gray-900">  {revenueTotals.webBookings}</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-gray-700">Web Bookings</span>
                  <span className="font-semibold text-gray-900">
                    {revenueTotals.webBookings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-0 w-full h-60 sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                <BarChart data={statsData.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} interval={3} />
                  <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
  formatter={(value, name) => {
    if (name === "Web Sales") {
      return [`$${Number(value).toLocaleString()}`, name];
    }
    return [Number(value).toLocaleString(), name];
  }}
/>
                  <Legend />
                  <Bar dataKey="webSales" name="Web Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar
  dataKey="webBookings"
  name="Web Bookings"
  fill="#10b981"
  radius={[4, 4, 0, 0]}
/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bottom Activity Card */}
          <Card
            title="New Booking Activity"
            right={<RangeSelect value={range} onChange={setRange} />}
          >
            <div className="min-w-0 h-60 w-full sm:h-[280px] ">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statsData.activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalBookings"
                    name="Total Bookings"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="webBookings"
                    name="Web Bookings"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    name="Cancelled"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div className="bg-white border border-border-color rounded-lg shadow-sm p-4 min-w-0">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 text-xl sm:text-2xl font-extrabold text-gray-900">
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}