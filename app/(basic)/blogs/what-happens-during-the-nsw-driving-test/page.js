import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaHandPointer } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import blog3Img from "@/app/assets/blog/blog3.png";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "What Happens During the NSW Driving Test – Step-by-Step Guide",
  description:
    "Know exactly what happens during the NSW driving test from start to finish. Learn the full process, scoring system, and examiner expectations. Book your pre-test preparation today.",
  keywords: [
    "NSW Driving Test",
    "NSW driving test process",
    "NSW practical driving test steps",
    "driving test NSW checklist",
    "how long is the NSW driving test",
    "test day requirements NSW",
    "driving test centre",
    "test day requirements NSW",
    "Driving Test Manoevres",
    "booking the driving test",
    "Driving skills assessed",
  ],
};

const toc = [
  { id: "booking", label: "Booking the Driving Test: Your First Step" },
  { id: "requirements", label: "Test Day Requirements NSW: What You Must Bring" },
  { id: "arriving", label: "Arriving at the Driving Test Centre" },
  { id: "how-long", label: "How Long Is the NSW Driving Test?" },
  { id: "steps", label: "NSW Practical Driving Test Steps: The Full Journey" },
  { id: "manoeuvres", label: "Driving Test Manoeuvres: What You Must Perform" },
  { id: "skills", label: "Driving Skills Assessed: The Five Key Areas" },
  { id: "process", label: "NSW Driving Test Process: Behind the Scenes" },
  { id: "checklist", label: "Driving Test NSW Checklist: Your Preparation Guide" },
  { id: "faqs", label: "Frequently Asked Questions" },
];

const faqs = [
  {
    question: "Can I use my own car for the driving test?",
    answer:
    <>
    Yes, if it meets<Link href="https://www.britannica.com/search?query=driving+safety" className="location-link" target="_blank">safety
            </Link>standards. It must have working lights, tires, brakes, and a horn. It must be clean and roadworthy. Many learners prefer hiring our dual-control vehicles for peace of mind.
    </>,
  },
  {
    question: "What happens if I fail the driving test?",
    answer:
      "The examiner explains your errors. You receive a score report. You must wait before rebooking. You need more practice. We analyze your failure points. We target them specifically.",
  },
  {
    question: "Can the examiner talk to me during the test?",
    answer:
      "Yes, they give directions. They tell you where to turn. They tell you which manoeuvre to perform. They do not chat casually. Focus on their instructions.",
  },
  {
    question: "What should I wear for the driving test?",
    answer:
      "Wear comfortable clothes. Wear proper shoes—no thongs or high heels. Remove sunglasses unless medically required. You need a clear vision.",
  },
  {
    question: "How soon can I rebook if I fail?",
    answer:
      "You can rebook immediately for the next available slot. However, you must wait at least 7 days before taking another test. Use this time to practice your weak areas.",
  },
];

