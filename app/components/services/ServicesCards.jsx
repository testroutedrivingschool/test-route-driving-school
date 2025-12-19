"use client";

import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Link from "next/link";
import {
  FaCar,
  FaClipboardCheck,
  FaRoad,
  FaParking,
  FaMoon,
  FaCity,
  FaUserTie,
} from "react-icons/fa";

const services = [
  {
    id: 1,
    label: "Automatic Driving Lessons",
    pathname: "/services/automatic-driving-lessons",
    icon: FaCar,
  },
  {
    id: 2,
    label: "Driving Test Assessment",
    pathname: "/services/driving-test-assessment",
    icon: FaClipboardCheck,
  },
  {
    id: 3,
    label: "Driving Test Package",
    pathname: "/services/driving-test-package",
    icon: FaRoad,
  },
  {
    id: 4,
    label: "Car Hire for Instructor",
    pathname: "/services/car-hire-for-instructor",
    icon: FaUserTie,
  },
  {
    id: 5,
    label: "Parking Package",
    pathname: "/services/parking-package",
    icon: FaParking,
  },
  {
    id: 6,
    label: "Highway Package",
    pathname: "/services/highway-package",
    icon: FaRoad,
  },
  {
    id: 7,
    label: "Night Driving Lesson",
    pathname: "/services/night-driving-lesson",
    icon: FaMoon,
  },
  {
    id: 8,
    label: "City Driving Package",
    pathname: "/services/city-driving-package",
    icon: FaCity,
  },
];

export default function ServicesCards() {
  return (
    <section className="pb-16 ">
      <Container>
        <SectionHeader
          title={`Our Driving Services`}
          subtitle={`Professional lessons tailored for every driving need`}
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isLastTwo =
              services.length % 3 === 2 && index >= services.length - 2;

            // Normal cards
            if (!isLastTwo) {
              return (
                <div
                  key={service.id}
                  className="group bg-base-300 rounded-xl p-6 shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                    <Icon size={26} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition">
                    {service.label}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Learn with expert instructors, structured lessons, and
                    flexible packages.
                  </p>

                  <Link
                    href={service.pathname}
                    className="inline-flex items-center gap-2 mt-5 text-primary font-medium group-hover:gap-3 transition-all"
                  >
                    Learn more →
                  </Link>
                </div>
              );
            }

            // Last two cards wrapped in a 2-column container
            return null;
          })}

          {/* Last two (50% / 50%) */}
          {services.length % 3 === 2 && (
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {services.slice(-2).map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="group bg-base-300 rounded-xl p-6 shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                      <Icon size={26} />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition">
                      {service.label}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      Learn with expert instructors, structured lessons, and
                      flexible packages.
                    </p>

                    <Link
                      href={service.pathname}
                      className="inline-flex items-center gap-2 mt-5 text-primary font-medium group-hover:gap-3 transition-all"
                    >
                      Learn more →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
