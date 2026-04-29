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
  title:
    "Eastgardens Driving School Guide for Success - Master the Road",
  description:
    "Pass your driving test with ease. Our Eastgardens school offers expert coaching and affordable lesson packages. Book your first session today for total road mastery.",
  keywords: [
    "Eastgardens Driving School",
"driving school Eastgardens",
"best driving school Eastgardens",
"driving lessons Eastgardens",
"affordable driving school Eastgardens",
"professional driving instructors Eastgardens",
"automatic driving lessons",
"manual driving lessons",
"learner driver courses",
"driving lesson packages",
"intensive driving course",
"driving test preparation",
"female driving instructor",
  ],
};

const toc = [
  { id: "intro", label: "Eastgardens Driving School Guide" },
  { id: "why", label: "Why Choose This School" },
  { id: "instructors", label: "Driving Instructors Eastgardens" },
  { id: "packages", label: "Lesson Packages" },
  { id: "framework", label: "Training Framework" },
  { id: "tips", label: "Expert Tips" },
  { id: "faqs", label: "FAQs" },
];

const faqs = [
  {
    question:
      "How do I find the best driving school in Eastgardens for my budget?",
    answer:
      "You should look for a school that offers bulk driving lesson packages and high-quality instruction. We provide an affordable driving school Eastgardens service that combines top-tier safety with competitive pricing.",
  },
  {
    question: "Do you offer a female driving instructor for local lessons?",
    answer:
      "Yes, we understand that many students feel more relaxed with a female driving instructor. We offer diverse staff options to ensure you feel completely at ease during your training.",
  },
  {
    question:
      "What is the difference between an intensive driving course and weekly lessons?",
    answer:
      "An intensive driving course compresses your training into a shorter timeframe, which is great for building momentum quickly. Weekly driving lessons in Eastgardens sessions are better for those who need more time to process new information between drives.",
  },
  {
    question: "Is manual or automatic better for Sydney traffic?",
    answer:
      "Most of our students choose automatic driving lessons because they are much easier for managing heavy Sydney traffic. However, we still offer expert manual driving lessons for those who want a license for all vehicle types.",
  },
  {
    question:
      "Why is driving test preparation so important at Eastgardens?",
    answer:
      "The local area has very specific traffic patterns and challenging intersections. Our driving test preparation ensures you have practiced on the exact streets the examiners use, giving you a massive advantage.",
  },
];

