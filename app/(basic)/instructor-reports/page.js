"use client";

import { useUserData } from "@/app/hooks/useUserData";
import Container from "@/app/shared/ui/Container";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
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

function ReportMenuCard({ title, items }) {
  return (
    <div className=" border border-[#d9dde5] rounded-md overflow-hidden shadow-sm pb-2">
      <div className="px-4 py-4 border-b border-border-color">
        <h3 className="text-lg font-bold text-black">{title}</h3>
      </div>

      <div className="px-4 py-2 space-y-4">
        {items.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="block text-sm text-primary  transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              className="block text-left text-sm text-primary  transition-colors"
            >
              {item.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default function InstructorReportPage() {
  const { data: user } = useUserData();
  const instructorEmail = user?.email;

  const { data, isLoading } = useQuery({
    queryKey: ["instructorStats", instructorEmail],
    enabled: !!instructorEmail,
    queryFn: async () => {
      const res = await axios.get(
        `/api/stats/instructor-stats?instructorEmail=${encodeURIComponent(
          instructorEmail
        )}`
      );
      return res.data;
    },
  });

  const websiteData = data?.websiteActivity || [];
  const bookingData = data?.bookingActivity || [];
  const monthStats = data?.monthStats;
  const generalStats = data?.generalStats;

  const monthTitle = (() => {
    const ym = monthStats?.month;
    if (!ym) return "Monthly";
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleString("en-AU", { month: "long" });
  })();

  const reportSections = [
    {
      title: "Finances",
      items: [
        { label: "Income", href: "/instructor-reports/finances/income" },
        { label: "Income by Category", href: "/instructor-reports/finances/income-by-category" },
       
        { label: "Outstanding Payments", href: "/instructor-reports/finances/outstanding-payments" },
        { label: "Payout Summary", href: "/instructor-reports/finances/payout-summary" },
        { label: "Payout Details", href: "/instructor-reports/finances/payout-details" },
        { label: "Pending Payouts", href: "/instructor-reports/finances/pending-payouts" },
      ],
    },
    
    {
      title: "Instructor",
      items: [
        { label: "Booking Activity", href: "/reports/instructor/booking-activity" },
        { label: "Booked Services", href: "/reports/instructor/booked-services" },
        { label: "Cancellations", href: "/reports/instructor/cancellations" },
      ],
    },
    {
      title: "Clients",
      items: [
        { label: "New Clients", href: "/reports/clients/new-clients" },
        { label: "Client Bookings", href: "/reports/clients/client-bookings" },
       
        { label: "All Organisations", href: "/reports/clients/all-organisations" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Service Trends", href: "/reports/services/service-trends" },
      ],
    },
    {
      title: "Products",
      items: [
        { label: "Web Sales", href: "/reports/products/web-sales" },
        { label: "Sales", href: "/reports/products/sales" },
      ],
    },
    {
      title: "Logs",
      items: [
       
        { label: "Sent Emails", href: "/reports/logs/sent-emails" },
      ],
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="py-8">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          <Card title="Sales & Website Activity">
            <div className="w-full min-w-0 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={websiteData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="key"
                    tickFormatter={(v) =>
                      websiteData.find((x) => x.key === v)?.name || v
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(key) => {
                      const row = websiteData.find((x) => x.key === key);
                      return row ? `${row.name} (${row.key})` : key;
                    }}
                    formatter={(value, name) => {
                      if (name.includes("Sales")) {
                        return [`$${Number(value).toLocaleString()}`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: 20, fontSize: 15, lineHeight: "16px" }}
                  />
                  <Line type="monotone" dataKey="webBookings" stroke="#16a34a" strokeWidth={3} dot={false} name="Web Bookings" />
                  <Line type="monotone" dataKey="manualBookings" stroke="#ea580c" strokeWidth={3} dot={false} name="Manual Bookings" />
                  <Line type="monotone" dataKey="webSales" stroke="#2563eb" strokeWidth={3} dot={false} name="Web Sales" />
                  <Line type="monotone" dataKey="manualSales" stroke="#7c3aed" strokeWidth={3} dot={false} name="Manual Sales" />
                  <Line type="monotone" dataKey="totalSales" stroke="#111827" strokeWidth={3} dot={false} name="Total Sales" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Booking Activity">
            <div className="w-full min-w-0 h-80">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={bookingData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="key"
                    tickFormatter={(v) =>
                      bookingData.find((x) => x.key === v)?.name || v
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(key) => {
                      const row = bookingData.find((x) => x.key === key);
                      return row ? `${row.name} (${row.key})` : key;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: 20, fontSize: 15, lineHeight: "16px" }}
                  />
                  <Line type="monotone" dataKey="bookings" stroke="#16a34a" strokeWidth={3} dot={false} name="Bookings" />
                  <Line type="monotone" dataKey="attended" stroke="#2563eb" strokeWidth={3} dot={false} name="Attended" />
                  <Line type="monotone" dataKey="cancelled" stroke="#7c3aed" strokeWidth={3} dot={false} name="Cancelled" />
                  <Line type="monotone" dataKey="unattended" stroke="#ea580c" strokeWidth={3} dot={false} name="Unattended" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-border-color rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h3 className="text-lg font-bold text-gray-900">
                {monthTitle} Statistics
              </h3>
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

          <div className="lg:col-span-2 bg-white border border-border-color rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl">📈</span>
              <h3 className="text-lg font-bold text-gray-900">General Statistics</h3>
            </div>

            <div className="border-t border-border-color my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-base">
              <div className="space-y-6">
                <StatRow label="Booked Clients:" value={generalStats?.bookedClients ?? 0} />
                <StatRow label="Total Bookings:" value={generalStats?.totalBookings ?? 0} />
                <StatRow label="Web Bookings:" value={generalStats?.webBookings ?? 0} />
                <StatRow label="Paid Bookings:" value={generalStats?.paidBookings ?? 0} />
                <StatRow label="Clients with Email:" value={generalStats?.clientsWithEmail ?? 0} />
              </div>

              <div className="space-y-6">
                <StatRow label="Newsletter Subscribers:" value={generalStats?.newsletterSubscribers ?? 0} />
                <StatRow label="Clients with Email:" value={generalStats?.clientsWithEmail ?? 0} />
                <StatRow label="Clients with Mobile Phones:" value={generalStats?.clientsWithMobile ?? 0} />
              </div>
            </div>
          </div>
        </div>

        {/* New reports section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {reportSections.map((section) => (
            <ReportMenuCard
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}