/* eslint-disable react/no-unescaped-entities */
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import {  FaEnvelope, FaHandPointer } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import blog10Img from "@/app/assets/blog/blog10.png";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "NSW Driving Test Instant Fail Errors - Secure Your Licence First Try",
  description:
    "Don't let NSW driving test instant fail errors ruin your results. Discover the technical marking criteria for lane changes and roundabouts to ensure a 90% score.",
  keywords: [
    "Driving Test Instant Fail Errors",
"instant fail errors",
"instant fail driving test NSW",
"Major faults NSW driving test",
"NSW driving test fail points",
"How many mistakes are allowed in the NSW driving test",
"what is an instant fail in the NSW driving test?",
"fail to give way NSW test",
"fail parallel parking NSW",
"speeding during a driving test",
"not checking the blind spot",
"Transport for NSW",
"Practical Driving Assessment (PDA)",
"P1 provisional licence",
"Testing officer / driving examiner",
  ],
};

const toc = [
  {
    id: "what-are-instant-fail-errors",
    label: "What Are Driving Test Instant Fail Errors?",
  },
  {
    id: "common-fatal-flaws",
    label: "Common Fatal Flaws in the NSW Test",
  },
  {
    id: "how-many-mistakes-allowed",
    label: "How Many Mistakes Are Allowed in the NSW Driving Test?",
  },
  {
    id: "expert-tips",
    label: "Expert Tips to Avoid Major Faults",
  },
  { id: "faqs", label: "Frequently Asked Questions" },
];

const faqs = [
  {
    question: "What is an instant fail in the NSW driving test?",
    answer:
      "An instant fail is any action that is illegal, dangerous, or requires the examiner to intervene. This includes speeding, running red lights, or mounting a kerb.",
  },
  {
    question: "Does stalling the car mean I fail instantly?",
    answer:
      "Usually, no. If you stall in a safe place and restart quickly, it is a minor error. However, if you stall in the middle of a busy intersection and cause a hazard, it can become an instant fail.",
  },
  {
    question: "Can I fail for driving too slowly?",
    answer:
      "Yes. If you drive more than 10km/h below the limit without a good reason, you may be marked for obstructing traffic. This can lead to NSW driving test fail points.",
  },
  {
    question: "What happens if I fail parallel parking?",
    answer:
      "If you hit the kerb hard or mount it, you fail. If you take too many movements or finish too far from the kerb, it is a minor error, not an instant fail.",
  },
  {
    question: "Can I use my phone for GPS?",
    answer:
      "No. As per P1 provisional licence rules, any phone use is a 2026 instant fail. Use a dedicated GPS or follow the examiner’s directions.",
  },
];

