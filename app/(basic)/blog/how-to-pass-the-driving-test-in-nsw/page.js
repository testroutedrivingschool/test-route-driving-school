import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import {FaEnvelope, FaHandPointer} from "react-icons/fa";
import {IoCallSharp} from "react-icons/io5";
import blog1Img from "@/app/assets/blog/blog1.png";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "How to Pass the Driving Test in NSW – First Attempt Success Guide",
  description:
    "Learn how to pass the driving test in NSW on your first try with expert tips from certified instructors. Avoid common failures and book your lesson today for guaranteed confidence.",
  keywords: [
    "Pass the Driving Test in NSW",
    "pass driving test first attempt",
    "NSW driving test tips",
    "driving test NSW requirements",
    "what examiners look for driving test",
    "NSW practical driving test",
    "NSW driving test",
    "How to pass driving test",
    "driving test in NSW",
  ],
};

const toc = [
  {
    id: "practical-test",
    label: "What You Must Know About the NSW Practical Driving Test",
  },
  {
    id: "examiners-look-for",
    label: "The Real Requirements: What Examiners Actually Look For",
  },
  {
    id: "proven-tips",
    label: "Proven NSW Driving Test Tips From Certified Instructors",
  },
  {
    id: "week-before",
    label: "How to Pass Driving Test: The Week-Before Strategy",
  },
  {id: "instant-fails", label: "Common Mistakes That Cause Instant Fails"},
  {
    id: "first-attempt",
    label: "Pass Driving Test First Attempt: Is It Possible?",
  },
  {id: "test-day", label: "The Test Day Experience: What Actually Happens"},
  {
    id: "real-confidence",
    label: "Building Real Confidence, Not Just Test Tricks",
  },
  {
    id: "next-step",
    label: "Your Next Step: Professional Support Makes the Difference",
  },
  {id: "faqs", label: "FAQS About Passing the Driving Test in NSW"},
];

const faqs = [
  {
    question: "Where is the best place to park for my test?",
    answer:
      'Park in the official "Driving Test" bays at 67 Warialda Street. Reverse-park into the spot for an easy exit. This keeps you in the correct zone and lowers pre-test stress.',
  },
  {
    question: 'What are the common "fail" zones in Kogarah?',
    answer:
      'Watch for 40km/h school zones near Kogarah High to avoid speeding. Always make a complete, motionless stop at every "Stop" sign. Yield strictly to pedestrians at crossings near the train station.',
  },
  {
    question: "How do I handle traffic on President Avenue?",
    answer:
      "Maintain a three-second gap and wait for a safe, clear opening. Signal for five seconds and perform a head-check before changing lanes. Stay calm and scan for hazards to show low-risk driving.",
  },
  {
    question: "Which maneuvers are tested on the Kogarah route?",
    answer:
      "Expect a reverse parallel park or three-point turn in Carlton’s side streets. Keep the vehicle under control while scanning 360 degrees for hazards. Always do a final blind-spot check before moving the car's front.",
  },
  {
    question: "Can I use my own car for the test?",
    answer:
      'Yes, but it must be roadworthy, registered, and have "L" plates. The examiner will cancel the test if any lights or tires are faulty. Many use instructor cars to guarantee they pass the safety check.',
  },
];

