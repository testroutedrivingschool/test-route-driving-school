import Faq from "@/app/shared/Faq";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import ServicePackages from "../components/ServicePackages";
import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Image from "next/image";
import highwayPackageImg from "@/app/assets/highway-package-test-route-driving-school.jpg";
import {
  FaCheckCircle,
} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import WhyChooseUs from "@/app/components/Home/WhyChooseUs";

const automaticDrivingPackages = [
  {
    id: 1,
    title: "Highway Package 1",
    description: "Parking can be one of the most challenging skills for new drivers to master, but with the right guidance and practice, you can build the confidence needed to park safely and efficiently in any situation.",
    price: "220",
    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Book Now",
  },
  {
    id: 2,
    title: "Highway Package 2",
    description: "Parking can be one of the most challenging skills for new drivers to master, but with the right guidance and practice, you can build the confidence needed to park safely and efficiently in any situation.",
    price: "255",
    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Book Now",
  },
];

export default function HighwayPackage() {
  const features = [
    " Spot and react to potential dangers earlier by scanning further ahead at high speeds.",
    "Stay in the correct lane and change lanes safely using mirrors and signals.",
    " Learn how to smoothly enter highways by matching the speed of moving traffic.",
    "Understand when and how to overtake vehicles without cutting off or tailgating.",
    "Use techniques like taking breaks and staying alert to avoid tiredness on long drives.",
  ];

  return (
    <div className="">
      <PageHeroSection
        title={`Highway Driving Lessons in Sydney`}
        subtitle={`Test Route Driving School offers highway driving lessons, with experienced instructors and cheap car lessons, look no further than Test Route Driving School—Sydney’s top-rated driving school for learners, test-prep, and refresher courses.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
        <Container>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={highwayPackageImg}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Parking Package with Test Route Driving School"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Highway Driving
                <span className="pl-2 inline-block text-primary">
                  Lesson Package
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Driving on a highway is a whole new level of driving confidence. While city driving teaches you to handle traffic congestion and tight spaces, highway driving builds your skills in speed management, merging, overtaking, and long-distance focus. If you&apos;re searching for a driving school in Sydney that offers highway driving lessons, with experienced instructors and cheap car lessons, look no further than Test Route Driving School—Sydney’s top-rated driving school for learners, test-prep, and refresher courses.
              </p>
              <h3 className="text-lg font-semibold">
                Why Highway Driving Lesson Is Important
              </h3>
              {/* Key Features */}
              <div className="mt-4  space-y-4 mb-8">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-green-500 text-sm" />
                    </div>
                    <span className="text-neutral">{feature}</span>
                  </div>
                ))}
              </div>
           
              {/* CTA Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Link href="/packages" className="group">
                  <PrimaryBtn className="px-8 py-3 text-lg font-semibold group-hover:scale-105 transition-transform">
                    Book Highway Package
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </PrimaryBtn>
                </Link>

                <Link href="/instructors" className="group">
                  <OutlineBtn className="py-3! px-8! border-2!">
                    Meet Our Instructors
                  </OutlineBtn>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-12 bg-primary/80 text-white">
        <Container>
                   <h3 className="text-lg md:text-2xl font-semibold">
                Who Needs Highway Driving Lessons?
              </h3>
              <ul className="mt-2 list-disc pl-3 space-y-2">
                <li className="text-base-300 ">New learners preparing for their P’s test</li>
                <li className="text-base-300 ">Overseas drivers adapting to Australian road systems</li>
                <li className="text-base-300 ">Anxious or hesitant drivers who avoid motorways</li>
                <li className="text-base-300 ">Learners in suburban or rural areas commuting to the city</li>
              </ul>
                   <h3 className="mt-4 text-lg md:text-2xl font-semibold">
              Prepare for Success
              </h3>
              <p className="mt-2 max-w-4xl">Don’t leave your driving test to chance. With Test Route Driving School, you’ll receive the support and guidance you need to pass your test with confidence. Contact us today to book your driving test assessment and take the first step towards becoming a licensed driver.</p>
        </Container>
      </section>

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="Highway Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured highway driving lessons designed for success."
        packages={automaticDrivingPackages}
      />

      <WhyChooseUs />

      <Faq />
    </div>
  );
}
