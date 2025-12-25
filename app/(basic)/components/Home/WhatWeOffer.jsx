import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import React from "react";
import {
  FaCar,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaCarSide,
  FaFileAlt,
  FaGift,
} from "react-icons/fa";

const services = [
  {
    icon: <FaCar className="w-8 h-8 text-white" />,
    title: "Dual-Controlled Vehicles",
    description:
      "All lessons are conducted in a safe and modern dual-controlled vehicle. A dual-controlled vehicle allows instructors to break and slow the car if necessary, adding to the safety of our lessons.",
  },
  {
    icon: <FaClipboardCheck className="w-8 h-8 text-white" />,
    title: "Driving Test Assessment",
    description:
      "Our accredited qualified instructors are able to do your driving assessment and will give you an assessment report so you know what areas you need to work on to pass your driving test. Click here to book.",
  },
  {
    icon: <FaMapMarkerAlt className="w-8 h-8 text-white" />,
    title: "Pick up and Drop off",
    description:
      "Each driving lesson includes pick up and drop off within our service area. We provide driving lessons throughout Sydney suburbs including Rockdale, Bankstown, Newtown and more!",
  },
  {
    icon: <FaCarSide className="w-8 h-8 text-white" />,
    title: "Car Hire",
    description:
      "Use one of our modern vehicles for your driving test with our Test Day Packages. If you are a driving instructor or supervisor, we can also rent out dual-controlled Kia, Toyota Hybrid and Nissan vehicles in a pinch!",
  },
  {
    icon: <FaFileAlt className="w-8 h-8 text-white" />,
    title: "Driving Test Support",
    description:
      "We can help you prepare for your driving test with our professional driving lessons, as well as provide you with test support on your test day. Our test day packages include a warm-up lesson and car hire for the test.",
  },
  {
    icon: <FaGift className="w-8 h-8 text-white" />,
    title: "Lesson Packages",
    description:
      "To help make driving lessons more affordable, we offer generous discounts for multiple lesson purchases. We offer 5 hours, 10 hours and 20 hours lesson packages, which can save you up to $140.",
  },
];

export default function WhatWeOffer() {
  return (
    <section className="relative py-20 bg-base-300 overflow-hidden">
    

      <Container>
        <SectionHeader
        className={`mt-0!`}
          title={`What We Offer`}
          subtitle={` Reliable Services Designed for Your Convenience and Comfort
          `}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative 
  bg-white 
   
  rounded-xl p-8 lg:p-12 
  shadow-xl 
  transition-all duration-500
   hover:-translate-y-2 border-b-8 border-primary"
            >
              <div
                className="w-14 h-14 mb-5 flex items-center justify-center rounded-2xl
bg-primary shadow-lg"
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-neutral">{service.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
