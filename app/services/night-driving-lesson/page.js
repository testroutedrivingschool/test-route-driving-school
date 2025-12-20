import Faq from "@/app/shared/Faq";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import ServicePackages from "../components/ServicePackages";
import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Image from "next/image";
import nightDrivingLessonImg from "@/app/assets/night-driving-test-route-driving-school.jpg"
import { FaCheckCircle,  } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import WhyChooseUs from "@/app/components/Home/WhyChooseUs";
import MovingCar from "@/app/shared/MovingCar";

const automaticDrivingPackages = [
  {
    id: 1,
    title: "1 Hour Lesson",
    description: "1 x 60 min Driving  Lesson ",
    price: "75",
    duration: "1 x 60 min lesson",
    buttonText: "Book 1 Hour Lesson",
  },
  {
    id: 2,
    title: "5 Hour Lesson Pack",
    description: "5 x 60 min Driving Lesson",
    price: "365",
    duration: "5 x 60 min lessons",
    buttonText: "Buy 5 Hours Pack",
  },
  {
    id: 3,
    title: "10 Hour Pack",
    description: "10 x 60min Driving Lesson",
    price: "700",
    duration: "10 x 60 min lessons",
    buttonText: "Buy 10 Hours Pack",
  },
  {
    id: 4,
    title: "20 Hour Pack",
    description: "20 x 60min Driving Lesson",
    price: "1360",
    duration: "20 x 60 min lessons",
    buttonText: "Buy 20 Hours",
  },
];

export default function NightDrivingLesson() {


  const features = [
    "Reduced visibility",
    "Wet and reflective roads (especially in winter)",
    "Glare from oncoming traffic",
    "Fewer visual cues for hazards",
  ];

  return (
    <div className="">
      <PageHeroSection
        title={`Night Driving Lessons in Sydney`}
        subtitle={`At Test Route Driving School, we offer professional night driving lessons across Sydney suburbs, designed to help you stay safe and confident behind the wheel.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src={nightDrivingLessonImg} 
                  className="w-full h-120 object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Night Driving Lesson with Test Route Driving School"
                />
                
               
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Gain Confidence Behind the Wheel even After Dark
                <span className="pl-2 inline-block text-primary">
                   in Night Lesson
                </span>
              </h2>
             
              
              <p className="text-neutral leading-relaxed mb-6">
                Do you feel nervous driving at night? You’re not alone. Many Sydney drivers struggle with low visibility, glare from headlights and unfamiliar roads once the sun goes down. At Test Route Driving School, we offer professional night driving lessons across Sydney suburbs, designed to help you stay safe and confident behind the wheel.
              </p>
<h3 className="font-semibold mt-4 text-lg">Why Night Driving Lessons Matter</h3>
              {/* Key Features */}
              <div className="mt-4 space-y-4 mb-8">
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/packages" className="group">
                  <PrimaryBtn className="px-8 py-3 text-lg font-semibold group-hover:scale-105 transition-transform">
                 
                      Book Your Night Lesson
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



      {/* Service Packages */}
      <ServicePackages
        sectionTitle="Night Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured Night driving lessons designed for success."
        packages={automaticDrivingPackages}
      />
<MovingCar/>
     <WhyChooseUs/>

      <Faq />
    </div>
  );
}