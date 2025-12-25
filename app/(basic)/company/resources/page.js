import Faq from "@/app/shared/Faq";
import MovingCar from "@/app/shared/MovingCar";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import React from "react";

import {IoDocumentText} from "react-icons/io5";

export default function Resources() {
  return (
    <div className="">
      <PageHeroSection title="Resources" subtitle={`Discover a collection of valuable tools, guides, and materials designed to support your learning journey. From tips and tutorials to reference materials, our resources are curated to help you gain knowledge, practice effectively, and achieve your goals with confidence.`}/>
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
      <MovingCar/>
        <Faq />
    </div>
  );
}
