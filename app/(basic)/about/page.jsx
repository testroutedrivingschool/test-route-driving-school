import Image from "next/image";

import aboutImg from "@/app/assets/whychooseus-test-route-driving-school.jpg";
import {
  FaCar,
  FaUserGraduate,
  FaShieldAlt,
  FaAward,
  FaUsers,
} from "react-icons/fa";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import WhatWeOffer from "../components/Home/WhatWeOffer";
import MovingCar from "@/app/shared/MovingCar";
import Faq from "@/app/shared/Faq";


export default function About() {
  const features = [
    {
      icon: <FaCar className="text-blue-600" />,
      title: "Modern Fleet",
      description: "Latest dual-controlled vehicles",
    },
    {
      icon: <FaUserGraduate className="text-green-600" />,
      title: "Expert Instructors",
      description: "Certified & experienced professionals",
    },
    {
      icon: <FaShieldAlt className="text-purple-600" />,
      title: "Safety First",
      description: "Defensive driving focus",
    },
    {
      icon: <FaAward className="text-yellow-600" />,
      title: "High Pass Rate",
      description: "98% first-time success",
    },
  ];

  return (
    <>
      <PageHeroSection title={"About Us"} subtitle={`Professional Driving Lessons You Can Trust`}/>
      <section className="pt-16 ">
        <Container>
          {/* Header */}
          <SectionHeader
            title="About Test Route Driving School"
            subtitle="Your trusted partner in driver education since 2012"
            className="mt-0! mb-4"
          />

          {/* Main Section: Image + Intro Content */}
          <section className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 mb-12">
            {/* Image Section */}
            <div className="lg:w-1/2 w-full relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={aboutImg}
                  alt="Test Route Driving School instructor with student"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                />
              </div>

              {/* Floating Element */}
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <FaUsers className="text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">2,500+</div>
                    <div className="text-sm text-gray-600">
                      Confident Drivers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 w-full space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Learn to Drive with Confidence & Safety
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    At{" "}
                    <span className="font-semibold text-primary">
                      Test Route Driving School
                    </span>
                    , we&apos;re dedicated to transforming new drivers into
                    safe, confident road users. Our mission is to provide
                    exceptional driver education that empowers learners with
                    both skill and awareness.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    With a modern fleet of dual-controlled vehicles and flexible
                    scheduling options, we make learning to drive an enjoyable,
                    stress-free experience. Our patient, certified instructors
                    tailor each lesson to individual needs, ensuring you
                    progress at your own pace.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="grid grid-cols-2 gap-4 mt-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-base-300 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-white rounded-lg">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </Container>

        <WhatWeOffer />

        <MovingCar className="mt-20 md:mt-25" />
        <Faq />
      </section>
    </>
  );
}
