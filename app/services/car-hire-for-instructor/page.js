import Faq from "@/app/shared/Faq";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import ServicePackages from "../components/ServicePackages";
import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Image from "next/image";
import carHireImg from "@/app/assets/car-hire.png";
import {FiArrowRight} from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import WhyChooseUs from "@/app/components/Home/WhyChooseUs";
import fleet1Img from "@/app/assets/fleet1.jpg";
import fleet2Img from "@/app/assets/fleet2.webp";
import fleet3Img from "@/app/assets/fleet3.jpg";
import SectionHeader from "@/app/shared/ui/SectionHeader";
const fleets = [
  {
    id: 1,
    title: "KIA Stonic Build Year 2023",
    price: "100",
    features: [
      "Quatily Dual Brake Installed",
      "Instructor Mirror and Blind Spot Mirror Installed",
      "Insurance Covered",
      "8' LCD Touch Screen with wireless Andriod Auto & Apple Car Play",
      "Lane Keeping Assist",
      "Lane Following Assist",
    ],
    img: fleet1Img,
  },
  {
    id: 2,
    title: "Toyota Corolla Hybrid 2023",
    price: "110",
    features: [
      "Quatily Dual Brake Installed",
      "Instructor Mirror and Blind Spot Mirror Installed",
      "Insurance Covered",
      "APPLE CARPLAY & ANDROID AUTO",
      "BLIND SPOT SENSORS",
      "LANE DEPARTURE WARNING",
      "CRUISE CONTROL",
      "REVERSE CAMERA",
      "KEYLESS ENTRY/STAR",
    ],
    img: fleet2Img,
  },
  {
    id: 3,
    title: "Toyota Yaris Cross Hybrid 2023",
    price: "110",
    features: [
      "Quatily Dual Brake Installed",
      "Instructor Mirror and Blind Spot Mirror Installed",
      "Insurance Covered",
      "Apple CarPlay & Android Auto",
      "Key-less Entry & Push Button Start",
      "Blind Spot Monitors with Rear Cross Traffic Alert",
      "Active Cruise Control",
      "Lane Keep Assistance",
    ],
    img: fleet3Img,
  },
];

export default function CarHireForInstructor() {
  return (
    <div className="">
      <PageHeroSection
        title={`Dual Brake Car Hire for Instructor in Sydney`}
        subtitle={`Test Route Driving School is your reliable source for dual brake car rentals, specifically tailored to meet the needs of driving instructors. We prioritize safety and excellence in driving instruction by providing well-maintained vehicles equipped with state-of-the-art dual brake systems.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden bg-base-300">
                <Image
                  src={carHireImg}
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
                Dual-controlled Vehicles Available
                <span className="pl-2 inline-block text-primary">for Hire</span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Test Route Driving School is your reliable source for dual brake
                car rentals, specifically tailored to meet the needs of driving
                instructors. We prioritize safety and excellence in driving
                instruction by providing well-maintained vehicles equipped with
                state-of-the-art dual brake systems.
              </p>
              <p className="text-neutral leading-relaxed mb-6">
                Our wide range of cars allows you to choose the perfect vehicle
                for your teaching style and preferences.With flexible rental
                options and competitive pricing packages designed for driving
                instructors, we ensure affordability and convenience.
              </p>
              <p className="text-neutral leading-relaxed mb-6">
                If you are a driving instructor and your vehicle has broken
                down, or is being repaired, and you are stressed about losing
                work, we have cover for you. Our dedicated customer support team
                is always ready to assist you, making the rental process
                seamless and hassle-free. Trust Test Route Driving School to
                enhance the quality of your driving.
              </p>
              <p className="text-neutral leading-relaxed mb-6">
                Please{" "}
                <Link
                  className="text-primary font-semibold"
                  href={`/company/contact`}
                >
                  Contact Us
                </Link>{" "}
                to discuss more about Dual brake car for hire. We guarantee the
                best service and price in Sydney.
              </p>

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

      <section>
        <Container>
          <SectionHeader
            title={`Our Fleet`}
            subtitle={
              "A modern and diverse range of vehicles designed for comfort, safety, and an excellent driving experience."
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fleets.map((fleet) => (
              <div
                key={fleet.id}
                className="bg-white border border-border-color rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Fleet Image */}
                <div className="relative w-full h-48 md:h-56">
                  <Image
                    src={fleet.img}
                    alt={fleet.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Fleet Info */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Title and Price */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {fleet.title}
                      </h3>
                      <span className="text-primary font-semibold">
                        ${fleet.price}/hr
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-2 text-gray-600 text-sm">
                      {fleet.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">•</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition">
                    Book This Car
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <WhyChooseUs />

      <Faq />
    </div>
  );
}
