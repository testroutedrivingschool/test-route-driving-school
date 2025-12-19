import Faq from "@/app/shared/Faq";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import ServicePackages from "../components/ServicePackages";
import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Image from "next/image";
import parkingPackageImg from "@/app/assets/parking-package-img-test-route-driving-school.jpg";
import {
  FaCheckCircle,
} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import WhyChooseUs from "@/app/components/Home/WhyChooseUs";

const automaticDrivingPackages = [
  {
    id: 1,
    title: "Highway Driving Lesson 2 Hours",
    description: "Driving on the highway can be intimidating for new drivers, but it’s an essential skill for gaining full independence behind the wheel. Our Highway Driving lesson is designed to give learner drivers the confidence and experience needed to navigate fast-paced highways and motorways safely.",
    price: "250",
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
    title: "Highway Driving Lesson 3 Hours",
    description: "Driving on the highway can be intimidating for new drivers, but it's an essential skill for gaining full independence behind the wheel. Our Highway Driving lesson is designed to give learner drivers the confidence and experience needed to navigate fast-paced highways and motorways safely.",
    price: "270",
    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Book Now",
  },
];

export default function ParkingPackage() {
  const features = [
    "Learn smooth and accurate techniques for both test conditions and everyday driving.",
    "Build confidence performing one of the most difficult test maneuvers.",
    "Practice in car parks and roadside conditions commonly faced in urban Sydney.",
    "Learn how to handle confined areas calmly and confidently.",
    "Receive step-by-step guidance and immediate correction to accelerate your progress.",
    " Prepare for driving assessments where parking competence is essential.",
  ];

  return (
    <div className="">
      <PageHeroSection
        title={`Parking Driving Lesson Package`}
        subtitle={`Master essential parking skills with expert guidance, hands-on practice, and personalized lessons designed to make you a confident driver.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
        <Container>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={parkingPackageImg}
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
                Parking Driving
                <span className="pl-2 inline-block text-primary">
                  Lesson Package
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Do you feel anxious or uncertain when it comes to reverse
                parking on a busy street or squeezing into a tight spot in a
                crowded car park? <br /> You’re not alone, parking is one of the
                most common pain points for new and experienced drivers alike.
                Our Parking Training Package is a comprehensive 3-hour,
                one-on-one lesson designed to eliminate that fear and turn
                parking into a strength.
              </p>
              <h3 className="text-lg font-semibold">
                What’s Included in the Parking Package?
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
      <section className="py-16 bg-primary/80 text-white">
        <Container>
                   <h3 className="text-lg md:text-2xl font-semibold">
                We provide practical, real-world training in live traffic
                conditions, including:
              </h3>
              <ul className="mt-2 list-disc pl-3 space-y-2">
                <li className="text-base-300 ">Busy suburban streets</li>
                <li className="text-base-300 ">Shopping center car parks</li>
                <li className="text-base-300 ">Narrow side streets</li>
                <li className="text-base-300 ">Residential and commercial areas </li>
              </ul>
                   <h3 className="mt-4 text-lg md:text-2xl font-semibold">
               Who Can Use This Parking Package?
              </h3>
              <ul className="mt-2 list-disc pl-3 space-y-2">
                <li className="text-base-300 ">Learner drivers preparing for the NSW driving test</li>
                <li className="text-base-300 ">P-platers wanting to refine their parking skills</li>
                <li className="text-base-300 ">Overseas license holders adapting to local driving rules</li>
                <li className="text-base-300 ">Adults returning to driving after a break</li>
                <li className="text-base-300 ">Anyone who feels nervous about parking in tight or busy areas</li>
              </ul>
        </Container>
      </section>

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="Parking Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured Parking Package designed for success."
        packages={automaticDrivingPackages}
      />

      <WhyChooseUs />

      <Faq />
    </div>
  );
}
