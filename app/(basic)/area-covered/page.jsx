"use client";

import React, {useState} from "react";

import {
  FaMapMarkerAlt,
  FaCar,
  FaCheckCircle,
  FaSearch,
  FaClock,
  FaUsers,
  FaCarSide,
  FaClipboardCheck,
  FaFileAlt,
  FaGift,
} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";

import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import SecondaryBtn from "@/app/shared/Buttons/SecondaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import Faq from "@/app/shared/FaqSection";
import Link from "next/link";
import WhatWeOffer from "../components/Home/WhatWeOffer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

const faqs = [
  {
    question: "Which Sydney suburbs do you cover for driving lessons?",
    answer:
      <>
      Test Route serves over 80 Sydney suburbs.
 Coverage includes Southern Sydney, Inner West, Eastern Suburbs, and Sutherland Shire.
 Local instructors know nearby test routes and traffic patterns.
      </>,
  },


  {
    question: "Can you find a driving instructor near you easily?",
    answer:
      <>
      Yes, instructors operate across multiple Sydney locations.
 Lessons are available close to your home, school, or workplace.
 Pickup and drop-off make learning more convenient.

      </>,
  },
  {
    question: "Do you offer driving lessons for beginners in all areas?",
    answer:
      <>
       Beginner lessons are available in all service suburbs.
 Training starts with basic controls and road awareness.
 Confidence builds through guided local practice.
      </>,
  },
  {
    question: "Are lesson times flexible in different Sydney suburbs?",
    answer:
      <>
 Weekday, evening, and weekend lessons are available.
 Schedules adjust to your availability and learning pace.
 Custom plans support steady progress.
      </>,
  },
  {
    question: "Do you provide the same quality service in every location?",
    answer:
     <>
     All instructors follow the same training standards.
 Modern dual-controlled vehicles are used in every suburb.
 Lesson quality remains consistent across Sydney.
     </>,
  },



];

