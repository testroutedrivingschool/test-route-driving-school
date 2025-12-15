import Faq from "./shared/Faq";
import FeatureCards from "./components/Home/FeatureCards";
import Hero from "./components/Home/Hero";
import HomePackage from "./components/Home/HomePackage";
import MovingCar from "./shared/MovingCar";
import GoogleReviewCard from "./components/Home/Reviews/GoogleReviewCard";
import Reviews from "./components/Home/Reviews/Reviews";
import WhatWeOffer from "./components/Home/WhatWeOffer";
import WhyChooseUs from "./components/Home/WhyChooseUs";
import HowItWorks from "./components/Home/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <WhatWeOffer />
      <HomePackage />
      <WhyChooseUs />
      <MovingCar />
      <GoogleReviewCard />
      <Reviews />
      <HowItWorks />
      <Faq />
    </>
  );
}
