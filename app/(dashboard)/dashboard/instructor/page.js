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
import { useUserData } from "@/app/hooks/useUserData";

// Function to fetch instructor stats from API
const fetchInstructorStats = async (instructorEmail) => {
  const res = await fetch(`/api/stats/instructor-stats?instructorEmail=${instructorEmail}`);
  const data = await res.json();
  return data;
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
  const {data:userData,isLoading:isUserLoading} = useUserData();
  const [range, setRange] = useState("Last 7 Days");
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    if (isUserLoading) return;
    
    const getStats = async () => {
      const data = await fetchInstructorStats(userData?.email);
      setStatsData(data);
    };

    if (userData?.email) {
      getStats();
    }
  }, [userData?.email, isUserLoading]);


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
  if (!statsData) {
    return <div>Loading...</div>;
  }

  return (
   <section className="">
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
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-700" />
                  <span className="text-gray-700">Web Bookings</span>
                  <span className="font-semibold text-gray-900">
                    ${revenueTotals.webBookings.toLocaleString()}
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