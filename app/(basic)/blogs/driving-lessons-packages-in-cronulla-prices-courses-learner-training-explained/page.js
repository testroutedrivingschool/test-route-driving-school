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
    "Driving Lessons Packages in Cronulla | Affordable Expert Training",
  description:
    "Explore affordable driving lesson packages in Cronulla with expert instructors. Learn safely, build confidence, and pass your NSW driving test faster.",
  keywords: [
    "Driving Lessons Packages in Cronulla",
    "driving lessons Cronulla",
    "driving school Cronulla",
    "automatic driving lessons",
    "manual driving lessons",
    "learner driver lessons",
    "defensive driving lessons",
    "intensive driving course",
    "driving test preparation",
    "cheap driving lessons Cronulla",
  ],
};

const toc = [
  { id: "intro", label: "Driving Lessons Packages in Cronulla" },
  { id: "why", label: "Why Choose Packages" },
  { id: "coastal", label: "Learner Driver Lessons" },
  { id: "course", label: "Intensive Driving Course" },
  { id: "framework", label: "Driving Framework" },
  { id: "tips", label: "Expert Secrets" },
  { id: "faqs", label: "FAQs" },
];

const faqs = [
  {
    question:
      "How much do driving lesson packages in Cronulla usually cost?",
    answer:
      <>
      Our <Link href="/driving-school-in/carlton" className="location-link" >driving lesson packages in Cronulla </Link> vary based on the number of hours you need. Buying a bundle always saves you money compared to single sessions, providing cheap driving lessons Cronulla families can trust.
      </>,
  },
  {
    question: "What is the benefit of the 3-for-1 logbook rule?",
    answer:
      "In NSW, every 1 hour you spend with a professional driving school Cronulla instructor counts as 3 hours in your logbook (up to 10 hours). This helps you reach your 120-hour goal much faster.",
  },
  {
    question:
      "Do you offer both automatic and manual driving lessons?",
    answer:
      "Yes. We have a modern fleet that includes both types. Most students prefer automatic driving lessons for ease, but we highly recommend manual driving lessons if you want to drive commercial vehicles later.",
  },
  {
    question:
      "Can I book an intensive driving course if I am a total beginner?",
    answer:
      "Absolutely. We tailor our intensive driving course to your starting point. We move as fast as you are comfortable, ensuring you master every skill safely before moving to the next.",
  },
  {
    question:
      "Why is driving test preparation different in Cronulla?",
    answer:
      "The local area has unique traffic patterns and specific testing routes. Our driving test preparation ensures you are familiar with the exact streets the examiners will use, giving you a huge advantage.",
  },
];

