import Faq from "@/app/shared/Faq";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import ServicePackages from "../components/ServicePackages";
import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Image from "next/image";
import automaticLessonImg from "@/app/assets/service-lesson-test-route-driving-school.png"
import { FaCheckCircle, FaCar, FaShieldAlt, FaUserTie, FaCalendarAlt, FaStar } from "react-icons/fa";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import WhyChooseUs from "@/app/components/Home/WhyChooseUs";
import MovingCar from "@/app/shared/MovingCar";

const automaticDrivingPackages = [
  {
    id: 1,
    title: "1 Hour Lesson",
    description: "Perfect for beginners starting their journey",
    price: "75",
    duration: "1 x 60 min lesson",
    features: ["Single session", "Basic fundamentals", "Instructor feedback"],
    buttonText: "Book 1 Hour",
    popular: false,
  },
  {
    id: 2,
    title: "5 Hour Pack",
    description: "Build confidence with multiple sessions",
    price: "365",
    originalPrice: "395",
    duration: "5 x 60 min lessons",
    features: ["Save $30", "Progress tracking", "Flexible scheduling"],
    buttonText: "Buy 5 Hours",
    popular: false,
  },
  {
    id: 3,
    title: "10 Hour Pack",
    description: "Comprehensive training for test preparation",
    price: "700",
    originalPrice: "750",
    duration: "10 x 60 min lessons",
    features: ["Save $50", "Mock tests", "Highway driving"],
    buttonText: "Buy 10 Hours",
    popular: true,
  },
  {
    id: 4,
    title: "20 Hour Pack",
    description: "Complete mastery package",
    price: "1360",
    originalPrice: "1500",
    duration: "20 x 60 min lessons",
    features: ["Save $140", "Advanced maneuvers", "Exam readiness"],
    buttonText: "Buy 20 Hours",
    popular: false,
  },
];

export default function AutomaticDrivingLesson() {


  const features = [
    "Dual-control vehicles for maximum safety",
    "Personalized lesson plans for all skill levels",
    "Real-time feedback and progress tracking",
    "Test route practice and mock exams",
    "Confidence building with patient instructors",
    "Modern automatic transmission cars"
  ];

  return (
    <div className="">
      <PageHeroSection
        title={`Automatic Driving Lessons in Sydney`}
        subtitle={`Master automatic transmission with Sydney's leading driving school. Expert instructors, modern vehicles, and flexible scheduling for confident driving.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src={automaticLessonImg} 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Automatic Driving Lesson with Test Route Driving School"
                />
                
               
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                 Cruise Sydney with Confidence
                <span className="pl-2 inline-block text-primary">
                   in Automatic Cars
                </span>
              </h2>
             
              
              <p className="text-neutral leading-relaxed mb-6">
                At Test Route Driving School, we specialize in automatic driving lessons across Sydney. 
                Our certified instructors provide personalized training that builds confidence and ensures 
                you&apos;re well-prepared to pass your test on the first attempt.
              </p>

              {/* Key Features */}
              <div className="space-y-4 mb-8">
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
                 
                      Book Your First Lesson
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
        sectionTitle="Automatic Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured automatic driving lessons designed for success."
        packages={automaticDrivingPackages}
      />
<MovingCar/>
     <WhyChooseUs/>

      <Faq />
    </div>
  );
}