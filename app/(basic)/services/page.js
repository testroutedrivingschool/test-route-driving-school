import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import MovingCar from "@/app/shared/MovingCar";
import Faq from "@/app/shared/FaqSection";
import ServicesCards from "../components/services/ServicesCards";
import Link from "next/link";

export const metadata = {
  title: "Top-Rated Driving Lessons Services for Fast Learners",
  description:
    "Best Driving Lessons Services help beginners and experienced learners gain road confidence. Start your journey now!",
     keywords: [
    "Driving Lessons Services",
"cheap driving lessons",
"best driving school",
"driving instructor",
"learn to drive",
"driving school",
"driving lessons",
"professional driving instructor",
"driving test lessons",
  ],

};

const faqs = [
  {
    question: "How many lessons do I need to pass my driving test?",
    answer:
      <>
      The number varies based on your experience, confidence, and skill. Most learners require 5–10 lessons. Our structured <strong>driving test lessons</strong> ensure you are fully prepared.
      </>,
  },


  {
    question: "Do you provide pickup and drop-off for lessons?",
    answer:
      <>
      Yes! We offer convenient pickup and drop-off within Sydney suburbs. This makes your <strong>learn to drive</strong> experience stress-free and flexible.
      </>,
  },
  {
    question: "Can I book lessons online?",
    answer:
     <>
     
     Absolutely! Booking is fast, easy, and convenient through our <Link href={`/`} className="underline font-bold px-1">
     website.
     </Link> Reserve your <strong>driving lessons</strong> at any time.
     </>,
  },



];


export default function Service() {
  return (
    <div>
      <PageHeroSection
        title={`Top-Rated Driving Lessons Services for Fast Learners`}
        subtitle={<>
        At <strong>Test Route Driving School,</strong> we provide expert <strong>driving lessons services</strong> across Sydney. Our lessons help you gain confidence, learn quickly, and become a safe driver. Flexible packages suit every learner.
        </>}
      />

      <ServicesCards />
      <MovingCar />
      <Faq faqs={faqs}/>
    </div>
  );
}