export default function Blog3() {
  return (
    <section>
      <PageHeroSection
        title={"What Happens During the NSW Driving Test"}
        subtitle={
          <>
            Your heart races. Your palms sweat. You sit in the waiting room. You
            wonder what comes next. This guide walks you through every moment.
            It removes surprises. It builds your confidence. <br />
            At<Link href="/" className="location-link">
              Test Route Driving School,
            </Link>we prepare learners daily. We know the NSW driving test inside out.
            We know what examiners want. We know how to help you succeed.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={blog3Img}
              alt="What Happens During the NSW Driving Test Test Route Driving School"
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
                  {/* Booking */}
                  <section id="booking" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Booking the Driving Test: Your First Step
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Booking the <Link href="/services/driving-test-package" className="location-link">driving test
            </Link>happens online through Service
                      NSW. You need your learner&apos;s license details. You
                      need to pick a location. You need to choose a date.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Popular centers fill fast. Book early. Kogarah and nearby
                      Sydney centers have high demand. Check multiple locations
                      if you are flexible.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      You must hold your learner&apos;s license for at least 10
                      months if you are under 25. You must complete your logbook
                      hours. You must pass the Hazard Perception Test.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We help our students pick optimal test times. We know
                      which slots have lighter traffic. We know which days work
                      best.
                    </p>
                  </section>

                  {/* Requirements */}
                  <section id="requirements" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Test Day Requirements NSW: What You Must Bring
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Test day requirements in NSW are strict. Missing documents
                      cancel your test. You lose your fee. You must rebook.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Bring these items:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Your current learner&apos;s license</li>
                        <li>Proof of identity</li>
                        <li>A roadworthy vehicle</li>
                        <li>A supervising driver (if you fail)</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      Your car must meet safety standards. Tires need tread.
                      Lights must work. Brakes must function. The horn must
                      sound.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We offer test day vehicle hire. Our dual-control cars meet
                      all standards. You drive a familiar, safe vehicle. You
                      avoid last-minute stress.
                    </p>
                  </section>

                  {/* Arriving */}
                  <section id="arriving" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Arriving at the Driving Test Centre
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      You reach the driving test centre 15 minutes early. You
                      park. You check in at the counter. You wait.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      An examiner calls your name. They introduce themselves.
                      They check your license. They check your vehicle. They
                      explain the process.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      You sign a declaration. You confirm you understand the
                      rules. You walk to your car together.
                    </p>
                  </section>

                  {/* How long */}
                  <section id="how-long" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      How Long Is the NSW Driving Test?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      How long is the <Link href="/services/driving-test-package" className="location-link">NSW driving test? 
            </Link>It lasts 30 to 45
                      minutes. It varies by traffic. It varies by route
                      complexity.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The examiner directs you throughout. They give clear
                      instructions. They watch your every move. They score
                      continuously.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Time flies when you are prepared. It drags when you are
                      lost. Proper training makes the difference.
                    </p>
                  </section>

                  {/* Steps */}
                  <section id="steps" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      NSW Practical Driving Test Steps: The Full Journey
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The NSW practical <Link href="/services/driving-test-assessment" className="location-link">driving test steps  
            </Link>follow a clear
                      pattern. Know them. Expect them. Master them.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Step 1: Pre-Drive Check</strong>
                          <br />
                          The examiner inspects your car. They check the lights.
                          They check tires. They check indicators. They check
                          brake lights.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Step 2: Cockpit Drill</strong>
                          <br />
                          You sit in the driver&apos;s seat. You adjust mirrors.
                          You adjust the seat. You fasten your seatbelt. You
                          check controls.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Step 3: Starting the Engine</strong>
                          <br />
                          You start smoothly. You check the surroundings. You
                          signal if needed. You move off safely.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Step 4: General Driving</strong>
                          <br />
                          You follow directions. You navigate intersections. You
                          handle roundabouts. You manage speed. Your position.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Step 5: Specific Manoeuvres</strong>
                          <br />
                          You perform set tasks. These test your control. These
                          test your precision.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Step 6: Return and Debrief</strong>
                          <br />
                          You drive back to the centre. The examiner calculates
                          your score. They tell you the result immediately.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Manoeuvres */}
                  <section id="manoeuvres" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Driving Test Manoeuvres: What You Must Perform
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Driving test manoeuvres vary by location. Examiners choose
                      from a set list. You typically perform two or three.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Common manoeuvres include:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Reverse parking (parallel or bay)</li>
                        <li>Three-point turn</li>
                        <li>Hill start</li>
                        <li>Lane change</li>
                        <li>U-turn</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      You must complete each smoothly. You must show control.
                      You must show awareness. You must check blind spots.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We practice these repeatedly. We drill them on actual test
                      routes. You build muscle memory. You perform confidently
                      under pressure.
                    </p>
                  </section>

                  {/* Skills */}
                  <section id="skills" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Driving Skills Assessed: The Five Key Areas
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Examiners assess specific driving skills. They use
                      standard criteria. They score objectively.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          Speed Management
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          You match speed to conditions. You observe limits. You
                          slow for hazards. You never rush.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          Road Positioning
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          You stay centered. You keep a safe distance. You
                          position for turns correctly.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          Decision-Making
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          You choose safe gaps. You plan early. You act
                          decisively. You avoid hesitation.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5">
                        <h3 className="text-lg font-bold text-secondary">
                          Responding to Hazards
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          You scan constantly. You check mirrors. You identify
                          risks. You react appropriately.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-5 md:col-span-2">
                        <h3 className="text-lg font-bold text-secondary">
                          Vehicle Control
                        </h3>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          You steer smoothly. You brake gently. You accelerate
                          steadily. You show mastery.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      These five areas determine your score. You need 90% to
                      pass. You must avoid instant fail errors.
                    </p>
                  </section>

                  {/* Process */}
                  <section id="process" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      NSW Driving Test Process: Behind the Scenes
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The NSW <Link href="/services/driving-test-assessment" className="location-link">driving test process
            </Link> involves more than driving.
                      Examiners follow strict protocols. They ensure fairness.
                      They ensure safety.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      They use digital scoring devices. They record your
                      performance. They note every error. They categorize faults
                      immediately.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Instant fail items end the test. They stop the car. They<Link href="https://www.tourcompass.co.uk/blog/driving-in-australia.htm" className="location-link" target="_blank">drive
            </Link>you back. You receive immediate feedback.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Minor errors accumulate. Too many fail you. Consistent
                      errors in one category also fail you.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Understanding this process helps you stay calm. You know
                      what to expect. You know how to recover.
                    </p>
                  </section>

                  {/* Checklist */}
                  <section id="checklist" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Driving Test NSW Checklist: Your Preparation Guide
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Use this driving test NSW checklist before your exam.
                      Check every item. Leave nothing to chance.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Documents Ready
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          License current? Check. Logbook complete? Check.
                          Booking confirmed? Check.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Vehicle Prepared
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Tires good? Check. Lights working? Check. Fuel full?
                          Check. Clean and tidy? Check.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Personal Preparation
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Rested well? Check. Ate breakfast? Check. Arrived
                          early? Check. Calm mindset? Check.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Skills Polished
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Manoeuvres smooth? Check. Observation habits strong?
                          Check. Local routes familiar? Check.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We run <Link href="/services/driving-test-assessment" className="location-link">pre-test assessments.
            </Link> We check your readiness. We
                      fix last-minute issues. You enter the test fully prepared.
                    </p>
                  </section>

                  {/* FAQs */}
                  <section id="faqs" className="scroll-mt-24">
                    <FaqSection
                      title={"Frequently Asked Questions"}
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
                  Your Test Day Success Starts Here
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                   Understanding what happens during the NSW driving test removes fear. It builds confidence. It helps you perform at your best. <br/>
At Test Route Driving School, we simulate the full test experience. We know the Kogarah routes. We know examiner expectations. We know how to prepare you.

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