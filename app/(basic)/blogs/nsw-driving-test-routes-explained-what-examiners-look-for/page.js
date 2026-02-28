import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import {FaEnvelope, FaHandPointer} from "react-icons/fa";
import {IoCallSharp} from "react-icons/io5";
import {FaCheckCircle} from "react-icons/fa";
import blog6Img from "@/app/assets/blog/blog6.png";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "NSW Driving Test Routes for Learners - Master Technical Road Skills",
  description:
    "Master every NSW driving test route by knowing exactly what examiners check for in 2026. Learn the top fail items, lane positioning, and get your P’s on the first try.",
  keywords: [
    "NSW Driving Test Routes",
    "NSW test routes list",
    "driving test routes Sydney",
    "Kogarah driving test route",
    "Common driving test routes in NSW",
    "practical driving test route map",
    "test centre locations in NSW",
    "school zones NSW",
    "roundabout assessment",
    "lane changes test",
    "merging safely",
    "Kogarah test route guide",
  ],
};

const toc = [
  {
    id: "understanding-routes",
    label: "Understanding Common NSW Driving Test Routes",
  },
  {id: "examiners-watch", label: "What Examiners Secretly Watch For"},
  {id: "kogarah-route", label: "Mastering the Kogarah Driving Test Route"},
  {id: "local-hazards", label: "Navigating Local Hazards"},
  {
    id: "critical-skills",
    label: "Critical Skills for Every Practical Driving Test Route Map",
  },
  {id: "roundabouts-lane", label: "Roundabout Assessment and Lane Changes"},
  {id: "school-zones", label: "School Zones and Speed Management"},
  {id: "common-problems", label: "Common Problems and How to Fix Them"},
  {id: "expert-tips", label: "Expert Tips to Outperform the Top 10 Results"},
  {id: "use-guide", label: "Use a Professional Guide"},
  {
    id: "faqs",
    label: "Frequently Asked Questions About NSW Driving Test Routes",
  },
];

const faqs = [
  {
    question: "Can I see the official NSW test routes list?",
    answer:
      "Service NSW does not publish an official NSW test routes list. This prevents people from only memorising one path. However, local instructors know the common zones used around each test centre.",
  },
  {
    question: "What is the most common reason for failing the NSW test?",
    answer:
      "Poor observation. Missing blind spots during lane changes or failing to look left and right at intersections is a top fail reason. Make your head checks obvious so the examiner can see them.",
  },
  {
    question: "How do I handle merging safely in heavy Sydney traffic?",
    answer:
      "Wait for a safe gap. If you are unsure, do not go. Hesitation may be a minor fault, but forcing another driver to brake is an instant fail. Practice merging with an instructor to nail timing.",
  },
  {
    question: "Are school zones in NSW active on pupil-free days?",
    answer:
      "Yes. School zones are active on all notified school days, including teacher development days. If it’s a school day, stay at 40km/h during active times.",
  },
  {
    question: "Do I need to signal when exiting a roundabout?",
    answer:
      "Yes. You must signal left just before exiting (unless it’s impractical due to the size/spacing of exits). Examiners watch this closely during roundabout assessments.",
  },
];

