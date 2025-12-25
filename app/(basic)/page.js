import Faq from "../shared/Faq";
import MovingCar from "../shared/MovingCar";
import BlogSection from "./components/Blogs/BlogSection";
import DrivingTestAssessment from "./components/Home/DrivingTestAssessment";
import DrivingTestPackage from "./components/Home/DrivingTestPackage";
import FeatureCards from "./components/Home/FeatureCards";
import FindInstructor from "./components/Home/FindInstructor";
import Hero from "./components/Home/Hero";
import HomeDrivingJourney from "./components/Home/HomeDrivingJourney";
import HomePackage from "./components/Home/HomePackage";
import HowItWorks from "./components/Home/HowItWorks/HowItWorks";
import GoogleReviewCard from "./components/Home/Reviews/GoogleReviewCard";
import Reviews from "./components/Home/Reviews/Reviews";
import WhatWeOffer from "./components/Home/WhatWeOffer";
import WhyChooseUs from "./components/Home/WhyChooseUs";


export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <WhatWeOffer />
      <HomePackage />
      <DrivingTestPackage/>
      <DrivingTestAssessment/>
      <WhyChooseUs className={"bg-base-300"}/>
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