export default function Blog1() {
  return (
    <section>
      <PageHeroSection
        title={
          "How to Pass the Driving Test in NSW: Your Complete Guide to First-Time Success"
        }
        subtitle={
          <>
            You have practiced for months. Your hands grip the wheel. Your heart
            races. You want to pass the{" "}
            <Link
              href="/services/driving-test-package"
              className="location-link"
            >
              driving test in NSW
            </Link>{" "}
            on your first try. This guide shows you exactly how. At{" "}
            <Link href="/" className="location-link">
              Test Route Driving School,
            </Link>{" "}
            we help nervous learners become confident drivers every day. We know
            what works. We know what examiners want. Let us share that knowledge
            with you.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={blog1Img}
              alt="How to Pass the Driving Test in NSW Test Route Driving School"
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
                  {/* Practical test */}
                  <section id="practical-test" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      What You Must Know About the NSW Practical Driving Test
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The NSW{" "}
                      <Link
                        href="/services/driving-test-package"
                        className="location-link"
                      >
                        driving test
                      </Link>{" "}
                      checks your ability to drive safely. It checks your
                      awareness. It checks your control. You need to show you
                      can handle real traffic. You need to prove you understand
                      road rules.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Many learners fail because they misunderstand the test.
                      They think it is about perfect parking. It is not.
                      Examiners watch how you think. They watch how you react.
                      They want safe drivers, not just skilled ones.
                    </p>
                  </section>

                  {/* Examiners look for */}
                  <section id="examiners-look-for" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      The Real Requirements: What Examiners Actually Look For
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      <Link
                        href="/services/driving-test-assessment"
                        className="location-link"
                      >
                        Driving test NSW requirements
                      </Link>{" "}
                      go beyond basic maneuvers. Examiners assess five key
                      areas:
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          1. Speed Management
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          You must match your speed to conditions. You must slow
                          down near schools. You must adjust for rain. You must
                          never rush.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          2. Road Positioning
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Stay centered in your lane. Keep a safe distance from
                          parked cars. Position correctly for turns.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          3. Decision Making
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Choose safe gaps in traffic. Plan your moves early.
                          Never hesitate dangerously. Never act recklessly.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          4. Responding to Hazards
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Scan constantly. Check mirrors every 5-8 seconds.
                          Identify risks before they become problems.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5 md:col-span-2">
                        <h3 className="text-lg font-bold text-secondary">
                          5. Vehicle Control
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Steer smoothly. Brake gently. Accelerate steadily.
                          Show you own the car, not the other way around.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Tips */}
                  <section id="proven-tips" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Proven NSW Driving Test Tips From Certified Instructors
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We have guided hundreds through their{" "}
                      <Link
                        href="/services/driving-test-package"
                        className="location-link"
                      >
                        driving test in NSW.
                      </Link>
                      Here is what separates passers from failers:
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-secondary">
                          Tip 1: Master the Test Route Areas
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Examiners use specific zones near testing centers. You
                          must know these roads. You must know the tricky
                          intersections. You must know where lanes change
                          suddenly.
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          At our school, we specialize in test route
                          familiarity. We drive these streets daily. We know the
                          hidden challenges. We prepare you for exactly what you
                          will face.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-secondary">
                          Tip 2: Kill the Nerves With Preparation
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Fear comes from uncertainty. You can beat it. Practice
                          your weak spots until they feel easy. Simulate test
                          conditions. Drive with someone new, watching you.
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          One student, Sarah from Kogarah, failed twice before
                          finding us. She shook behind the wheel. We built her
                          confidence slowly. She passed on her third attempt.
                          She now drives to work every day.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-secondary">
                          Tip 3: Perfect Your Observation Technique
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Head checks save lives. They also save tests. Check
                          blind spots before every lane change. Check before
                          merging. Check before opening doors.
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Examiners penalize poor observation heavily. They
                          cannot see your eyes moving. They watch your head.
                          Make your checks obvious. Make them deliberate.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-secondary">
                          Tip 4: Practice Defensive Driving
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Anticipate mistakes from others. Expect the
                          unexpected. Keep escape routes open. This mindset
                          impresses examiners. It also keeps you safe after
                          licensing.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Week before */}
                  <section id="week-before" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      How to Pass Driving Test: The Week-Before Strategy
                    </h2>

                    <div className="mt-6 rounded-2xl border border-border-color bg-base-300 p-6">
                      <div className="space-y-3 text-sm md:text-base leading-7">
                        <p>
                          Seven days out: Review all maneuvers. Practice reverse
                          parking. Practice three-point turns. Practice hill
                          starts.
                        </p>
                        <p>
                          Three days out: Drive your test route. Note the speed
                          limit changes. Note the school zones. Note the busy
                          intersections.
                        </p>
                        <p>
                          The day before: Rest your mind. Review road rules
                          lightly. Prepare your documents. Sleep early.
                        </p>
                        <p>
                          Test morning: Eat breakfast. Arrive early. Breathe
                          deeply. Trust your training.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Instant fails */}
                  <section id="instant-fails" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Common Mistakes That Cause Instant Fails
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Even good drivers fail. They make critical errors. Avoid
                      these:
                    </p>

                    <ul className="mt-4 space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                      <li>Speeding: Even 5 km/h over limits fails you</li>
                      <li>
                        Disobeying signs: Running stop signs or red lights ends
                        the test
                      </li>
                      <li>
                        Dangerous actions: Cutting off other vehicles guarantees
                        failure
                      </li>
                      <li>
                        Poor intersection handling: Blocking traffic or
                        hesitating too long
                      </li>
                      <li>
                        Mounting curbs: Touching curbs during parking or turns
                      </li>
                    </ul>
                  </section>

                  {/* First attempt */}
                  <section id="first-attempt" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Pass Driving Test First Attempt: Is It Possible?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Yes. Many do it. They combine proper training with mental
                      readiness. They do not just learn to drive. They learn to
                      pass.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The difference? Preparation specificity. General{" "}
                      <Link
                        href="/services/automatic-driving-lessons"
                        className="location-link"
                      >
                        driving lessons
                      </Link>{" "}
                      help. Test-focused preparation wins.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Our students often pass the driving test on their first
                      attempt. Why? We target the exam directly. We build real
                      skills simultaneously. You become test-ready and
                      road-ready together.
                    </p>
                  </section>

                  {/* Test day */}
                  <section id="test-day" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      The Test Day Experience: What Actually Happens
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Your examiner introduces themselves. They check your
                      car&apos;s roadworthiness. They check your learner&apos;s
                      license. You sign a form.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The test lasts about 30-45 minutes. You drive various road
                      types. You perform specific maneuvers. You receive
                      directions clearly.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      At the end, you return to the testing center. The examiner
                      calculates your score. They explain your result
                      immediately.
                    </p>
                  </section>

                  {/* Real confidence */}
                  <section id="real-confidence" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Building Real Confidence, Not Just Test Tricks
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Some schools teach tricks. We teach competence. Tricks
                      might help once. Competence lasts forever.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Our certified instructors use modern dual-control
                      vehicles. We create
                      <Link
                        href="https://www.nhtsa.gov/ten-tips-for-safe-driving"
                        target="_blank"
                        className="location-link"
                      >
                        safe learning environments.
                      </Link>{" "}
                      We adapt to your skill level. We never rush your progress.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Nervous drivers thrive with us. We understand anxiety. We
                      have helped countless anxious{" "}
                      <Link
                        href="https://en.wikipedia.org/wiki/Driver%27s_education"
                        target="_blank"
                        className="location-link"
                      >
                        learners
                      </Link>{" "}
                      transform into relaxed, capable drivers.
                    </p>
                  </section>

                  {/* Next step */}
                  <section id="next-step" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Your Next Step: Professional Support Makes the Difference
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      You can study alone. You can practice with family. But
                      professional guidance accelerates success. It eliminates
                      bad habits. It targets your specific needs.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      <Link href="/" className="location-link">
                        Test Route Driving School
                      </Link>
                      serves Kogarah and Greater Sydney. We know local test
                      centers intimately. We know the routes. We know the
                      examiners&apos; expectations.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We offer:
                    </p>
                    <ul className="mt-2 space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                      <li>Individualized lesson plans</li>
                      <li>Flexible scheduling</li>
                      <li>Nervous driver specialists</li>
                      <li>Test route practice</li>
                      <li>Pre-test assessments</li>
                    </ul>
                  </section>

                  {/* FAQ heading (content in sidebar/FAQ component if you use one later) */}
                  <section id="faqs" className="scroll-mt-24">
                    <FaqSection
                      title={"FAQS About Passing the Driving Test in NSW"}
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
                {/* TOC */}
                <BlogToc items={toc} offset={88} />

                {/* Contact card */}
                <div className="rounded-2xl border border-border-color bg-white shadow-sm p-5">
                  <h3 className="text-lg font-bold text-secondary">
                    Ready to Pass? Contact Us Today
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Stop worrying about your NSW driving test. Start preparing
                    to ace it.
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
