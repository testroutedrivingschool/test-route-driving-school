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
    question: "What types of driving lessons do you offer in Sydney?",
    answer:
      <>
      Test Route offers automatic, test preparation, and specialised driving lessons.
 Packages include parking, highway, night, and city driving training.
 Each lesson follows NSW road and testing standards.
      </>,
  },


  {
    question: "Are your driving lessons suitable for fast learners?",
    answer:
      <>
    Yes, lessons are structured for quick skill development.
 Professional instructors focus on efficient learning methods.
 You progress faster with personalised coaching and feedback.
      </>,
  },
  {
    question: "How do driving test lessons help you pass faster?",
    answer:
      <>
      Test lessons follow real RMS test routes and conditions.
 You practise parking, merging, and hazard awareness.
 Instructors correct mistakes before test day.
      </>,
  },
  {
    question: "Do you provide affordable and cheap driving lesson packages?",
    answer:
      <>
   Flexible packages are available for different learning needs.
 Bulk hours reduce the overall cost of lessons.
 Quality training stays consistent across all plans.
      </>,
  },
  {
    question: "Can you use your instructor’s car for practice and test day?",
    answer:
     <>
     
    Modern dual-controlled vehicles are available for hire.
 Cars meet NSW testing requirements.
 An instructor supports you throughout the session.
     </>,
  },



];


export default function Service() {
  return (
    <div>
      <PageHeroSection
        title={`Top-Rated Driving Lessons Services for Fast Learners`}
        subtitle={<>
        At <Link className="font-semibold underline px-1" href={`/`}>Test Route Driving School,</Link> we provide expert <strong>driving lessons services</strong> across Sydney. Our lessons help you gain confidence, learn quickly, and become a safe driver. Flexible packages suit every learner.
        </>}
      />

      <ServicesCards />
      <MovingCar />
      <Faq faqs={faqs}/>
    </div>
  );
}