export default function Blog33() {
  return (
    <section>
      <PageHeroSection
        title={
          "Eastgardens Driving School Guide: Packages, Road Practice & Test Success"
        }
        subtitle={
          <>
            Finding a reliable <Link href="/driving-school-in/eastgardens" className="location-link" >Eastgardens driving school</Link>  is the first step toward securing your independence on Sydney's busy roads. We provide a structured learning environment that focuses on technical car control, defensive driving, and deep familiarity with local test routes. Our certified instructors use modern, dual-controlled vehicles to ensure your safety while you build the confidence needed for high-traffic scenarios. Whether you need manual or automatic training, our <strong>personalized lesson packages</strong> are designed to help you pass the NSW driving test on your very first try. Join our community of successful drivers and start your journey toward a lifetime of safe road usage today.
          </>
        }
      />

      <Container>
        {/* IMAGE */}
        <section className="mt-8 md:mt-12">
          <Image
            src={"/images/blog/blog33.png"}
            alt="Eastgardens Driving School"
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

                  {/* WHY */}
                  <section id="why">
                    <h2 className="text-2xl font-bold">
                      Why Test Route Driving School is the Best Driving School Eastgardens Offers
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Navigating the bustling traffic around the Eastgardens shopping precinct requires more than just knowing how to turn a steering wheel. We have spent over a decade sitting beside thousands of students in this region, and we know that the right environment makes all the difference. As a leading Eastgardens driving school, we focus on transforming nervous beginners into decisive, safe road users. We don't just teach you to pass a test; we teach you to survive and thrive in real-world Sydney traffic. Our <Link href="/" className="location-link" >driving school Eastgardens</Link> team provides the emotional safety net you need to learn without the fear of making mistakes.
                      <br /><br />
                      We believe that professional mentorship beats casual practice because we provide a specific, results-driven curriculum. Many learners struggle with the complex roundabouts and busy merging lanes near the Westfield area. As your <Link href="/instructors" className="location-link" >professional driving instructors,</Link> Eastgardens specialists, we break these high-pressure tasks into small, manageable steps. This structured approach is why we are consistently rated as the best driving school Eastgardens families trust for their children's safety and success.
                    </p>
                  </section>

                  {/* INSTRUCTORS */}
                  <section id="instructors">
                    <h2 className="text-2xl font-bold">
                      Transform Your Skills with Professional Driving Instructors Eastgardens
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Choosing the right mentor is the most important decision you will make in your driving journey. We have seen how a patient, encouraging coach can change a student's entire perspective on the road. Whether you are looking for a female driving instructor for extra comfort or a specialist in <Link href="/services/automatic-driving-lessons" className="location-link" >automatic driving lessons,</Link> we have the perfect match for you. We use our ten years of on-road experience to identify your unique learning style and adjust our tone to suit your needs.
                    </p>

                    <Image
                      src={"/images/blog/infographics/blog-33-infographic.png"}
                      alt="Benefits of Our Training Program"
                      width={1200}
                      height={800}
                      className="w-full object-cover rounded-xl my-4 border border-border-color"
                    />

                    <h2 className="mt-2 text-xl font-bold">
                      The Massive Benefits of Our Training Program
                    </h2>
                    <ul className="list-disc pl-6">
                      <li>Dual-Control Safety: Every car in our fleet features an extra brake on the instructor's side, allowing us to step in and keep you safe at any second.</li>
                      <li>Flexible Learning Options: We provide both manual driving lessons for full mechanical control and automatic driving lessons for a faster path to your license.</li>
                      <li>Affordable Excellence: We offer the most competitive rates for an affordable driving school Eastgardens can rely on without ever cutting corners on quality.</li>
                      <li>Triple Logbook Hours: In NSW, your first ten hours with us count for thirty hours in your logbook, helping you reach your goals three times faster.</li>
                    </ul>
                  </section>

                  {/* PACKAGES */}
                  <section id="packages">
                    <h2 className="text-2xl font-bold">
                      Master the Road with Tailored Driving Lesson Packages
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      We know that every learner has a different budget and a different timeline. That is why we offer various driving lesson packages that cater to everyone from total novices to those just needing a final brush-up. If you have a deadline to meet, our intensive driving course can help you gain weeks of experience in just a few days. We focus on building your muscle memory through repetition and high-quality feedback.
                      <br /><br />
                      Our learner driver courses are not just about wandering the streets. We take you to the specific locations where you will eventually be tested. This deep driving test preparation is our specialty. We simulate the actual exam environment, including the silence of the examiner and the specific verbal cues they use. By the time your actual test date arrives, you will feel like you are just going for a casual drive on familiar roads.
                    </p>
                  </section>

                  {/* FAQ */}
                  <section id="faqs">
                    <FaqSection title="FAQs" faqs={faqs} className="bg-white py-0" />
                  </section>

                </div>
              </div>
            </article>

            {/* SIDEBAR (FIXED like Blog16) */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <BlogToc items={toc} offset={88} />

                <div className="rounded-2xl border border-border-color bg-white shadow-sm p-5">
                  <h3 className="text-lg font-bold text-secondary">
                   Claim Your Road Independence With Test Route Driving School

                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                 Your path to a full license shouldn't be a source of stress. At <Link href="/" className="location-link" >Test Route Driving School,</Link>  our Eastgardens Driving School services provide the patience, the modern safety equipment, and the decade of experience you need to succeed. We take you from your very first turn of the key to the moment you receive your P-plates. Whether you need an intensive driving course or just a few <Link href="https://en.wikipedia.org/wiki/Driver%27s_education" className="location-link" target="_blank">learner</Link>  driver courses, we are here to support your journey.

                  </p>

                  <div className="mt-4 space-y-3">
                    <a
                      href="tel:61412018593"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-5 py-3 font-semibold"
                    >
                      <IoCallSharp />
                      Call 0412 018 593
                    </a>

                    <Link
                      href="/bookings"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color"
                    >
                      <FaHandPointer />
                      Book Online
                    </Link>

                    <a
                      href="mailto:info@testroutedrivingschool.com.au"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color"
                    >
                      <FaEnvelope />
                      Send Email
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