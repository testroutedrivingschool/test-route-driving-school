import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import MovingCar from "@/app/shared/MovingCar";
import Faq from "@/app/shared/FaqSection";
import ServicesCards from "../components/services/ServicesCards";

export default function Service() {
  return (
    <div>
      <PageHeroSection
        title={`Our Services`}
        subtitle={`At Test Route Driving School, we provide expert automatic driving lessons across Sydney to help learners of all skill levels become confident, safe drivers.`}
      />

      <ServicesCards />
      <MovingCar />
      <Faq />
    </div>
  );
}
