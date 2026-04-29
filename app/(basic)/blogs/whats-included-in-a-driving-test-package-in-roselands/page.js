/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaHandPointer } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";

import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "What’s Included in a Driving Test Package in Roselands?",
  description:
    "Success faster with a driving test package in Roselands - includes car, instructor & test prep. Book now for confidence and success.",
  keywords: [
    "driving test package in Roselands",
"driving test package",
"driving test package price in Roselands",
"driving test package cost",
"driving test package near Roselands",
"best driving test package in Roselands",
"driving test package with car",
"driving lessons and test package",
"book driving test package",
"fast track driving test package",
"complete driving test package with instructor and car",
  ],
};

const toc = [
  { id: "intro", label: "Driving Test Package in Roselands" },
  { id: "what-is", label: "What Is a Driving Test Package" },
  { id: "included", label: "What’s Included in a Driving Test Package" },
  { id: "benefits", label: "Key Benefits" },
  { id: "cost", label: "Driving Test Package Cost" },
  { id: "comparison", label: "Package vs Single Lessons" },
  { id: "booking", label: "How to Book" },
  { id: "tips", label: "Expert Tips" },
  { id: "faqs", label: "FAQs" },
];

const faqs = [
  {
    question: "What is included in a driving test package in Roselands?",
    answer:
      "A driving test package in Roselands usually includes a pre-test lesson, instructor guidance, and a car for the driving test.",
  },
  {
    question: "How much does a driving test package cost in Roselands?",
    answer:
      "The driving test package cost varies depending on the level of preparation, but it is often more cost-effective than separate lessons.",
  },
  {
    question: "Can I get a driving test package with a car included?",
    answer:
      "Yes, most packages include a dual-control car that you use for both practice and the test.",
  },
  {
    question: "Is a fast-track driving test package worth it?",
    answer:
      "Yes, a fast-track driving test package helps you focus on test-specific skills and pass faster.",
  },
  {
    question: "How do I book a driving test package near Roselands?",
    answer:
      <>
      You can easily book a driving test package by contacting a local <Link href="https://en.wikipedia.org/wiki/Driver%27s_education" className="location-link" target="_blank">driving</Link>  school that offers structured test preparation.
      </>,
  },
];

