import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Link from "next/link";
import React from "react";
import {FaRightLong} from "react-icons/fa6";

const whatWeOfferLinks = [
  {
    id: 1,
    label: "Car Hire for Instructor",
    pathname: "/services/car-hire-for-instructor",
  },

  {
    id: 2,
    label: "Driving Test Assessment",
    pathname: "/services/driving-test-assessment",
  },
  {
    id: 3,
    label: "Car Hire for Instructor",
    pathname: "/services/car-hire-for-instructor",
  },
  {
    id: 4,
    label: "Driving Test Package",
    pathname: "/services/driving-test-package",
  },
  {
    id: 5,
    label: "Driving Test Package",
    pathname: "/services/driving-test-package",
  },
  {
    id: 6,
    label: "Automatic Driving Lessons",
    pathname: "/services/automatic-driving-lessons",
  },
];
export default function WhatWeOffer({
  sectionTitle,
  sectionSubtitle,
  services,
  className,
  extra
}) {
  return (
    <section className={`relative py-20 bg-white overflow-hidden ${className}`}>
      <Container>
        <SectionHeader
          className={`mt-0!`}
          title={`${sectionTitle ? sectionTitle : "What We Offer"}`}
          subtitle={`${
            sectionSubtitle
              ? sectionSubtitle
              : "We offer a range of services designed to make your learning experience comfortable, convenient, and safe. Every lesson is structured to enhance confidence and practical driving skills while keeping your needs in mind."
          }
          `}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative 
  bg-base-300 
  rounded-xl p-8 lg:p-12 
  shadow 
  transition-all duration-500
   hover:-translate-y-2 border-b-8 border-primary"
            >
              <div
                className="w-14 h-14 mb-5 flex items-center justify-center rounded-2xl
bg-primary shadow-lg"
              >
                {service.icon}
              </div>
              <Link href={whatWeOfferLinks[index]?.pathname || "/services"}>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              </Link>
              <p className="text-neutral">{service.description}</p>
            </div>
          ))}
        </div>
        {extra && extra}
      </Container>
    </section>
  );
}
