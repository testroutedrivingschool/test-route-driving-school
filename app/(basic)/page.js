import Faq from "../shared/FaqSection";
import MovingCar from "../shared/MovingCar";
import BlogSection from "./components/Blogs/BlogSection";
import DrivingTestAssessment from "./components/Home/DrivingTestAssessment";
import DrivingTestPackage from "./components/Home/DrivingTestPackage";
import DrivingTipsSection from "./components/Home/DrivingTipsSection";
import FeatureCards from "./components/Home/FeatureCards";
import FindInstructor from "./components/Home/FindInstructor";
import Hero from "./components/Home/Hero";
import HomeAbout from "./components/Home/HomeAbout";
import HomeDrivingJourney from "./components/Home/HomeDrivingJourney";
import HomePackage from "./components/Home/HomePackage";
import HowItWorks from "./components/Home/HowItWorks/HowItWorks";
import LocalDrivingLessons from "./components/Home/LocalDrivingLessons";
import GoogleReviewCard from "./components/Home/Reviews/GoogleReviewCard";
import Reviews from "./components/Home/Reviews/Reviews";
import WhatWeOffer from "./components/Home/WhatWeOffer";
import WhyChooseUs from "./components/Home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <HomeAbout/>
      <WhatWeOffer />
      <HomePackage />
      <DrivingTestPackage />
      <DrivingTestAssessment />
      <WhyChooseUs/>
      <MovingCar />
      <LocalDrivingLessons/>
      <FindInstructor />
      <HomeDrivingJourney />
      <DrivingTipsSection/>
      <GoogleReviewCard />
      <Reviews />
      <HowItWorks />
      <BlogSection />
      <Faq />
    </>
  );
}