export default function Blog21() {
  return (
    <section>
      <PageHeroSection
        title={"What’s Included in a Driving Test Package in Roselands?"}
        subtitle={
          <>
            A <Link href="/driving-school-in/roselands" className="location-link" >driving test package in Roselands</Link>  gives you everything you need to pass your driving test in one structured plan. It includes a car, instructor guidance, and real test route practice. You focus on test-specific skills instead of general driving. This approach reduces mistakes and builds confidence quickly. It is one of the fastest ways to become fully test-ready.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <Image
            src={"/images/blog/blog21.png"}
            alt="Driving Test Package Roselands"
            width={1200}
            height={800}
            className="w-full object-cover rounded-2xl"
            priority
          />
        </section>

        <section className="mt-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ARTICLE */}
            <article className="lg:col-span-8">
              <div className="rounded-2xl bg-white shadow-lg border border-border-color px-4 md:px-6 py-6 md:py-8">
                <div className="space-y-10 text-neutral leading-8">

                  {/* WHAT IS */}
                  <section id="what-is">
                    <h2 className="text-2xl font-bold">
                      What Is a Driving Test Package and Why Does It Matter
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      When your driving test is close, the biggest challenge is not just driving — it is handling pressure. Many learners in Roselands come to us feeling unsure, even after multiple lessons. That usually happens because they practiced driving, but not the actual test.
                      <br /><br />
                      A  <Link href="/driving-school-in/roselands" className="location-link" >driving test package in Roselands</Link> solves this problem by giving you a structured plan focused on passing. Instead of random lessons, you follow a clear process that prepares you for real test conditions.
                      <br /><br />
                      From our experience working with learners across Kogarah and nearby suburbs, students who choose a proper <strong>driving test package</strong> feel more confident and make fewer mistakes during the exam. You don’t just learn how to control the car — you learn how to think like a test-ready driver.
                    </p>
                  </section>

                  {/* INCLUDED */}
                  <section id="included">
                    <h2 className="text-2xl font-bold">
                      What’s Included in a Driving Test Package in Roselands
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      A professional  <Link href="/packages" className="location-link" >driving test package with a car</Link> is designed to remove all stress from your test day. You don’t need to worry about arranging a vehicle or figuring out routes. Everything is planned for you.
                      <br /><br />
                      Most packages include a pre-test lesson where we assess your driving and fix last-minute mistakes. After that, you practice on actual test routes in Roselands, which helps you understand common intersections, roundabouts, and traffic patterns.
                      <br /><br />
                      You also get access to a dual-control vehicle for the test, which gives you safety and familiarity. On top of that, your instructor guides you through the full process, from pick-up to test completion. This complete setup is why many learners prefer a  <Link href="/services" className="location-link" >complete driving test package with an instructor and a car</Link> rather than separate lessons.
                    </p>
                  </section>

                  {/* BENEFITS */}
                  <section id="benefits">
                    <h2 className="text-2xl font-bold">
                      Key Benefits of Choosing a Driving Test Package
                    </h2>

                    <Image
                      src={"/images/blog/infographics/blog21-KeyBenefits.png"}
                      alt="Driving Test Package Benefits Infographic"
                      width={1200}
                      height={800}
                      className="w-full object-cover rounded-xl my-4"
                    />

                    <p className="mt-3 text-sm md:text-base leading-7">
                      When you choose a driving lessons and test package, you make your learning more focused and efficient. Instead of wasting time on areas that do not matter for the exam, you concentrate on what actually helps you pass.
                    </p>

                    <ul className="list-disc pl-6 mt-3">
                      <li>practice on real test routes in Roselands</li>
                      <li>Reduce test-day anxiety with proper preparation</li>
                      <li>improve observation and decision-making skills</li>
                      <li>avoid common mistakes like poor lane positioning</li>
                      <li>save time compared to taking random lessons</li>
                    </ul>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We have seen many learners fail once or twice before switching to a structured package. After that, they pass because they finally understand how the test works.
                    </p>
                  </section>

                  {/* COST */}
                  <section id="cost">
                    <h2 className="text-2xl font-bold">
                      Driving Test Package Cost in Roselands – What to Expect
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The  <Link href="/driving-school-in/roselands" className="location-link" >driving test package in Roselands</Link> depends on the level of training and support included. Some packages only cover basic lessons, while others offer full preparation with instructor guidance and car access.
                    </p>

                    <table className="mt-4 w-full text-sm md:text-base border rounded-lg overflow-hidden">
                      <thead className="bg-base-200">
                        <tr>
                          <th className="p-3 border-b">Feature</th>
                          <th className="p-3 border-b">Basic Package</th>
                          <th className="p-3 border-b">Standard Package</th>
                          <th className="p-3 border-b">Complete Driving Test Package</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Pre-Test Lesson", "Short session", "Full lesson", "Extended training"],
                          ["Car for Test", "Included", "Included", "Included"],
                          ["Instructor Support", "Basic", "Full guidance", "Priority support"],
                          ["Test Route Practice", "Limited", "Yes", "Full coverage"],
                          ["Confidence Level", "Medium", "High", "Very High"],
                        ].map(([f, a, b, c]) => (
                          <tr key={f}>
                            <td className="p-3 border-b">{f}</td>
                            <td className="p-3 border-b">{a}</td>
                            <td className="p-3 border-b">{b}</td>
                            <td className="p-3 border-b">{c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      When you compare options, you will notice that a slightly higher  <Link href="/services/driving-test-package" className="location-link" >driving test package cost</Link> often gives you much better results. It increases your chance of passing on the first attempt, which saves both time and money in the long run.
                    </p>
                  </section>

                  {/* COMPARISON */}
                  <section id="comparison">
                    <h2 className="text-2xl font-bold">
                      Driving Lessons and Test Package vs Single Lessons
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Many learners ask whether they should continue with single lessons or switch to a <strong>driving lessons and test package.</strong> Based on our experience, single lessons help you learn basic driving, but they do not fully prepare you for the pressure of the test.
                      <br /><br />
                      A <strong>fast-track driving test package</strong> focuses on test performance. You practice real scenarios, learn how examiners assess you, and develop the awareness needed to avoid critical errors.
                      <br /><br />
                      When you follow a structured approach, your progress becomes faster and more predictable. That is why learners who want quick results often choose a driving test package near Roselands instead of continuing with general lessons.
                    </p>
                  </section>

                  {/* BOOKING */}
                  <section id="booking">
                    <h2 className="text-2xl font-bold">
                      How to Book the Best Driving Test Package in Roselands
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Choosing the best driving test package in Roselands requires more than just comparing prices. You need to look at the quality of training and the experience of the instructor.
                      <br /><br />
                      A good package should include real test route practice, personalised feedback, and a clear strategy for test day. You should also feel comfortable with your instructor, because confidence plays a big role in your performance.
                      <br /><br />
                      When you book a driving test package, you are not just booking a lesson — you are preparing for one of the most important milestones in your driving journey.
                    </p>
                  </section>

                  {/* TIPS */}
                  <section id="tips">
                    <h2 className="text-2xl font-bold">
                      Expert Tips to Pass Your Driving Test Faster
                    </h2>
                    <ul className="list-disc pl-6 mt-3">
                      <li>Always follow the mirror-signal-manoeuvre routine</li>
                      <li>Keep a steady speed and avoid sudden braking</li>
                      <li>Check blind spots at every turn</li>
                      <li>Stay calm and focus on your surroundings</li>
                      <li>Take a mock test before your actual exam</li>
                    </ul>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      These habits may seem simple, but they directly impact your test results.
                    </p>
                  </section>

                  {/* FAQ */}
                  <section id="faqs">
                    <FaqSection title="Frequently Asked Questions" faqs={faqs} className={"bg-white py-0"} />
                  </section>
                </div>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <BlogToc items={toc} offset={88} />

                <div className="rounded-2xl border border-border-color bg-white shadow-sm p-5">
                  <h3 className="text-lg font-bold text-secondary">
                    Start Your Driving Test Journey with Test Route Driving School
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    If you are looking for a reliable driving test package in Roselands, we are here to help you succeed.
                    <br /><br />
                    At Test Route Driving School, we focus on real test preparation, confidence building, and personalised training. We guide you step by step so you feel ready, not nervous, on your test day.
                  </p>

                  <div className="mt-4 space-y-3">
                    <a href="tel:61412018593" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-5 py-3 font-semibold">
                      <IoCallSharp /> Call 0412 018 593
                    </a>

                    <Link href="/bookings" className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color">
                      <FaHandPointer /> Book Online
                    </Link>

                    <a href="mailto:testroutedrivingschool@gmail.com" className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color">
                      <FaEnvelope /> Send Email
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </Container>
    </section>
  );
}