export default function Blog6() {
  return (
    <section>
      <PageHeroSection
        title={"NSW Driving Test Routes Explained – What Examiners Look For"}
        subtitle={
          <>
            Navigating NSW driving test routes requires more than basic steering
            skills. Examiners assess your hazard perception and decision-making
            under real traffic pressure. This guide breaks down common routes,
            assessment criteria, and critical safety zones to help you pass on
            the first go. <br />
            At{" "}
            <Link href="/" className="location-link">
              Test Route Driving School,
            </Link>{" "}
            we prepare learners daily—especially around Kogarah and Greater
            Sydney test areas.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={blog6Img}
              alt="NSW Driving Test Routes Explained Test Route Driving School"
              className="w-full object-cover"
              width={1200}
              height={800}
              priority
            />
          </figure>
        </section>

        {/* ARTICLE + SIDEBAR */}
        <section className="mt-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ARTICLE */}
            <article className="lg:col-span-8">
              <div className="rounded-2xl bg-white shadow-lg border border-border-color px-4 md:px-6 py-6 md:py-8">
                <div className="space-y-10 text-neutral leading-8">
                  {/* Understanding routes */}
                  <section id="understanding-routes" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Understanding Common NSW Driving Test Routes
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      As an instructor with over 10 years of experience, I have
                      seen thousands of students tackle NSW driving test routes.
                      Many learners think the route is a secret. In reality,
                      examiners follow set zones near your local test centre.
                      Whether you are at Kogarah, Botany, or Silverwater, the
                      goal is the same: they want to see if you can share the
                      road safely.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Understanding common test route patterns helps you
                      visualise the drive before you even turn the key. Most
                      routes include a mix of quiet suburban streets and busy
                      main roads, with varying speed limits and complex
                      intersections.
                    </p>
                  </section>

                  {/* Examiners watch */}
                  <section id="examiners-watch" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      What Examiners Secretly Watch For
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The testing officer tracks five key areas: speed
                      management, road positioning, decision-making, hazard
                      response, and vehicle control. The examiner isn&apos;t
                      your enemy—they are checking if you are a low-risk driver.
                      If you make them feel safe, you are halfway to your P1.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        [
                          "Speed Management",
                          "Stay within limits and adjust for conditions. Smooth braking matters.",
                        ],
                        [
                          "Road Positioning",
                          "Keep centred, leave space from parked cars, and set up turns early.",
                        ],
                        [
                          "Decision-Making",
                          "Choose safe gaps and act decisively—no risky moves under pressure.",
                        ],
                        [
                          "Hazard Response",
                          "Scan, anticipate, and react early. Show you ‘see’ problems coming.",
                        ],
                      ].map(([title, text]) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-border-color bg-base-300 p-5"
                        >
                          <h3 className="text-lg font-bold text-secondary">
                            {title}
                          </h3>
                          <p className="mt-2 text-sm md:text-base leading-7">
                            {text}
                          </p>
                        </div>
                      ))}
                      <div className="rounded-2xl border border-border-color bg-base-300 p-5 md:col-span-2">
                        <h3 className="text-lg font-bold text-secondary">
                          Vehicle Control
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Steer smoothly, accelerate gently, and keep control
                          during manoeuvres. No jerky inputs.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Kogarah route */}
                  <section id="kogarah-route" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Mastering the Kogarah Driving Test Route
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      If you are testing at the Kogarah centre, you must know
                      the local layout. The Kogarah route often weaves through
                      residential streets near Warialda Street. Expect tight
                      turns, parked cars, and quick decision points.
                    </p>
                  </section>

                  {/* Local hazards */}
                  <section id="local-hazards" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Navigating Local Hazards
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Kogarah has many one-way streets and narrow lanes. Small
                      signs like “No Entry” can appear when you are under
                      pressure. Practice around the test centre during peak and
                      off-peak times to build road memory.
                    </p>

                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7">
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Observation is king:</strong> check mirrors
                            every 5–8 seconds.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Blind spots:</strong> physically turn your
                            head for every lane change test.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Kerb-side parking:</strong> drill reverse
                            parallel park until it’s automatic.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Critical skills */}
                  <section id="critical-skills" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Critical Skills for Every Practical Driving Test Route Map
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Every practical driving test route map is designed to test
                      judgment under real conditions. You will be assessed on
                      manoeuvres that often trip up nervous learners.
                    </p>
                  </section>

                  {/* Roundabouts & lane changes */}
                  <section id="roundabouts-lane" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Roundabout Assessment and Lane Changes
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Roundabouts are a major fail point. Signal correctly when
                      entering and exiting. Many learners forget the left exit
                      signal. For lane changes and merges, never force another
                      driver to brake. If you disrupt traffic flow, it’s often
                      an instant fail.
                    </p>
                  </section>

                  {/* School zones */}
                  <section id="school-zones" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      School Zones and Speed Management
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Speeding is the fastest way to end your test. NSW school
                      zones are strict: stay at or below 40km/h during active
                      hours. Look for school zone signs early and slow
                      smoothly—no harsh braking.
                    </p>
                  </section>

                  {/* Table */}
                  <section id="common-problems" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Common Problems and How to Fix Them
                    </h2>

                    <div className="mt-6 overflow-x-auto rounded-2xl border border-border-color">
                      <table className="w-full text-left text-sm md:text-base">
                        <thead className="bg-base-300">
                          <tr>
                            <th className="p-4 font-semibold text-secondary">
                              Problem Type
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              Detection Method
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              Danger Level
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              Typical Solution
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {[
                            [
                              "Speeding",
                              "Watching the speedometer",
                              "Fatal / Instant Fail",
                              "Stay 2–3km under the limit",
                            ],
                            [
                              "Rolling Stop",
                              "Feeling the car move",
                              "High Risk",
                              "Count to 3 at every Stop sign",
                            ],
                            [
                              "Poor Observation",
                              "Examiner sees your head",
                              "Medium–High",
                              "Exaggerate head checks",
                            ],
                            [
                              "Indicator Error",
                              "Dash lights / ticking",
                              "Medium",
                              "Signal for at least 5 seconds",
                            ],
                            [
                              "Gap Selection",
                              "Traffic flow disrupted",
                              "Very High",
                              "Only move when 100% safe",
                            ],
                          ].map((row, idx) => (
                            <tr
                              key={idx}
                              className="border-t border-border-color"
                            >
                              {row.map((cell, i) => (
                                <td key={i} className="p-4 align-top">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Expert tips */}
                  <section id="expert-tips" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Expert Tips to Outperform the Top 10 Results
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Most blogs say “stay calm.” The real advantage is
                      preparation. Route familiarity reduces anxiety. When you
                      know the tricky zones near test centres, your confidence
                      goes up immediately.
                    </p>
                  </section>

                  {/* Use professional guide */}
                  <section id="use-guide" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Use a Professional Guide
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Don’t rely only on a route map found online—routes can
                      change. Professional instructors notice patterns from
                      recent tests. Around Kogarah, we know which roundabouts
                      and lane-change zones examiners often use.
                    </p>
                  </section>

                  {/* FAQs */}
                  <section id="faqs" className="scroll-mt-24">
                    <FaqSection
                      title={
                        "Frequently Asked Questions About NSW Driving Test Routes"
                      }
                      faqs={faqs}
                      className={"bg-white! py-0!"}
                    />
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
                    Don’t Leave Your License to Chance
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Passing your test requires more than knowing how to drive.
                    It requires knowing how examiners assess you on real NSW
                    driving test routes. We specialise in Kogarah and
                    surrounding Sydney areas with patient, test-focused
                    training.
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
                      href="mailto:testroutedrivingschool@gmail.com"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color"
                    >
                      <FaEnvelope />
                      Sent Email
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
