"use client";

import Faq from "@/app/shared/Faq";
import MovingCar from "@/app/shared/MovingCar";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import {useParams} from "next/navigation";
import locationImg from "@/app/assets/test-route-driving-school-cover.png";
export default function LocationPage() {
  const params = useParams();
  const slug = params.locations;

  const location = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div>
      <PageHeroSection
        title={location}
        subtitle={`Our expert instructors provide professional driving lessons across ${location}, ensuring comprehensive coverage for all your driving needs.`}
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
      <Faq />
    </div>
  );
}
