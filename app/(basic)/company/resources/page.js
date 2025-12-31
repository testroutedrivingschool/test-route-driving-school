import Faq from "@/app/shared/FaqSection";
import MovingCar from "@/app/shared/MovingCar";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import React from "react";

import {IoDocumentText} from "react-icons/io5";
import DrivingTipsSection from "../../components/Home/DrivingTipsSection";

export default function Resources() {
  return (
    <div className="">
      <PageHeroSection
        title="Resources"
        subtitle={`Discover a collection of valuable tools, guides, and materials designed to support your learning journey. From tips and tutorials to reference materials, our resources are curated to help you gain knowledge, practice effectively, and achieve your goals with confidence.`}
      />
      <Container className={`pb-17`}>
        <SectionHeader
          title="Essential Resources for Learner  Drivers"
          subtitle="Trusted guides and official links to help you prepare for safe driving in NSW"
        />
        {/* Resources */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">
              NSW Department of Transport
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">
              NSW Road User Handbook
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">
              Practical Test Booking
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">Tutorial Videos</h2>
          </div>
        </section>
      </Container>
      <section className="py-12 bg-primary/10">
        <Container>
          <div className="space-y-4">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold  mb-4">
                  Automatic Driving Lesson Guides & Learning Materials
                </h3>
                <p className="text-neutral text-lg mb-3">
                  This resources section provides helpful guides and learning
                  materials for automatic driving lessons across Sydney. You’ll
                  find information covering lesson structures, common driving
                  scenarios, parking techniques, and test route preparation to
                  support your learning journey.
                </p>
              </div>

              <div className="">
                <h3 className="text-2xl font-bold  mb-4">
                  Study at Your Own Pace with Structured Learning Resources
                </h3>
                <p className="text-neutral text-lg ">
                  Every learner progresses differently. Our driving resources
                  explain how to plan practice sessions, manage learning
                  timelines, and focus on key driving skills based on your
                  experience level and goals. <br />
                  With step-by-step explanations, practical tips, and
                  instructor-led insights, these resources help you improve
                  observation, hazard awareness, and decision-making — essential
                  skills for both driving tests and real-world driving.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 ">
        <Container>
          <SectionHeader
            className="mt-0!"
            title="Common Driving Mistakes to Avoid"
            subtitle="Learn from common errors to improve your driving test success"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              "Not checking mirrors before changing lanes",
              "Incorrect speed control in school zones",
              "Rolling stops at stop signs",
              "Poor observation at intersections",
              "Incorrect use of indicators",
              "Nervous braking during test conditions",
            ].map((mistake, index) => (
              <div
                key={index}
                className="group bg-base-300 p-5 rounded-xl border border-border-color shadow transition"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-900 transition">
                    {mistake}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <MovingCar />
      <DrivingTipsSection />
      <Faq className={`bg-white`} />
    </div>
  );
}
