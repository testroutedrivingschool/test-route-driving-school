"use client";

import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Link from "next/link";
import Script from "next/script";
import React, {useMemo, useState} from "react";
import {FaChevronDown} from "react-icons/fa";

const faqs = [
  {
    question: "Do you offer automatic driving lessons near me?",
    answer: (
      <>
        Yes. You receive{" "}
        <Link
          className="location-link"
          href={"/services/automatic-driving-lessons"}
        >
          automatic driving lessons
        </Link>{" "}
        across Sydney&apos;s suburbs with licensed instructors. You practise on
        real test routes and local roads. This helps you build confidence
        faster.
      </>
    ),
  },
  {
    question: "Are automatic lessons good for beginner drivers?",
    answer:
      "Yes. You learn faster because autonomous cars remove the need for clutch control. You focus more on steering, road signs, and traffic awareness.",
  },
  {
    question: "What cars do you use for automatic lessons?",
    answer:
      "You drive modern automatic vehicles with dual brakes. These cars meet NSW safety standards. Your instructor controls the vehicle when needed.",
  },
  {
    question: "How many automatic lessons do I need before testing?",
    answer: (
      <>
        You need lessons based on your driving skills and confidence level. Most
        learners require regular practice on test routes. Your{" "}
        <Link className="location-link" href={"/instructors"}>
          instructor
        </Link>
        guides you on readiness.
      </>
    ),
  },
  {
    question: "What is a driving test assessment?",
    answer:
      "You complete a full mock test under real exam conditions. Your instructor follows Service NSW testing rules. You receive detailed feedback.",
  },
  {
    question: "Why should I take a pre-driving test assessment?",
    answer:
      "You identify common mistakes before your official test. This reduces your risk of failure. You improve weak areas early.",
  },
  {
    question: "Does the assessment follow Service NSW standards?",
    answer: (
      <>
        Yes. You practise according to the current NSW testing guidelines. Your{" "}
        <Link
          className="location-link"
          href={"/services/driving-test-assessment"}
        >
          assessment
        </Link>{" "}
        reflects real examiner expectations.
      </>
    ),
  },
  {
    question: "Can assessments help nervous learners?",
    answer:
      "Yes. You gain confidence through repeated test-style practice. You learn how to manage pressure and stay focused.",
  },
  {
    question: "What is included in your driving test package?",
    answer: (
      <>
        You receive practice lessons, a mock assessment, and test-day support.
        The
        <Link className="location-link" href={"/services/driving-test-package"}>
          package
        </Link>{" "}
        consists of car hire if required. This prepares you fully.
      </>
    ),
  },
  {
    question: "Is a test package better than single lessons?",
    answer:
      "Yes. You follow a structured learning plan. This saves money and improves consistency. You progress faster.",
  },
  {
    question: "Can beginners book a driving test package?",
    answer: (
      <>
        Yes. You start from basic skills and progress step by step. Your
        instructor adapts the{" "}
        <Link className="location-link" href={"/services/driving-test-package"}>
          package
        </Link>{" "}
        to your level.
      </>
    ),
  },
  {
    question: "Do you help with last-minute test preparation?",
    answer:
      "Yes. You receive focused revision on test routes and manoeuvres. This improves your confidence before the exam.",
  },
  {
    question: "Do you provide car hire for driving tests?",
    answer:
      "Yes. You can hire a dual-controlled vehicle for your test. The car meets Service NSW requirements.",
  },
  {
    question: "Are your cars fitted with dual brakes?",
    answer:
      "Yes. Your instructor controls braking when necessary. This ensures safety during lessons and tests.",
  },
  {
    question: "Can I practise before using the test car?",
    answer:
      "Yes. You receive familiarisation lessons in the same vehicle. This reduces stress on test day.",
  },
  {
    question: "Is car hire available in all suburbs?",
    answer:
      "Yes. You can book test vehicles across Sydney's suburbs. Availability depends on your test location.",
  },
  {
    question: "Do you teach parallel and reverse parking?",
    answer:
      "Yes. You learn parallel, reverse, and angle parking. You practise in real street conditions.",
  },
  {
    question: "Who needs parking lesson packages?",
    answer: (
      <>
        You benefit if you struggle with tight spaces. These{" "}
        <Link className="location-link" href={"/services/parking-package"}>
          package
        </Link>{" "}
        focus only on parking skills.
      </>
    ),
  },
  {
    question: "How long does parking training take?",
    answer:
      "You usually improve within a few targeted sessions. Your progress depends on practice and coordination.",
  },
  {
    question: "Are parking lessons included in test preparation?",
    answer:
      "Yes. You practise required parking manoeuvres for the driving test. This improves pass chances.",
  },
  {
    question: "Do you offer highway driving lessons near me?",
    answer:
      "Yes. You practise on NSW highways and major roads. You learn safe high-speed driving techniques.",
  },
  {
    question: "What skills do highway lessons cover?",
    answer:
      "You learn merging, lane changing, and speed control. You also practise safe overtaking.",
  },
  {
    question: "Are highway lessons good for new drivers?",
    answer: (
      <>
        Yes. You gain confidence on faster roads. You learn how to handle
        traffic safely.
      </>
    ),
  },
  {
    question: "Are highway lessons included in packages?",
    answer: (
      <>
        Yes. You can add{" "}
        <Link className="location-link" href={"/services/driving-test-package"}>
          highway training
        </Link>{" "}
        to your learning plan. This improves overall driving ability.
      </>
    ),
  },
  {
    question: "Do you provide night driving lessons?",
    answer:
      "Yes. You practise driving in low-light conditions. You learn proper headlight and visibility control.",
  },
  {
    question: "What do night lessons focus on?",
    answer:
      "You develop hazard detection and reaction skills. You improve judgment in dark environments.",
  },
  {
    question: "Who should take night driving classes?",
    answer: (
      <>
        You benefit if you feel unsure after sunset. These
        <Link className="location-link" href={"/services/night-driving-lesson"}>
          lessons{" "}
        </Link>{" "}
        improve safety awareness.
      </>
    ),
  },
  {
    question: "Are night lessons flexible in timing?",
    answer:
      "Yes. You can book evening sessions that suit your schedule. Weekend slots are also available.",
  },
  {
    question: "Do you teach city driving in Sydney suburbs?",
    answer:
      "Yes. You practise on busy roads and intersections. You learn to handle peak-hour traffic.",
  },
  {
    question: "Do you provide car hire for instructor service?",
    answer: (
      <>
        Yes, we offer car hire for instructor services. Our dual-controlled
        vehicles are available for lessons and test preparation.
        <Link
          className="location-link"
          href={"/services/car-hire-for-instructor"}
        >
          {" "}
          Learn more about car hire.
        </Link>
      </>
    ),
  },
  {
    question: "What skills do city driving lessons build?",
    answer:
      "You improve lane discipline and gap selection. You learn defensive driving techniques.",
  },
  {
    question: "Are city lessons helpful before the test?",
    answer: (
      <>
        Yes. You face complex routes during exams.{" "}
        <Link className="location-link" href={"/services/city-driving-package"}>
          City lessons
        </Link>{" "}
        prepare you for these conditions.
      </>
    ),
  },
  {
    question: "Why choose city driving packages?",
    answer: (
      <>
        You gain real-world urban driving experience. This improves{" "}
        <a
          target="_blank"
          className="location-link"
          href={"https://www.nhtsa.gov/ten-tips-for-safe-driving"}
        >
          {" "}
          safety
        </a>{" "}
        and test performance.
      </>
    ),
  },
];

export default function FAQPAGE() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const faqSchema = useMemo(() => {
    const clean = (v) =>
      String(v || "")
        .replace(/\s+/g, " ")
        .trim();

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: clean(f.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: clean(f.answer),
        },
      })),
    };
  }, []);
  return (
    <div>
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
      />
      <PageHeroSection
        title="Frequently Asked Questions"
        subtitle="Find answers to all common questions about our driving lessons, packages, and services at Test Route Driving School."
      />

      <section className="py-16 ">
        <Container>
          <SectionHeader
            className={`mt-0!`}
            title="Frequently Asked Questions About Test Route Driving School (Sydney Suburbs)"
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
                  <p className="mt-3 text-neutral">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
