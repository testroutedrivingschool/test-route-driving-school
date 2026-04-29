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
    "Learn to Drive in Dolls Point for New Drivers - Master the Road Today",
  description:
    "Start your journey with expert guidance. We help you learn to drive in Dolls Point with safe, patient coaching. Book your first lesson now for total confidence.",
  keywords: [
    "Learn to Drive in Dolls Point",
"learn to drive Dolls Point",
"beginner driving lessons Dolls Point",
"learner driver lessons Dolls Point",
"driving school Dolls Point",
"driving instructor Dolls Point",
"automatic driving lessons",
"manual driving lessons",
"L plate driving lessons",
"first driving lesson tips",
"basic driving skills training",
"driving lesson packages",
"road safety for beginners",
  ],
};

const toc = [
  { id: "intro", label: "Learn to Drive in Dolls Point" },
  { id: "why", label: "Why Learn in Dolls Point" },
  { id: "basics", label: "Beginner Driving Lessons" },
  { id: "progress", label: "Skill Progression" },
  { id: "framework", label: "Training Framework" },
  { id: "tips", label: "Expert Tips" },
  { id: "faqs", label: "FAQs" },
];

const faqs = [
  {
    question: "How many lessons do I need before I feel comfortable?",
    answer:
      "Every person is different, but most students see a massive jump in confidence after 5 to 7 hours of professional coaching. When you learn to drive in Dolls Point with us, we move at a speed that makes you feel safe.",
  },
  {
    question: "Is it better to learn in an automatic or a manual car?",
    answer:
      "Most Sydney learners choose automatic driving lessons because they are easier in busy city traffic. However, manual driving lessons give you more control and a license to drive any car.",
  },
  {
    question: "What should I bring to my first driving lesson?",
    answer:
      "Just bring your learner's permit, comfortable flat-soled shoes, and a positive attitude! We provide the safe, modern vehicle and all the expert guidance you need.",
  },
  {
    question: "Do you offer driving lesson packages for beginners?",
    answer:
      "Yes, we offer bulk driving lesson packages that help you save money while ensuring you get the consistent practice needed to pass your test fthe irst time.",
  },
  {
    question:
      "How do professional lessons help with the 120-hour requirement?",
    answer:
      "In NSW, the first 10 hours of professional lessons count as 30 hours in your logbook. This is a huge help for any student doing their learner driver lessons in Dolls Point.",
  },
];

