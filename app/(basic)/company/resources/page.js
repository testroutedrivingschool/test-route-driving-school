import Faq from "@/app/shared/FaqSection";
import MovingCar from "@/app/shared/MovingCar";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import React from "react";

import {IoDocumentText} from "react-icons/io5";
import DrivingTipsSection from "../../components/Home/DrivingTipsSection";
import {
  FaAward,
  FaBrain,
  FaCalendarAlt,
  FaCar,
  FaChartLine,
  FaCheck,
  FaShieldAlt,
} from "react-icons/fa";
import Link from "next/link";

export const metadata = {
  title: "Driving Lesson Resources – Learn Faster with Experts	",
  description:
    "Access expert driving guides, test preparation tips, and structured learning tools. Improve confidence, master skills, and book lessons today with Test Route Driving School.",
  keywords: [
    "Driving School in Sydney suburbs",
    "driving school near me",
    "driving lessons schools",
    "driving schools in Sydney suburbs",
    "driving schools for manual transmission",
    "driving training school near me",
    "affordable driving school in Sydney suburbs",
    "driving schools near by me",
    "driving instructor schools in Sydney suburbs",
    "driving class Sydney suburbs",
    "driving lessons Sydney suburbs",
    "driving instructor in Sydney suburbs",
  ],
};
const drivingLessonTips = [
  {
    title: "Practice Regularly",
    description:
      "Drive often on different roads. Try peak traffic, quiet streets, and parking areas. Regular practice builds muscle memory. It improves control. It strengthens confidence.",
    icon: <FaCalendarAlt className="h-6 w-6" />,
    color: "text-blue-600 bg-blue-50",
    duration: "Ongoing",
  },
  {
    title: "Prioritize Road Safety",
    description: (
      <>
        Follow speed limits. Keep safe distances. Scan for hidden hazards.
        Strong{" "}
        <a
          className="location-link"
          href={"https://www.nhtsa.gov/ten-tips-for-safe-driving"}
          target="_blank"
        >
          safety
        </a>{" "}
        habits reduce risks. They also impress examiners.
      </>
    ),
    icon: <FaShieldAlt className="h-6 w-6" />,
    color: "text-green-600 bg-green-50",
    priority: "High",
  },
  {
    title: "Build Confidence Gradually",
    description:
      "Start with simple routes. Move to busy roads later. Step-by-step learning prevents overload. It helps skills grow naturally.",
    icon: <FaChartLine className="h-6 w-6" />,
    color: "text-purple-600 bg-purple-50",
    level: "Beginner to Advanced",
  },
  {
    title: "Understand Both Manual & Automatic Cars",
    description:
      "Knowing manual basics improves overall awareness. It sharpens clutch-free control. This makes you adaptable in any situation. ",
    icon: <FaCar className="h-6 w-6" />,
    color: "text-amber-600 bg-amber-50",
    level: "Skill Development",
  },
  {
    title: "Stay Calm and Focused",
    description:
      "Ignore outside pressure. Follow instructions carefully. Calm driving leads to smoother control. Focused learners make fewer errors.",
    icon: <FaBrain className="h-6 w-6" />,
    color: "text-teal-600 bg-teal-50",
    focus: "Mental",
    level: "Technical & Mental",
  },
  {
    title: "Prepare for Driving Tests",
    description: (
      <>
        Practise parking. Review common routes. Learn examiner expectations.{" "}
        <Link href="/instructors" className="location-link">
          Our instructors
        </Link>{" "}
        guide you through every stage. This boosts first-attempt success.
      </>
    ),
    icon: <FaAward className="h-6 w-6" />,
    color: "text-red-600 bg-red-50",
    goal: "Test Success",
    level: "Test Readiness",
  },
];
const faqs = [
  {
    question: "How many lessons do I need to pass?",
    answer: (
      <>
        Most learners succeed within 15–30 professional sessions.

      </>
    ),
  },
  {
    question: "Do you provide pickup and drop-off?",
    answer: (
      <>
        Yes. We provide door-to-door service in most suburbs.

      </>
    ),
  },
  {
    question: "Which areas do you cover?",
    answer: (
      <>
        We serve Kogarah and the surrounding Sydney suburbs.
      </>
    ),
  },
  {
    question: "Can I book lessons online?",
    answer: (
      <>
      Yes. Online booking is fast and secure.


      </>
    ),
  },
  {
    question: "What vehicle will I learn in?",
    answer: (
      <>
        You will train in a modern automatic car.

      </>
    ),
  },
];
export default function Resources() {
  return (
    <div className="">
      <PageHeroSection
        title="Learning Resources for Automatic Driving in Sydney"
        subtitle={`Build strong driving skills with trusted learning tools. Our resource hub gives you clear guides, practical tips, and real test insights. You can study anytime. You can practise with purpose. You can progress with confidence. Each resource supports safer driving, smarter decisions, and faster improvement across Sydney suburbs.`}
      />
      <Container className={`pb-17`}>
        <SectionHeader
          title="Essential Resources for Learner  Drivers"
          subtitle="Trusted guides and official links to help you prepare for safe driving in NSW"
        />
        {/* Resources */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">
              NSW Department of Transport
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">
              NSW Road User Handbook
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">
              Practical Test Booking
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <h2 className="text-neutral underline mt-2">Tutorial Videos</h2>
          </div>
        </section>
      </Container>
      <section className="py-12 bg-primary/10">
        <Container>
          <div className="space-y-4">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold  mb-4">
                  Automatic Driving Lesson Guides & Learning Materials
                </h3>
                <p className="text-neutral text-lg mb-3">
                  Our learning guides help you master automatic driving step by
                  step. They focus on real roads, real traffic, and real test
                  conditions.
                </p>
                <h3 className="mt-2 text-lg font-bold">
                  You will learn about:
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Lesson structures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Parking methods</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Traffic handling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Test route planning</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">
                      City and highway driving
                    </span>
                  </li>
                </ul>
              </div>

              <div className="">
                <h3 className="text-2xl font-bold  mb-2">
                  Learn at Your Own Speed with Structured Practice
                </h3>
                <p className="text-neutral text-lg mb-3">
                  Every learner grows at a different pace. Our resources help
                  you plan smarter practice sessions.
                </p>
                <h3 className="mt-2 text-lg font-bold">
                  You will understand how to:
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">
                      Set weekly learning goals
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">
                      Track skill improvement
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Manage test timelines</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Focus on weak areas</span>
                  </li>
                </ul>
                <p className="text-neutral  mt-4">
                  Each guide uses clear steps and instructor insights. This
                  improves awareness, hazard response, and road judgement. These
                  skills matter in tests. They matter even more in daily
                  driving.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 ">
        <Container>
          <SectionHeader
            className="mt-0!"
            title="Common Driving Mistakes to Avoid"
            subtitle="Avoid these mistakes to improve test performance and road safety."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ">
            {[
              "Skipping mirror checks before lane changes",
              "Driving too fast in school zones",
              "Rolling through stop signs",
              "Missing hazards at intersections",
              "Late or incorrect indicator use",
              "Sudden braking due to nervousness",
            ].map((mistake, index) => (
              <div
                key={index}
                className="group bg-base-300 p-5 rounded-xl border border-border-color shadow transition"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-900 transition">{mistake}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-neutral  mt-4">
            Fixing these habits early increases your pass rate.
          </p>
        </Container>
      </section>

      <MovingCar />
      <DrivingTipsSection
        title={`Expert Driving Tips & Professional Advice`}
        subtitle={
          <>
            Learning to drive becomes easier with the right guidance. Our
            instructors share proven techniques from real test experience. These
            tips help beginners and advanced learners succeed.
          </>
        }
        tips={drivingLessonTips}
      />
      <Faq
        className={`bg-white`}
        faqs={faqs}
        subtitle="Find quick answers about lessons, bookings, and learning support.
"
      />
    </div>
  );
}
