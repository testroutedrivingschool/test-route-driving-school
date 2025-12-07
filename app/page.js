import Hero from "./components/Home/Hero";
import HomePackage from "./components/Home/HomePackage";
import WhatWeOffer from "./components/Home/WhatWeOffer";
import WhyChooseUs from "./components/Home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeOffer />
      <HomePackage />
      <WhyChooseUs />
    </>
  );
}
