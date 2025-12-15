import React from "react";
import SectionHeader from "../shared/ui/SectionHeader";
import {IoDocumentText} from "react-icons/io5";
import Container from "../shared/ui/Container";
import Faq from "../shared/Faq";
import PageHeroSection from "../shared/ui/PageHeroSection";
import MovingCar from "../shared/MovingCar";

export default function Resources() {
  return (
    <div className="">
      <PageHeroSection title="Resources"/>
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
