import React from "react";
import PageHeroSection from "../shared/ui/PageHeroSection";
import Faq from "../shared/Faq";
import ServicesCards from "../components/services/ServicesCards";

export default function Service() {
  return (
    <div>
      <PageHeroSection
        title={`Our Services`}
        subtitle={`At Test Route Driving School, we provide expert automatic driving lessons across Sydney to help learners of all skill levels become confident, safe drivers.`}
      />

      <ServicesCards />
      <Faq />
    </div>
  );
}
