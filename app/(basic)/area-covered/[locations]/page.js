"use client";

import Faq from "@/app/shared/FaqSection";
import MovingCar from "@/app/shared/MovingCar";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import {useParams} from "next/navigation";
import locationImg from "@/app/assets/test-route-driving-school-cover.png";
import locationImg2 from "@/app/assets/test-lesson-test-route-driving-school.png";
import WhatWeOffer from "../../components/Home/WhatWeOffer";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {FaCar, FaTrafficLight} from "react-icons/fa";
import {IoIosWarning} from "react-icons/io";
import {FaArrowRotateLeft} from "react-icons/fa6";
export default function LocationPage() {
  const params = useParams();
  const slug = params.locations;

  const location = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div>
      <PageHeroSection
        title={`Professional Driving Lessons in ${location}`}
        subtitle={`At Test Route Driving School, our highly qualified and friendly instructors deliver expert driving lessons across ${location}. We focus on building confidence, road safety, and real-world driving skills through structured training programs tailored for beginners, learners, and refresher drivers alike.`}
      />
      <section className="py-16">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Learn to Drive in {location}
              </h2>
              <p className="text-gray-700 text-lg">
                Our experienced instructors provide tailored driving lessons in{" "}
                {location}, helping you gain confidence and pass your driving
                test with ease. Whether you are a beginner or preparing for your
                test, we cover all aspects of driving, including road safety,
                parking, and highway skills.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Flexible lesson schedules</li>
                <li>Personalized learning plans</li>
                <li>Certified and experienced instructors</li>
                <li>Modern dual-control vehicles</li>
              </ul>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <Image
                src={locationImg}
                alt={`Driving lessons in ${location}`}
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
          <div className="flex flex-col lg:flex-row items-center gap-10 ">
            <div className="flex-1 ">
              <Image
                src={locationImg2}
                alt={`Driving Test Preparation in ${location}`}
                width={600}
                height={400}
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Driving Test Preparation in {location}
              </h2>

              <p className="text-gray-700 text-lg">
                Preparing for your driving test in {location} requires expert
                guidance, structured practice, and a deep understanding of local
                road conditions. At Test Route Driving School, we specialize in
                helping learners pass their driving test on the first attempt by
                focusing on examiner expectations, test routes, and common
                mistakes.
              </p>

              <p className="text-gray-700 text-lg">
                Our instructors are familiar with local test centers, road
                layouts, roundabouts, school zones, and high-traffic areas
                across {location}. This local knowledge allows us to design
                lessons that closely reflect real test conditions, helping
                learners stay calm and confident on test day.
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Mock driving tests under real exam conditions</li>
                <li>Practice on common test routes in {location}</li>
                <li>Parking, hill starts, and hazard perception training</li>
                <li>Pre-test confidence and error correction sessions</li>
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
                  Professional Driving Lessons in {location}
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  Learning to drive can be challenging, but with our certified
                  instructors in {location}, you’ll receive personalized
                  guidance tailored to your skill level. Whether you&apos;re a
                  beginner starting from scratch or looking to refine advanced
                  driving techniques, our lessons cover all aspects of safe and
                  confident driving. We focus on both practical skills and
                  theoretical knowledge, including road safety, traffic rules,
                  and hazard perception. Each lesson is structured to build your
                  confidence behind the wheel, ensuring you are fully prepared
                  for your driving test and real-world driving situations.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Flexible Schedules and Tailored Learning Plans
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  We understand that every learner has a unique schedule and
                  learning pace. That’s why we offer flexible lesson timings
                  throughout {location}, including evenings and weekends, to
                  accommodate students, professionals, and busy parents. Our
                  instructors create customized lesson plans based on your
                  progress, strengths, and areas that need improvement. With
                  consistent feedback and practical exercises, you’ll steadily
                  advance your driving skills while maintaining safety and
                  confidence on the road. By the end of your course, you’ll not
                  only be ready for your driving test but also for real-life
                  driving scenarios with ease.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <MovingCar />
      <WhatWeOffer />
      <section className="py-16 ">
        <Container>
          <div className="space-y-12 text-center">
            <SectionHeader
              className={`mt-0!`}
              title={`Driving Lesson Tips & Advice in ${location}`}
              subtitle={` Learning to drive can be challenging, but with the right guidance, preparation, and mindset, you can become a confident and safe driver in {location}. At Test Route Driving School, we provide expert tips and advice for learners of all levels, helping you make the most out of every lesson.`}
            />

            <div className="grid gap-8 md:grid-cols-2">
              {/* Tip Card */}
              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <FaCar />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Practice Regularly
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Consistent practice is the key to building confidence behind
                  the wheel. Schedule lessons and practice sessions in{" "}
                  {location}, covering roads, traffic, and parking scenarios.
                </p>
              </div>

              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-400 to-green-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <IoIosWarning />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  Focus on Road Safety
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Prioritize safety while driving. Learn to anticipate hazards,
                  follow traffic rules, and maintain safe distances. Our
                  instructors in {location} emphasize safe driving habits.
                </p>
              </div>

              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-purple-400 to-purple-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <FaTrafficLight />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  Build Confidence Gradually
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Start with simple exercises and gradually move to complex
                  scenarios such as city traffic, highways, or night driving.
                  Gradual progression ensures mastery.
                </p>
              </div>

              <div className="flex flex-col p-6 bg-base-300 rounded-xl shadow transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-400 to-yellow-600 text-white rounded-full mb-4 mx-auto text-2xl">
                  <FaArrowRotateLeft />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-yellow-500 transition-colors">
                  Learn Both Manual and Automatic
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Even if you plan to learn automatic driving, understanding
                  manual basics improves overall vehicle control. Our school in{" "}
                  {location} offers both for a complete experience.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Faq />
    </div>
  );
}
