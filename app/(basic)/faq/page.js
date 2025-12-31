"use client";

import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import React, {useState} from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What is included in Automatic Driving Lessons?",
    answer:
      "Our Automatic Driving Lessons focus on road safety, traffic rules, and practical driving skills using dual-control automatic cars, perfect for beginners or nervous drivers.",
  },
  {
    question: "Do you provide Manual Driving Lessons?",
    answer:
      "Yes, we offer Manual Driving Lessons to help learners gain full control of clutch, gears, and vehicle handling for a complete driving experience.",
  },
  {
    question: "What is the Driving Test Assessment service?",
    answer:
      "Driving Test Assessment is a pre-test evaluation where our instructors assess your readiness and guide you on areas to improve before taking the official driving test.",
  },
  {
    question: "What does the Driving Test Package include?",
    answer:
      "The Driving Test Package includes structured lessons, mock tests, and preparation tailored to help you pass your driving test efficiently.",
  },
  {
    question: "Can I hire a car for my instructor?",
    answer:
      "Yes, our Car Hire for Instructor service allows instructors to use dual-control cars for your driving lessons safely and efficiently.",
  },
  {
    question: "What is the Parking Package?",
    answer:
      "The Parking Package focuses on teaching you all types of parking skills including parallel, reverse, and angled parking in real scenarios.",
  },
  {
    question: "Do you offer Highway Packages?",
    answer:
      "Yes, the Highway Package teaches learners safe driving on highways, lane discipline, overtaking, and speed management.",
  },
  {
    question: "What is included in Night Driving Lessons?",
    answer:
      "Night Driving Lessons train you to drive safely after dark, improving your confidence and awareness during low-light conditions.",
  },
  {
    question: "Do you offer City Driving Packages?",
    answer:
      "Yes, the City Driving Package helps learners navigate busy city streets, traffic lights, and complex junctions safely.",
  },
  {
    question: "How long is each driving lesson?",
    answer:
      "Each lesson is typically 1–2 hours, depending on the learner's requirements and chosen package.",
  },
  {
    question: "Do I need to bring my own car?",
    answer:
      "No, we provide dual-control vehicles for all lessons, including automatic and manual cars.",
  },
  {
    question: "Can I choose my instructor?",
    answer:
      "Yes, learners can request a preferred instructor, subject to availability.",
  },
  {
    question: "Are lessons suitable for complete beginners?",
    answer:
      "Absolutely! Our lessons are designed for beginners with no prior experience, focusing on confidence and road safety.",
  },
  {
    question: "Do you provide mock driving tests?",
    answer:
      "Yes, our Driving Test Package includes mock tests to simulate real test conditions.",
  },
  {
    question: "Can I take lessons during weekends?",
    answer:
      "Yes, we offer flexible scheduling including evenings and weekends to accommodate your availability.",
  },
  {
    question: "Are your instructors certified?",
    answer:
      "Yes, all instructors are fully certified and have experience teaching in various driving scenarios.",
  },
  {
    question: "How do I book a driving lesson?",
    answer:
      "You can book lessons through our website or by contacting our office directly.",
  },
  {
    question: "Do you offer refresher courses?",
    answer:
      "Yes, refresher courses are available for learners who already have some driving experience but want to improve skills.",
  },
  {
    question: "Is there a minimum age for lessons?",
    answer:
      "Learners must meet the legal minimum driving age as per local regulations.",
  },
  {
    question: "Do you provide lesson packages for test preparation?",
    answer:
      "Yes, our Driving Test Packages are specifically designed to prepare learners for the official driving test.",
  },
  {
    question: "Can I switch between automatic and manual lessons?",
    answer:
      "Yes, learners can switch based on comfort and progress with the guidance of our instructors.",
  },
  {
    question: "Do you offer training for busy professionals?",
    answer:
      "Yes, our flexible schedules allow professionals to take lessons during evenings or weekends.",
  },
  {
    question: "How safe are the training vehicles?",
    answer:
      "All our vehicles are dual-control, regularly maintained, and equipped for safe learning experiences.",
  },
  {
    question: "Do you provide training on traffic rules?",
    answer:
      "Yes, all lessons cover traffic rules, road signs, hazard perception, and safe driving practices.",
  },
  {
    question: "Can I practice with my own car?",
    answer:
      "We recommend using our dual-control vehicles for safety, especially for beginners.",
  },
  {
    question: "How many lessons will I need to pass the test?",
    answer:
      "The number of lessons varies by learner. Our instructors will assess your progress and suggest the ideal number of lessons.",
  },
  {
    question: "Do you provide instruction for senior drivers?",
    answer:
      "Yes, we provide tailored lessons for learners of all ages, including seniors who wish to refresh or learn driving skills.",
  },
  {
    question: "Are lessons available for both city and highway driving?",
    answer:
      "Yes, our packages include city, highway, night, and parking training.",
  },
  {
    question: "What makes Test Route Driving School different?",
    answer:
      "We focus on personalized learning, certified instructors, modern vehicles, and flexible schedules to ensure every learner succeeds safely.",
  },
  {
    question: "Do you offer package discounts?",
    answer:
      "Yes, we offer discounts for multiple lessons and package bookings. Contact us for current offers.",
  },
  {
    question: "Can I cancel or reschedule a lesson?",
    answer:
      "Yes, lessons can be rescheduled or canceled in advance according to our policy.",
  },
];

export default function FAQPAGE() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <PageHeroSection
        title="Frequently Asked Questions"
        subtitle="Find answers to all common questions about our driving lessons, packages, and services at Test Route Driving School."
      />

      <section className="py-16 ">
        <Container>
          <SectionHeader
            className={`mt-0!`}
            title="Frequently Asked Questions About Driving Lessons"
            subtitle="Find answers to common questions about our automatic and manual driving lessons, test preparation packages, car hire services, and other driving school programs at Test Route Driving School."
          />
          <div className="space-y-4">
            {faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="border border-border-color rounded-lg p-4 shadow-sm"
                        >
                          <button
                            className="w-full flex justify-between items-center text-left"
                            onClick={() => toggleFaq(index)}
                          >
                            <h3 className="text-lg font-bold">{faq.question}</h3>
                            <FaChevronDown
                              className={`transition-transform duration-300 ${
                                openIndex === index ? "rotate-180" : ""
                              }`}
                            />
                          </button>
            
                          {openIndex === index && (
                            <p className="mt-3 text-gray-600">{faq.answer}</p>
                          )}
                        </div>
                      ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