export default function Blog32() {
  return (
    <section>
      <PageHeroSection
        title={
          "Learn to Drive in Dolls Point: Beginner to Advanced Lessons with Expert Instructors"
        }
        subtitle={
          <>
            Starting your driving journey in the scenic area of Dolls Point
            requires a mix of technical skill and local road awareness. Our
            expert-led training focuses on building foundational car control,
            mastering smooth transitions, and understanding complex traffic
            flow. We provide a safe environment with modern dual-controlled
            vehicles so you can learn without stress or fear. Whether you prefer
            <Link href="/services/automatic-driving-lessons" className="location-link" >automatic or manual training,</Link> our structured lessons prepare you for
            real-world scenarios and the NSW driving test. Join our community of
            successful, licensed drivers and gain the independence you deserve
            today.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <Image
            src={"/images/blog/blog32.png"}
            alt="Learn to Drive in Dolls Point"
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
                      Why You Should Learn to Drive in Dolls Point with Professional Mentors
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Taking your first seat behind the wheel often feels like a mix of excitement and nerves. We have spent over a decade sitting beside thousands of students in the Bayside area, and we know that a calm start is the secret to success. When you learn to drive in Dolls Point, you get the benefit of practicing on beautiful, wide coastal roads that are perfect for building initial confidence. Our <Link href="/driving-school-in/dolls-point" className="location-link" >driving school Dolls Point</Link> team focuses on more than just passing a test; we want you to be a safe driver for life. We provide the emotional safety net you need to move from "survival mode" into true learning.
                      <br /><br />
                      Professional instruction beats casual practice because we provide a structured curriculum. Many parents mean well, but they often forget to explain the technical "why" behind road rules. As your dedicated driving instructor, Dolls Point specialist, we use our ten years of expertise to break down complex movements into tiny, manageable steps. We focus on road safety for beginners from the very first minute, ensuring you develop high-quality habits that stay with you forever.
                    </p>
                  </section>

                  {/* BASICS */}
                  {/* BASICS */}
<section id="basics">
  <h2 className="text-2xl font-bold text-secondary">
    Mastering the Basics: Your First Beginner Driving Lessons in Dolls Point
  </h2>
  <p className="mt-3 text-sm md:text-base leading-7">
    Your first driving lesson tips usually start with the "cockpit drill"—setting up your seat, mirrors, and seatbelt correctly. We believe that if you aren't comfortable, you can't be a safe driver. Our beginner driving lessons, which Dolls Point locals love, focus on smooth pedal control and steering precision. We take you to quiet streets where traffic is minimal so you can master the car without pressure. This basic driving skills training forms the foundation for everything else you will do on the road.
  </p>

  {/* ✅ INFOGRAPHIC ADDED HERE */}
  <Image
    src={"/images/blog/infographics/blog-32-infographic.png"}
    alt="The Advantages of Training with Us Infographic"
    width={1200}
    height={800}
    className="w-full object-cover rounded-xl my-4 border border-border-color"
  />

  <h3 className="mt-2 text-lg font-bold text-secondary">
    The Advantages of Training With Us
  </h3>
  <ul className="mt-3 list-disc pl-6 text-sm md:text-base">
    <li>Dual-Control Security: We use modern vehicles with an extra brake on our side to keep you safe while you find your feet.</li>
    <li>Flexible Learning: We offer both automatic driving lessons for easy city commuting and manual driving lessons for those who want total control.</li>
    <li>Triple Credit Hours: Every hour you spend with us counts as three hours in your NSW logbook for the first ten hours.</li>
    <li>Customized Pace: Whether you are a fast learner or need extra time, we adapt our tone and teaching style to suit you perfectly.</li>
  </ul>
</section>

                  {/* PROGRESS */}
                  <section id="progress">
                    <h2 className="text-2xl font-bold text-secondary">
                      Progressing Your Skills: From L-Plates to Total Independence
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Once you master the quiet backstreets, we move into more challenging environments. Your <Link href="/services/automatic-driving-lessons" className="location-link" >learner driver lessons,</Link> Dolls Point sessions,s will gradually include roundabouts, intersections, and higher-speed zones. We focus heavily on hazard perception, teaching you to "scan" the road like a pro. This level of L-plate driving lessons ensures you aren't just reacting to traffic but actively predicting it. We want you to feel in command of the machine, not just a passenger in the driver's seat.
                      <br /><br />
                      If you have a busy schedule, our <Link href="/packages" className="location-link" >driving lesson packages</Link> provide a convenient way to stay consistent. Consistency is the fastest way to build muscle memory. We offer competitive rates because we believe that top-tier road safety for beginners should be accessible to every family in the St George region. Our goal is to see you transition from a nervous beginner to a decisive, licensed driver who feels at home on any Sydney road.
                    </p>
                  </section>

                  {/* FRAMEWORK */}
                  <section id="framework">
                    <h2 className="text-2xl font-bold text-secondary">
                      A Structured Path to Driving Excellence
                    </h2>
                    <table className="mt-4 w-full text-sm border rounded-lg overflow-hidden">
                      <thead className="bg-base-200">
                        <tr>
                          <th className="p-3 border-b">Training Phase</th>
                          <th className="p-3 border-b">Core Skill Focus</th>
                          <th className="p-3 border-b">Expert Instructor Support</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Foundation","Car Setup & Pedals","Ensuring you are comfortable and can stop/start smoothly."],
                          ["Control","Steering & Accuracy","Mastering turns and lane positioning in quiet zones."],
                          ["Maneuvers","Parking & Turning","Breaking down reverse parallel parking into easy visual cues."],
                          ["Navigation","Intersections","Coaching you on gap selection and correct signaling."],
                          ["Ready for Test","Mock Exam","Simulating the actual test to remove those 'exam jitters.'"],
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
                      Expert Secrets for Your First Few Lessons
                    </h2>
                    <ul className="mt-3 list-disc pl-6 text-sm md:text-base">
                      <li>Focus on Your Breathing: If you feel tense, take a deep breath.</li>
                      <li>Look Far Ahead: Look 200 meters down the road to spot hazards early.</li>
                      <li>Master the Mirrors: Use mirrors every 8–10 seconds.</li>
                      <li>Ask Every Question: We explain everything until you feel 100% clear.</li>
                    </ul>
                  </section>

                  {/* FAQ */}
                  <section id="faqs">
                    <FaqSection className={`bg-white!`} title="Frequently Asked Questions" faqs={faqs} />
                  </section>

                </div>
              </div>
            </article>

            <aside className="lg:col-span-4">
                         <div className="lg:sticky lg:top-24 space-y-6">
                           <BlogToc items={toc} offset={88} />
           
                           <div className="rounded-2xl border border-border-color bg-white shadow-sm p-5">
                             <h3 className="text-lg font-bold text-secondary">
                               Start Your Journey With Test Route Driving School
                             </h3>
                             <p className="mt-2 text-sm leading-7 text-neutral">
                               Ready to get behind the wheel? Let our expert instructors
                               show you how{" "}
                               <strong>driving lessons help beginners learn faster</strong>{" "}
                               and safer. We serve Kogarah and the Greater Sydney region
                               with professional, test-focused training.
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