export default function Blog10() {
  return (
    <section>
      <PageHeroSection
        title={"NSW Driving Test Instant Fail Errors – Complete 2026 Guide"}
        subtitle={
          <>
            <Link href="/services/driving-test-assessment" className="location-link">Driving Test Instant Fail Errors
            </Link> are the most common reason learners walk away without their P1 license. In NSW, a single major mistake ends your assessment immediately, even if your overall score is high. Common errors include speeding, failing to stop at signs, and poor observation during lane changes. Understanding these fatal flaws allows you to prepare better and stay calm under pressure. This guide breaks down the critical mistakes to avoid so you can pass your test on the first try.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={blog10Img}
              alt="NSW Driving Test Instant Fail Errors – Test Route Driving School"
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
                  {/* What Are Driving Test Instant Fail Errors? */}
                  <section id="what-are-instant-fail-errors" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      What Are Driving Test Instant Fail Errors?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      I have spent 10 years watching students prepare for their big day. Most focus on perfect parking. However, Driving Test Instant Fail Errors often have nothing to do with how straight you park. These errors involve dangerous actions or breaking critical road rules. A Testing officer must terminate the test if you create a risk to other road users.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      In my experience, the <Link href="/services/driving-test-assessment" className="location-link">Practical Driving Assessment
            </Link>  (PDA) is as much about safety as it is about skill. You need to show the driving examiner that you are a low-risk driver. One illegal move, like a failure to give way, NSW test error, is enough to stop the car. You will be directed back to the service centre immediately.
                    </p>
                  </section>

                  {/* Common Fatal Flaws in the NSW Test */}
                  <section id="common-fatal-flaws" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Common Fatal Flaws in the NSW Test
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Knowing the <strong>NSW driving test fail points</strong> is your best defense. Many students make these mistakes because of nerves, not a lack of knowledge.
                    </p>

                    <h3 className="mt-3 text-xl md:text-2xl font-semibold text-secondary">
                      Speeding and Road Signs
                    </h3>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Speeding during a driving test is the fastest way to fail. In 2026, Transport for NSW will remain very strict on this. If you go 5km/h over the limit for more than 5 seconds, it is over. I always tell my students to stay 2-3km/h below the limit to be safe.
                    </p>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Disobeying signs is another major issue. Failing to stop at a stop sign is an instant fail. You must come to a complete halt. If your wheels are still rolling, you have failed.
                    </p>

                    <h3 className="mt-3 text-xl md:text-2xl font-semibold text-secondary">
                      Observation and Blind Spots
                    </h3>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      Not checking the blind spot is a classic mistake. You must do a physical shoulder check before every lane change or merge. If the examiner doesn't see your head turn, they mark it as a major fault.
                    </p>
                    <ul className="mt-6 text-sm md:text-base leading-7 list-disc pl-6">
                      <li>
                        <strong>Fail to give way:</strong> Forcing another driver to brake or swerve.
                      </li>
                      <li>
                        <strong>Mounting the kerb:</strong> Hitting the kerb hard during a failed parallel parking attempt in NSW.
                      </li>
                      <li>
                        <strong>Stop signs:</strong> Moving through without a full, 3-second pause.
                      </li>
                      <li>
                        <strong>Red lights:</strong> Entering an intersection after the light turns red.
                      </li>
                    </ul>
                  </section>

                  {/* How Many Mistakes Are Allowed in the NSW Driving Test? */}
                  <section id="how-many-mistakes-allowed" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      How Many Mistakes Are Allowed in the NSW Driving Test?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Students always ask: How many mistakes are allowed in the NSW driving test? You need a score of at least 90% to pass. This means you can make a few minor "driving errors." For example, a slightly wide turn might cost you a point.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      However, you are allowed zero instant fail items. You can score 99% on your technical skills, but one instant fail on the driving test NSW error will result in a fail. This is why hazard perception is so important for your P1 provisional licence.
                    </p>
                  </section>

                  {/* Expert Tips to Avoid Major Faults */}
                  <section id="expert-tips" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Expert Tips to Avoid Major Faults
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      In my decade of coaching at Test Route Driving School, I have seen every possible fail. Here is my expert advice on avoiding Driving Test Instant Fail Errors.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        [
                          "Speeding",
                          "Watch for school zone signs. Aim for 38km/h in a 40 zone.",
                        ],
                        [
                          "Giving Way",
                          "If in doubt, wait. Better to be slow than dangerous.",
                        ],
                        [
                          "Blind Spots",
                          "Exaggerate your head checks. Wear a hat so the examiner sees the brim move.",
                        ],
                        [
                          "Stop Signs",
                          "Feel the car 'jolt' to a full stop. Count 'one-one-thousand' clearly.",
                        ],
                        [
                          "Control",
                          "Practice hill starts in a manual car. Keep both hands on the wheel at all times.",
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
                    </div>
                  </section>

                  {/* Frequently Asked Questions */}
                  <section id="faqs" className="scroll-mt-24">
                    <FaqSection
                      title={"Frequently Asked Questions"}
                      faqs={faqs}
                      className={"bg-white py-0"}
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
                    Pass Your Test with Test Route Driving School
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Avoiding <Link href="https://drive.govt.nz/restricted-licence/doing-the-restricted-licence-test/immediate-failure-errors" className="location-link" target="_blank"> Driving Test Instant Fail Errors
            </Link> Driving Test Instant Fail Errors is easier with
                    professional guidance. At <Link href="/" className="location-link"> Test Route Driving School,
            </Link> we
                    specialize in test-ready training. We know the Kogarah routes
                    and the common traps examiners set. We don't just teach you
                    to drive; we teach you how to pass the Practical Driving
                    Assessment (PDA) with confidence.
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