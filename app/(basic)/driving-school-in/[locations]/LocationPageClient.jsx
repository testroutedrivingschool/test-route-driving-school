"use client";

import Faq from "@/app/shared/FaqSection";
import MovingCar from "@/app/shared/MovingCar";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import locationImg from "@/app/assets/test-route-driving-school-cover.png";
import locationImg2 from "@/app/assets/test-lesson-test-route-driving-school.png";
import WhatWeOffer from "../../components/Home/WhatWeOffer";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {FaCar, FaEnvelope, FaPhoneAlt, FaTrafficLight} from "react-icons/fa";
import {IoIosWarning} from "react-icons/io";
import {FaArrowRotateLeft} from "react-icons/fa6";
import SecondaryBtn from "@/app/shared/Buttons/SecondaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import {usePathname, useRouter} from "next/navigation";

export default function LocationPageClient({locationData}) {
  const router = useRouter();
const pathname = usePathname();

// Extract slug
const slug = pathname.replace("/driving-school-in/", "");

// Convert to proper case
const formattedLocation = slug
  .split("-")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ") || "";

  return (
    <div>
      <PageHeroSection
        title={locationData?.heroTitle || `Driving Lessons in ${location}`}
        subtitle={
          locationData?.heroDescription ||
          `Professional driving lessons in with expert instructors.`
        }
      />
      <section className="py-16">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {locationData.section1Title
                  ? locationData.section1Title
                  : "Learn to Drive with Confidence at Test Route Driving School"}
              </h2>
              <p className="text-gray-700 text-lg">
                {locationData.section1SubTitle
                  ? locationData.section1SubTitle
                  : "You deserve an affordable driving school that truly cares about your success. Many learners feel nervous during their first few lessons, which is completely normal. We create a calm, patient, and supportive learning environment to help you build confidence step by step. Our experienced instructors focus on real-world driving skills and proper test preparation, so you feel ready for any traffic situation."}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {locationData?.section1Features?.map((feature, idx) => (
                  <li key={`s1Feature-${idx}`}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-auto flex-1">
              <Image
                src={locationImg}
                alt={`${locationData?.pageTitle}`}
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row items-center gap-10 ">
            <div className="w-full lg:w-auto flex-1 ">
              <Image
                src={locationImg2}
                alt={`${locationData?.pageTitle}`}
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {locationData.section2Title
                  ? locationData.section2Title
                  : "Learn to Drive with Confidence at Test Route Driving School"}
              </h2>

              <p className="text-gray-700 text-lg">
                {locationData.section2SubTitle
                  ? locationData.section2SubTitle
                  : "You deserve an affordable driving school that truly cares about your success. Many learners feel nervous during their first few lessons, which is completely normal. We create a calm, patient, and supportive learning environment to help you build confidence step by step. Our experienced instructors focus on real-world driving skills and proper test preparation, so you feel ready for any traffic situation."}
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {locationData?.section2Features?.map((feature, idx) => (
                  <li key={`s2Feature-${idx}`}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-5 py-12 bg-primary/10">
        <Container>
          <div className="space-y-4">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locationData?.section3Title1
                    ? locationData.section3Title1
                    : ""}
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  {locationData?.section3Description1
                    ? locationData.section3Description1
                    : ""}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locationData?.section3Title2
                    ? locationData.section3Title2
                    : ""}
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  {locationData?.section3Description2
                    ? locationData.section3Description2
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <MovingCar />
      <WhatWeOffer sectionTitle={`What We Offer in ${formattedLocation}`} services={locationData?.services} />
      <section className="py-16 ">
        <Container>
          <div className="space-y-12 text-center">
            <SectionHeader
              className={`mt-0!`}
              title={`${locationData?.lessonTipsSectionTitle || ""}`}
              subtitle={` Learning to drive can be challenging, but with the right guidance, preparation, and mindset, you can become a confident and safe driver in {location}. At Test Route Driving School, we provide expert tips and advice for learners of all levels, helping you make the most out of every lesson.`}
            />

            <div className="grid gap-8 md:grid-cols-2">
              {/* Tip Card */}
              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <FaCar />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {locationData.lessonTips[0].name || ""}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {locationData.lessonTips[0].description || ""}
                </p>
              </div>

              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-400 to-green-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <IoIosWarning />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {locationData.lessonTips[1].name || ""}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {locationData.lessonTips[1].description || ""}
                </p>
              </div>

              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-purple-400 to-purple-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <FaTrafficLight />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {locationData.lessonTips[2].name || ""}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {locationData.lessonTips[2].description || ""}
                </p>
              </div>

              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-400 to-yellow-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <FaArrowRotateLeft />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-yellow-500 transition-colors">
                  {locationData.lessonTips[3].name || ""}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {locationData.lessonTips[3].description || ""}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="mt-10 mb-10">
        <Container>
          {/* CTA Section */}
          <div className=" bg-primary rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Start Your Driving Journey Today</h3>
            <p className="text-blue-100 mb-6 md:max-w-2xl mx-auto">
              {locationData.ctaDescription
                ? locationData.ctaDescription
                : "Start your driving journey today with Test Route Driving School. Expert instructors, flexible schedules, and safe vehicles make learning fun and easy."}
            </p>
            <div className="flex gap-2 justify-center">
              <SecondaryBtn className={`text-xs! md:text-lg! px-2! md:px-4!`} onClick={() => router.push("/bookings")}>
                Book Now
              </SecondaryBtn>
              <OutlineBtn
                className={`border-white! text-white hover:bg-secondary hover:border-secondary! text-xs! md:text-lg! py-1 md:py-1.5 px-2! md:px-4!`}
              >
                <a
                  href="tel:61412018593"
                  className="flex items-center gap-2 px-0 rounded-lg  text-white font-bold  transition "
                >
                  <FaPhoneAlt className="md:text-xl" />
                  <span>Call Now</span>
                </a>
              </OutlineBtn>
              <OutlineBtn
                className={`border-white! text-white hover:bg-secondary hover:border-secondary! text-xs! md:text-lg! px-2! md:px-4!`}
              >
                <a
                  href="mailto:testroutedrivingschool@gmail.com"
                  className="flex items-center gap-2 rounded-lg  text-white font-bold   transition "
                >
                  <FaEnvelope className="text-lg" />
                  <span>Sent Email</span>
                </a>
              </OutlineBtn>
            </div>
          </div>
        </Container>
      </section>
      <Faq title={`FAQs About Driving Lessons in ${formattedLocation}`} faqs={locationData?.faqs} />
      {/* Map*/}
      <section className="py-16">
        <Container>
          <div className="w-full h-[450px] rounded-xl overflow-hidden border border-border-color">
            <iframe
              src={locationData.mapUrl}
              width="100%"
              height="100%"
              style={{border: 0}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
