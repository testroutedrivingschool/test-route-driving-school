"use client";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaClipboardCheck,
  FaCogs,
  FaCarSide,
} from "react-icons/fa";

import roadLine from "@/app/assets/line.avif";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";

const steps = [
  {
    step: "STEP 1",
    title: "SELECT YOUR COURSE",
    desc: "Browse our courses or contact us for guidance on selecting the ideal driving package that suits your learning needs and schedule.",
    icon: <FaMapMarkerAlt />,
    align: "left",
  },
  {
    step: "STEP 2",
    title: "BOOK YOUR COURSE",
    desc: "Secure your driving lessons with a small deposit. Our booking process is quick, simple, and designed to get you started efficiently.",
    icon: <FaClipboardCheck />,
    align: "right",
  },
  {
    step: "STEP 3",
    title: "LET US GET TO WORK",
    desc: "Your dedicated booking manager arranges your lessons. We coordinate schedules and instructors to ensure smooth, structured, and personalised learning.",
    icon: <FaCogs />,
    align: "left",
  },
  {
    step: "STEP 4",
    title: "GET DRIVING!",
    desc: "Start your lessons with confidence. Learn safely in Sydney Suburbs and the surrounding Sydney suburbs, mastering skills step by step under the guidance of experts.",
    icon: <FaCarSide />,
    align: "right",
  },
];

export default function HowItWorks() {
  return (
    <section className="pb-17">
        <SectionHeader
  title="Our Simple 4-Step Learning Process"
  subtitle="From booking your lesson to driving with confidence"
/>
      <Container className={` relative`}>

        {/* MIDDLE LINE IMAGE */}
        <div className="absolute left-1/2 top-1 -translate-x-1/2 h-full hidden lg:block">
          <Image
            src={roadLine}
            alt="Road line"
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        <div className="mt-8 space-y-10 lg:space-y-15 relative z-10 ">
          {steps.map((item, index) => (
  <div key={index} className="lg:flex items-center">

    {/* LEFT SIDE */}
    <div className=" flex-1 lg:pr-12 text-left">
      {item.align === "left" && (
        <div className="flex flex-row-reverse items-start justify-start lg:justify-end gap-4">
         
          <div>
            <p className="text-sm text-gray-500 font-semibold">
              {item.step}
            </p>
            <h3 className="text-xl font-bold text-primary mt-1">
              {item.title}
            </h3>
            <p className="text-neutral mt-2 max-w-lg">
              {item.desc}
            </p>
          </div>
           <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl shrink-0">
            {item.icon}
          </div>
        </div>
      )}
    </div>

    {/* CENTER SPACE (for road image only) */}
    <div className="w-10 shrink-0" />

    {/* RIGHT SIDE */}
    <div className="flex-1 lg:pl-12 text-left">
      {item.align === "right" && (
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl shrink-0">
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">
              {item.step}
            </p>
            <h3 className="text-xl font-bold text-primary mt-1">
              {item.title}
            </h3>
            <p className="text-neutral mt-2 max-w-lg">
              {item.desc}
            </p>
          </div>
        </div>
      )}
    </div>

  </div>
))}


        </div>
      </Container>
    </section>
  );
}