const zones = [
  {name: "South", count: 18, color: "bg-blue-100 text-blue-700"},
  {name: "Sutherland", count: 7, color: "bg-green-100 text-green-700"},
  {name: "East", count: 5, color: "bg-purple-100 text-purple-700"},
  {name: "Inner West", count: 5, color: "bg-orange-100 text-orange-700"},
  {name: "South West", count: 1, color: "bg-red-100 text-red-700"},
];
const services = [
  {
    icon: <FaCar className="w-8 h-8 text-white" />,
    title: "Dual-Controlled Vehicles",
    description:
      <>
       Learn in modern, <Link className="font-semibold underline px-1" href={`/services/car-hire-for-instructor`}>dual-controlled cars</Link> that maximise your safety. Your instructor can take control whenever needed, allowing you to practise confidently and focus on improving your driving skills efficiently.
      </>,
  },
  {
    icon: <FaClipboardCheck className="w-8 h-8 text-white" />,
    title: "Driving Test Assessment",
    description: (
      <>
        Our certified instructors provide thorough driving assessments with
        detailed feedback. You’ll know the areas needing improvement to pass
        your test confidently.{" "}
        <Link
          href="/packages"
          className="text-primary font-semibold underline hover:text-primary-focus"
        >
          Book your assessment
        </Link>{" "}
        now to get started.
      </>
    ),
  },
  {
    icon: <FaMapMarkerAlt className="w-8 h-8 text-white" />,
    title: "Pickup and Drop-off",
    description:
      "We offer convenient pickup and drop-off services within Kogarah and nearby Sydney suburbs. Areas include Rockdale, Bankstown, Newtown, and more, making your lessons hassle-free and time-efficient.",
  },
  {
    icon: <FaCarSide className="w-8 h-8 text-white" />,
    title: "Car Hire for Test Day",
    description:
      "Rent our modern dual-controlled Kia, Toyota Hybrid, or Nissan cars for your driving test. This ensures you feel comfortable, safe, and fully prepared for your practical exam.",
  },
  {
    icon: <FaFileAlt className="w-8 h-8 text-white" />,
    title: "Driving Test Support",
    description:
      "We provide full driving test support, including warm-up lessons and step-by-step guidance. Our instructors help you feel confident, focused, and prepared to pass your test successfully on the day of the exam.",
  },
  {
    icon: <FaGift className="w-8 h-8 text-white" />,
    title: "Lesson Packages",
    description:
      "Save with our 5, 10, or 20-hour lesson packages. You can enjoy structured, high-quality lessons while saving up to $140, giving you more affordable and flexible learning options.",
  },
];
export default function AreaCovered() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const {data:locations,isLoading} = useQuery({
    queryKey:["locations"],
    queryFn:async()=>{
      const res = await axios.get("/api/locations");
      return res.data
    }
  })
  if(isLoading) return <LoadingSpinner/>
  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesZone =
      selectedZone === "All" || location.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const displayedLocations = showMore
    ? filteredLocations
    : filteredLocations.slice(0, 12);

  return (
    <div className="">
      <PageHeroSection
        title="Areas Covered by Driving School in Sydney Suburbs"
        subtitle={<>
     Our <Link className="font-semibold underline px-1" href={`/`}>driving school</Link> provides professional lessons across Sydney suburbs. You’ll practise real-life scenarios, learn local traffic rules, and navigate test routes with guidance from expert instructors. Pickup and drop-off services make every lesson stress-free.
        </>}
      />

      {/* Main Content */}
      <section className="pt-16">
        <Container>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <FaMapMarkerAlt className="text-primary" />,
                value: "80+",
                label: "Suburbs Covered",
              },
              {
                icon: <FaCar className="text-green-600" />,
                value: "30+",
                label: "Service Areas",
              },
              {
                icon: <FaClock className="text-purple-600" />,
                value: "24/7",
                label: "Flexible Booking",
              },
              {
                icon: <FaUsers className="text-orange-600" />,
                value: "2,500+",
                label: "Students Served",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-border-color text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold  mb-1">
                  {stat.value}
                </div>
                <div className="text-neutral">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Content */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold  mb-6">
                  Comprehensive Areas Covered by Driving School for 
                  <span className="text-primary px-1">Driving Lessons</span>
                </h2>

                <p className="text-neutral  leading-relaxed mb-6">
                  We serve over 80 Sydney suburbs, offering professional <strong>driving classes</strong> in Southern Sydney, Inner West, Eastern Suburbs, and Sutherland Shire. Whether you are a student, professional, or nervous beginner, our instructors help you feel ready for real-life driving and your test
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold ">
                  Why Choose Our Service:
                </h3>
                <p className="text-neutral  leading-relaxed mt-2">
                  Choosing the <Link className="font-semibold underline px-1" href={`/`}>best driving school near me</Link> ensures quality instruction and results. We provide flexible schedules, modern dual-controlled vehicles, and instructors with extensive local road knowledge. Every lesson is tailored to your learning pace and goals.
                </p>
                {[
                  "Pick-up and drop-off included in all covered areas",
                  "Local knowledge of test routes in each suburb",
                  "Flexible scheduling to suit your location",
                  "Modern dual-controlled vehicles for every lesson",
                  "Experienced instructors familiar with local roads",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 shrink-0" />
                    <span className="text-black">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Locations */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 h-full">
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral" />
                      <input
                        type="text"
                        placeholder="Search for your suburb..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="All">All Zones</option>
                      {zones.map((zone) => (
                        <option key={zone.name} value={zone.name}>
                          {zone.name} ({zone.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-sm text-neutral mb-2">
                    Showing {displayedLocations.length} of{" "}
                    {filteredLocations.length} suburbs
                    {selectedZone !== "All" && ` in ${selectedZone}`}
                  </div>
                </div>

                {/* Locations Grid */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {displayedLocations.map((location, index) => {
                      const locSlug = location.name
                        .toLowerCase()
                        .replace(/,/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "");

                      return (
                        <Link
                          key={index}
                          href={`/driving-school-in/${locSlug}`}
                          className="group flex items-center gap-2 p-3 bg-base-300 rounded-lg hover:bg-primary/10 cursor-pointer  border border-transparent transition-all"
                        >
                          <FaMapMarkerAlt className="text-primary " />
                          <div>
                            <div className="font-medium ">
                              {location.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {location.zone}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {filteredLocations.length > 12 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-6 w-full py-3 border-2 border-border-color text-primary font-semibold rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                      {showMore
                        ? "Show Less"
                        : `Show All ${filteredLocations.length} Suburbs`}
                      <FiChevronRight
                        className={`transform ${
                          showMore ? "rotate-90" : ""
                        } transition-transform`}
                      />
                    </button>
                  )}
                </div>

                {/* Not Found Your Suburb? */}
                {filteredLocations.length === 0 && (
                  <div className="text-center py-8">
                    <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold  mb-2">
                      Suburb Not Found?
                    </h4>
                    <p className="text-neutral mb-4">
                      Don&apos;t see your suburb in the list? We might still
                      service your area.
                    </p>
                    <button onClick={()=>router.push("/company/contact")} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition-colors">
                      Contact Us to Check 
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
       <section className="mt-10 md:mt-15 py-12 bg-primary/10">
              <Container>
                <div className="space-y-4">
                  <div>
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold  mb-4">
                         Flexible Automatic Driving Lessons Across Sydney
                      </h3>
                      <p className="text-gray-700 text-lg mb-3">
                        We offer automatic <a className="location-link" href={"https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/learner-driver-licence"} >driving lessons</a> throughout Sydney, including weekdays, evenings, and weekends. Our professional instructors adjust each lesson to your pace, teaching city driving, parking, and test route practice so you feel confident on your driving test day.
                      </p>
                    </div>
      
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold  mb-4">
                        Flexible Schedules and Tailored Learning Plans
                      </h3>
                      <p className="text-gray-700 text-lg mb-3">
                        Every learner is unique, so we create custom lesson plans based on your skills and progress. You’ll practise real-life scenarios, receive continuous feedback, and enjoy lessons that fit your schedule, including evenings and weekends. By the end, you’ll be ready for both your driving test and independent driving. Test Route Driving School is a trusted local driving school supporting you every step of the way.
                      </p>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
      <MovingCar />
      <WhatWeOffer sectionSubtitle={`We provide a variety of services to make your learning experience safe, convenient, and confidence-building, ensuring you gain practical skills while enjoying every lesson with professional guidance.`} services={services} extra={<p className="mt-6">
        Every service is designed to make your driving lessons productive, enjoyable, and tailored to your unique <a className="location-link" href={"https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/learner-driver-licence"}>driving lessons</a> pace and goals.
        </p>}/>
      <WhyChooseUs subTitle={<>
        We are considered one of the <strong>best driving schools</strong> in Sydney suburbs. Our certified instructors teach safe, efficient driving skills, cover all theoretical and practical lessons, guide you through the Australian license process, and provide flexible lesson schedules with modern vehicles for maximum comfort. Whether you’re searching for a local driving school or a driving instructor near me, we provide professional lessons tailored to your needs. 
        </>} className={`bg-base-300`}/>
      <section className="mt-16 mb-16">
        <Container>
          {/* CTA Section */}
          <div className=" bg-primary rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Driving Journey?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
           Book your first lesson today and enjoy professional <Link className="font-semibold underline px-1" href={`/services/automatic-driving-lessons`}>driving lessons</Link>  in your local area. Our instructors help you feel confident, prepared, and comfortable on the road. Start <a className="location-link" href={"https://www.gov.uk/driving-lessons-learning-to-drive/taking-driving-lessons"} >learning</a> today with Test Route Driving School.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SecondaryBtn>Check Availability</SecondaryBtn>
              <OutlineBtn
                className={`border-white! text-white hover:bg-secondary hover:border-secondary!`}
              >
                Contact With Our Team
              </OutlineBtn>
            </div>
          </div>
        </Container>
      </section>
      <Faq faqs={faqs}/>
    </div>
  );
}
