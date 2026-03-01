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
import HomeMap from "@/app/shared/ui/HomeMap";

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
    question: "What is the most effective way to use driving test route maps?",
    answer: <>Use test route maps to identify &quot;high-risk&quot; areas such as complex roundabouts, hidden stop signs, and school zones. Practicing these specific segments helps eliminate the element of surprise during the actual Victorian (VicRoads) or NSW driving assessment.
</>,
  },
  {
    question: "Why should I take a mock driving test before the real one?",
    answer: `A mock test simulates the exact conditions of the official exam, including the examiner's marking criteria. It identifies "Critical Errors" (like failing to check blind spots) and "Immediate Termination Errors" (like mounting a kerb) that you can fix before your test date.`,
  },
  {
    question: "How do I ensure my car is eligible for the driving test?",
    answer: <>Your vehicle must be roadworthy, registered, and clean. Key checks include working indicators/brake lights, tires with at least 1.5mm tread, and a clear windscreen. If using your own car, it must have a functional handbrake accessible to the examiner.</>,
  },
  {
    question: "What are the most common reasons for failing a driving test?",
    answer: ` Most failures occur due to inadequate observation (not doing head checks), speeding (even 1-2 km/h over the speed limit in school zones), and failing to come to a complete stop at "Stop" signs. Resource guides help you master these habits through repetitive practice.`,
  },
  {
    question: "How many driving lessons do I need to pass on the first attempt?",
    answer: ` While the legal requirement varies by state (e.g., 120 hours in NSW), most students find that 5-10 professional lessons focused on "test-specific" techniques significantly increase their first-time pass rate compared to private practice alone.`,
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
            <a href="https://www.transport.nsw.gov.au/" target="_blank">
              <h2 className="text-neutral underline mt-2">
                NSW Department of Transport
              </h2>
            </a>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <a href="https://www.nsw.gov.au/sites/default/files/2022-11/Road-User-Handbook-English.pdf" target="_blank">
              <h2 className="text-neutral underline mt-2">
              NSW Road User Handbook
              </h2>
            </a>
           
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <a href="https://www.service.nsw.gov.au/transaction/book-a-driver-or-rider-licence-test" target="_blank">
              <h2 className="text-neutral underline mt-2">
              Practical Test Booking
              </h2>
            </a>
           
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-primary p-4 rounded-full">
              <IoDocumentText className="text-6xl text-white  " />
            </div>
            <a href="https://www.youtube.com/results?search_query=driving+school" target="_blank">
              <h2 className="text-neutral underline mt-2">
              Tutorial Videos
              </h2>
            </a>
          
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
                  Our learning guides help you master automatic driving step by step, based on actual RMS testing criteria and real-world Sydney traffic patterns. They focus on real roads, real traffic, and real test conditions that our instructors encounter daily.
                </p>
                <h3 className="mt-2 text-lg font-bold">
                  You will learn about:
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Structured lesson frameworks aligned with the graduated licensing system</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Precision parking methods tested in Sydney RTA locations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Advanced traffic handling in complex Sydney intersections</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Strategic test route planning for your local examination centre</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">
                    Safe city and highway driving protocols specific to NSW road rules

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
                     Set weekly learning goals tied to official competency standards
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">
                   Track skill improvement using instructor-validated methods
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Manage test timelines based on real booking windows and preparation needs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500" size={16} />

                    <span className="text-gray-700">Focus on weak areas identified through professional assessment</span>
                  </li>
                </ul>
                <p className="text-neutral  mt-4">
                  Each guide uses clear steps, RMS-curriculum alignment, and instructor insights gained from preparing Sydney learners for test success. This improves awareness, hazard response, and road judgement. These skills matter in tests. They matter even more in daily driving.
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
"Skipping mirror checks before lane changes (a leading fail reason)",
"Driving too fast in school zones (40km/h enforcement areas)",
"Rolling through stop signs (common in Sydney suburban tests)",
"Missing hazards at complex intersections (especially roundabouts)",
"Late or incorrect indicator use (required 3+ seconds before turning)",
"Sudden braking due to nervousness (indicates poor anticipation)",
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
           Fixing these habits early, with professional feedback, significantly increases first-attempt pass rates.

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
        extra="Sleep well. Arrive early with required documents. Trust your training and structured preparation. Strong preparation removes panic and demonstrates the composure examiners expect. Confidence delivers results."
      />
      <Faq
        className={`bg-white`}
        faqs={faqs}
        subtitle="Find quick answers about lessons, bookings, and learning support.
"
      />
          <HomeMap/>
    </div>
  );
}
