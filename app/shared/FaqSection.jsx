"use client";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {useState} from "react";
import {FaChevronDown} from "react-icons/fa";

const faqData = [
  {
    question: "How many lessons do I need to pass my driving test?",
    answer:
      "The number of lessons varies for each learner. On average, most students require between 5–10 lessons depending on experience, confidence, and driving skills.",
  },
  {
    question: "Do you provide pickup and drop-off for lessons?",
    answer:
      "Yes, we offer convenient pickup and drop-off from your home, school, workplace, or a preferred location within our service area.",
  },
  {
    question: "Which suburbs do your instructors cover?",
    answer:
      "Our instructors cover a wide range of suburbs including Allawah, Arncliffe, Bexley, Rockdale, Hurstville, Kogarah, and more.",
  },
  {
    question: "What type of car will I learn in?",
    answer:
      "You will learn in a modern automatic vehicle equipped with dual controls to ensure maximum safety during your training.",
  },
  {
    question: "Can I book lessons online?",
    answer:
      "Yes! You can easily book your driving lessons online through our website's booking form anytime.",
  },
 
  {
    question: "Which suburbs do your instructors cover?",
    answer:
      "Our instructors cover a wide range of suburbs including Allawah, Arncliffe, Bexley, Rockdale, Hurstville, Kogarah, and more.",
  },
  {
    question: "What type of car will I learn in?",
    answer:
      "You will learn in a modern automatic vehicle equipped with dual controls to ensure maximum safety during your training.",
  },
  {
    question: "Can I book lessons online?",
    answer:
      "Yes! You can easily book your driving lessons online through our website's booking form anytime.",
  },
];

export default function FaqSection({className}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`bg-base-300  py-16 ${className}`}>
      <Container>
        <SectionHeader className={`mt-0! `} title={`Frequently Asked Questions`} subtitle={"Learn everything you need to know about our lessons, pricing, booking process, and instructor qualifications in one place"}/>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
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
