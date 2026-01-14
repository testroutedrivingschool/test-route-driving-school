"use client";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {useState} from "react";
import {FaChevronDown} from "react-icons/fa";

const defaultFaqData = [
  {
    question: "How many lessons do I need to pass my driving test?",
    answer:
      "The number of lessons varies depending on your experience, confidence, and skill. Most learners typically need around 5–10 lessons to prepare thoroughly and succeed.",
  },
  {
    question: "Do you provide pickup and drop-off for lessons?",
    answer:
      "Yes! We offer convenient pickup and drop-off from your home, school, workplace, or a preferred location within Sydney suburbs for stress-free and flexible lesson arrangements.",
  },
  {
    question: "Which suburbs do your instructors cover?",
    answer:
      "Our instructors cover Allawah, Arncliffe, Bexley, Rockdale, Hurstville, Sydney suburbs, and nearby suburbs, ensuring you have access to professional driving lessons wherever you are located.",
  },
  {
    question: "What type of car will I learn in?",
    answer:
      "You will learn in a modern automatic vehicle equipped with dual controls, providing maximum safety and confidence during your driving lessons in Sydney suburbs.",
  },
  {
    question: "Can I book lessons online?",
    answer:
      "Yes! You can easily book your driving lessons online at any time through our Website, offering a convenient, fast, and simple way to secure your preferred schedule.",
  },
 

];

export default function FaqSection({className,faqs,title}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`bg-base-300  py-16 ${className}`}>
      <Container>
        <SectionHeader className={`mt-0! `} title={title?title:`Frequently Asked Questions`} subtitle={"Learn everything you need to know about our lessons, pricing, booking process, and instructor qualifications in one place"}/>

        <div className="space-y-4">
          {faqs?faqs.map((faq, index) => (
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
          )):defaultFaqData.map((faq, index) => (
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
  );
}