export default function Blog31() {
  return (
    <section>
      <PageHeroSection
        title={
          "Driving Lessons Packages in Cronulla for Learners - Affordable Expert Training"
        }
        subtitle={
          <>
            Finding the right <Link href="/packages" className="location-link" >driving lessons packages</Link>  in Cronulla is the most
            efficient way to transition from a learner to a fully licensed
            driver. We offer a variety of structured courses that focus on car
            control, hazard awareness, and local test route familiarity. Our
            professional instructors use dual-controlled vehicles to ensure your
            safety while you build the confidence needed for Sydney’s coastal
            roads. Whether you prefer automatic or manual training, our packages
            provide the repetition and expert feedback required for success.
            Start your journey today with a training plan designed to help you
            pass the NSW driving test on your first attempt.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <Image
            src={"/images/blog/blog31.png"}
            alt="Driving Lessons Packages Cronulla"
            width={1200}
            height={800}
            className="w-full object-cover rounded-2xl"
            priority
          />
        </section>

        <section className="mt-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <article className="lg:col-span-8">
              <div className="rounded-2xl bg-white shadow-lg border border-border-color px-4 md:px-6 py-6 md:py-8">
                <div className="space-y-10 text-neutral leading-8">

                  {/* WHY */}
                  <section id="why">
                    <h2 className="text-2xl font-bold text-secondary">
                      Why Choosing Driving Lessons Packages in Cronulla is Your Best Path to Success
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Learning to drive along the coast comes with unique challenges, from beachside pedestrians to busy weekend traffic. We have spent over ten years helping students navigate these exact conditions with ease. Choosing our <Link href="/driving-school-in/cronulla" className="location-link" >Driving Lessons Packages in Cronulla</Link> allows you to save money while receiving a consistent, high-quality education. Instead of disconnected single sessions, a package ensures we follow a logical skill-building path. We don't just teach you how to pass; we teach you how to drive safely for the rest of your life.
                      <br /><br />
                      When you join our driving school in Cronulla, you aren't just a number to us. We treat every student like a family member, providing the patience and encouragement you need to overcome "first-time" nerves. Our <Link href="/driving-school-in/cronulla" className="location-link" >driving package Cronulla</Link> options are perfect for busy students or working professionals who need a reliable schedule. We take the guesswork out of your logbook hours by providing structured training that counts for triple time under the NSW scheme.
                    </p>
                  </section>

                  {/* COASTAL */}
                  <section id="coastal">
                    <h2 className="text-2xl font-bold text-secondary">
                      Master the Coastal Roads with Expert Learner Driver Lessons
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Operating a vehicle in a busy suburb like Cronulla requires sharp reflexes and a calm mind. As your dedicated mentors, we focus heavily on "active observation." This means we teach you to spot a door opening or a ball rolling into the street long before it becomes a problem. Our learner driver lessons are designed to be engaging and interactive. We use simple English and clear instructions so you never feel confused behind the wheel.
                    </p>
  <Image
                      src={"/images/blog/infographics/blog-31-infographic.png"}
                      alt=" Master the Coastal Roads with Expert Learner Driver Lessons"
                      width={1200}
                      height={800}
                      className="w-full object-cover rounded-xl my-4 border border-border-color"
                    />
                    <h3 className="text-lg font-bold text-secondary mt-2">
                      The Massive Benefits of Professional Package Training
                    </h3>
                    <ul className="mt-3 text-sm md:text-base list-disc pl-6">
                      <li>Dual-Control Safety: Our modern vehicles allow us to intervene instantly, keeping you safe during your L plate driving lessons.</li>
                      <li>Automatic and Manual Options: We provide both automatic driving lessons for a stress-free experience and manual driving lessons for those who want to master gear shifts.</li>
                      <li>Affordable Pricing: We offer some of the most competitive driving lessons Cronulla has to offer, making professional safety accessible to everyone.</li>
                      <li>Defensive Driving Skills: Our defensive driving lessons teach you to stay safe in heavy rain or high-speed traffic, which is vital for Sydney drivers.</li>
                    </ul>
                  </section>

                  {/* COURSE */}
                  <section id="course">
                    <h2 className="text-2xl font-bold text-secondary">
                      From Beginner to Test-Ready: Our Intensive Driving Course Explained
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Sometimes, you need your license in a hurry for work or university. This is where an intensive driving course becomes your greatest tool. We compress the essential skills of the NSW curriculum into a focused timeframe. This keeps the information fresh in your mind and builds your confidence rapidly. However, we never skip the details. Even in a fast-paced course, we ensure your driving test preparation covers every technical maneuver an examiner expects to see.
                      <br /><br />
                      Our <Link href="/driving-school-in/carlton" className="location-link" >driving lesson packages in Cronulla </Link> focus on the specific areas where most students fail. We spend extra time on hill starts, three-point turns, and merging into fast-moving traffic. By the time you sit in the car with the RMS examiner, you will feel like you are just going for another drive with a friend. This mental shift is why our students have such a high first-time pass rate in the Sutherland Shire.
                    </p>
                  </section>

                  {/* FRAMEWORK */}
                  <section id="framework">
                    <h2 className="text-2xl font-bold text-secondary">
                      A Structured Framework for Your Driving Journey
                    </h2>
                    <table className="mt-4 w-full text-sm border rounded-lg overflow-hidden">
                      <thead className="bg-base-200">
                        <tr>
                          <th className="p-3 border-b">Phase of Learning</th>
                          <th className="p-3 border-b">Core Skills Focused On</th>
                          <th className="p-3 border-b">How Our Instructors Support You</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["The Basics","Steering and Pedal Control","Using quiet backstreets to build your foundational car control."],
                          ["Maneuvers","Parking and Turning","Breaking down the reverse parallel park into easy, visual steps."],
                          ["Traffic Flow","Intersections and Rounds","Coaching you on gap selection and correct signaling in real traffic."],
                          ["Test Mastery","Route Familiarity","Practicing on the actual Sydney test routes to remove any surprises."],
                          ["Independence","Defensive Awareness","Finalize your driving test preparation with a full mock exam."],
                        ].map(([a,b,c])=>(
                          <tr key={a}>
                            <td className="p-3 border-b">{a}</td>
                            <td className="p-3 border-b">{b}</td>
                            <td className="p-3 border-b">{c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {/* TIPS */}
                  <section id="tips">
                    <h2 className="text-2xl font-bold text-secondary">
                      Expert Secrets for Navigating Cronulla Like a Local Pro
                    </h2>
                    <ul className="mt-3 text-sm md:text-base list-disc pl-6">
                      <li>Watch the Beach Traffic: Pedestrians often walk out between cars near the water.</li>
                      <li>Master the Roundabout: Learn correct entry timing.</li>
                      <li>Manage the Glare: Use visor and focal points.</li>
                      <li>Slow Down in School Zones: Spot signs early.</li>
                    </ul>
                  </section>

                  {/* FAQ */}
                  <section id="faqs">
                    <FaqSection title="Frequently Asked Questions" faqs={faqs} />
                  </section>

                </div>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <BlogToc items={toc} offset={88} />

                <div className="rounded-2xl border bg-white shadow-sm p-5">
                  <h3 className="text-lg font-bold text-secondary">
Claim Your Road Freedom With Test Route Driving School
                  </h3>
                  <p className="mt-2 text-sm">
                    Don't let the fear of the road hold you back from your independence. At Test Route Driving School, our <strong>Driving Lessons Packages in Cronulla</strong> are the most reliable way to become a safe and confident driver. We provide the dual-control safety, the ten years of expert coaching, and the patient mentorship you deserve. Whether you are starting your L plate driving <Link href="https://en.wikipedia.org/wiki/Driver%27s_education" className="location-link" target="_blank">lessons</Link>  or need a final brush-up before your test, we are here to help.

                  </p>

                  <div className="mt-4 space-y-3">
                    <a href="tel:61412018593" className="btn-primary flex items-center justify-center gap-2">
                      <IoCallSharp /> Call
                    </a>
                    <Link href="/bookings" className="btn-outline flex items-center justify-center gap-2">
                      <FaHandPointer /> Book
                    </Link>
                    <a href="mailto:testroutedrivingschool@gmail.com" className="btn-outline flex items-center justify-center gap-2">
                      <FaEnvelope /> Email
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