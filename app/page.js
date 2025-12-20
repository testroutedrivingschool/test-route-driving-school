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
import FindInstructor from "./components/Home/FindInstructor";
import HomeDrivingJourney from "./components/Home/HomeDrivingJourney";
import DrivingTestAssessment from "./components/Home/DrivingTestAssessment";
import DrivingTestPackage from "./components/Home/DrivingTestPackage";
import BlogSection from "./components/Blogs/BlogSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <WhatWeOffer />
      <HomePackage />
      <DrivingTestPackage/>
      <DrivingTestAssessment/>
      <WhyChooseUs />
      <MovingCar />
      <FindInstructor/>
      <HomeDrivingJourney/>
      <GoogleReviewCard />
      <Reviews />
      <HowItWorks />
      <BlogSection/>
      <Faq />
    </>
  );
}
