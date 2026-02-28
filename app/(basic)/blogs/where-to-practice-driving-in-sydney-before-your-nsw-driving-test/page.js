import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaHandPointer } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import blog5Img from "@/app/assets/blog/blog5.png"; 
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "Where to Practice Driving in Sydney Before Your NSW Driving Test | Safe Spots",
  description:
    "Find where to practice driving in Sydney before your NSW driving test with our mapped safe locations. From quiet streets to test routes, get expert guidance. Book today.",
  keywords: [
    "Practice Driving in Sydney",
"Best places to practice driving in Sydney",
"learner driver practice areas Sydney",
"safe places to practice driving",
"practice driving before test",
"quiet streets for learner drivers",
"driving practice near the test centre",
"Sydney suburbs for driving practice",
"night driving practice NSW",
"beginner driving practice locations",
  ],
};

const toc = [
  { id: "starting-right", label: "Best Places to Practice Driving in Sydney: Starting Right" },
  { id: "top-recommendations", label: "Learner Driver Practice Areas Sydney: Our Top Recommendations" },
  { id: "safety-first", label: "Safe Places to Practice Driving: Safety First" },
  { id: "strategic-prep", label: "Practice Driving Before Test: Strategic Preparation" },
  { id: "quiet-streets", label: "Quiet Streets for Learner Drivers: Building Basics" },
  { id: "near-test-centre", label: "Driving Practice Near the Test Centre: Local Knowledge Wins" },
  { id: "suburbs-guide", label: "Sydney Suburbs for Driving Practice: Regional Guide" },
  { id: "night-practice", label: "Night Driving Practice NSW: Essential Hours" },
  { id: "beginner-locations", label: "Beginner Driving Practice Locations: First Steps" },
  { id: "progressive-practice", label: "Progressive Practice: From Empty Lots to Busy Roads" },
  { id: "faqs", label: "Frequently Asked Questions" },
];

const faqs = [
  {
    question: "Can I practice driving in any public parking lot?",
    answer:
      "Most public lots allow practice if open and safe. Avoid private property without permission. Avoid busy shopping centers during peak times. Check local regulations. Choose quiet times.",
  },
  {
    question: "How do I find quiet streets near my home?",
    answer:
      "Explore on foot first. Walk potential areas. Check traffic patterns at different times. Look for wide streets with minimal parked cars. Avoid main roads. Seek residential loops with little through traffic.",
  },
  {
    question: "Is it legal to practice driving at night with a learner's license?",
    answer:
    <>
    Yes, with a supervising driver. You must display L plates. You must follow all learner restrictions. Complete your 20-night hours before the test. Practice in <Link href="https://www.nhtsa.gov/ten-tips-for-safe-driving" className="location-link" target="_blank">safe,</Link> lit areas initially.
    </>,
  },
  {
    question: "Should I practice on highways as a beginner?",
    answer:
      "Wait until you have basic control mastered. Highways require speed confidence. They require merging skills. They require lane discipline. Build these on quieter roads first. Attempt highways with professional guidance.",
  },
  {
    question: "How close to my test should I practice near the test center?",
    answer:
      "Practice there regularly in your final weeks. Drive the exact routes multiple times. Visit at your scheduled test time. Experience the traffic conditions. Arrive completely familiar.",
  },
];

export default function Blog5() {
  return (
    <section>
      <PageHeroSection
        title={"Where to Practice Driving in Sydney Before Your NSW Driving Test"}
        subtitle={
          <>
            You have your learner&apos;s license. You need hours behind the wheel. You
            wonder where to start. Sydney traffic intimidates you. Busy roads overwhelm you.
            You need the right spots. <br />
            Practice driving in Sydney requires smart location choices. You need safe streets.
            You need quiet areas. You need places that build your skills gradually. <br />
            At<Link href="/" className="location-link">
              Test Route Driving School,
            </Link>we know every practice spot in Greater Sydney. We guide learners daily. We know
            where beginners thrive. We know where advanced skills develop.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={blog5Img}
              alt="Where to Practice Driving in Sydney Before Your NSW Driving Test Test Route Driving School"
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
                  {/* Starting right */}
                  <section id="starting-right" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Best Places to Practice Driving in Sydney: Starting Right
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The best places to practice<Link href="/services/automatic-driving-lessons" className="location-link">
              driving in Sydney
            </Link>balance challenge and safety.
                      You need empty parking lots first. You need quiet residential streets next.
                      You need busier roads later.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-base-300 p-6">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Empty Parking Lots
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Start here. Practice steering. Practice braking. Practice smooth acceleration.
                          No traffic pressures you. No other cars threaten you.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-6">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Quiet Industrial Areas
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Visit on weekends. Wide streets help you. A few parked cars block you.
                          You practice lane positioning. You practice basic turns.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-6">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Residential Streets With Little Traffic
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Find areas with parked cars. Practice gap management. Practice observation.
                          Build real-world awareness.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We know specific locations near Kogarah. We know weekend-quiet zones.
                      We know weekday-safe areas. We match locations to your skill level.
                    </p>
                  </section>

                  {/* Top recommendations */}
                  <section id="top-recommendations" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Learner Driver Practice Areas Sydney: Our Top Recommendations
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Learner driver practice<Link href="/area-covered" className="location-link">in Sydney</Link>vary by region. Each suburb offers unique benefits.
                      Each tests different skills.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Southern Sydney Favorites
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Kogarah has excellent starter streets. Rockdale offers varied intersections.
                          Hurstville provides moderate traffic practice. These areas surround our base.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Western Sydney Options
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Parramatta has wide roads. Blacktown offers highway access. Penrith provides open spaces.
                          Each builds different abilities.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Northern Sydney Spots
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Hornsby has hills to master. Chatswood offers complex intersections.
                          These challenges affect intermediate learners.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We rotate through these areas. We assess your readiness. We choose locations that stretch you safely.
                      You progress faster.
                    </p>
                  </section>

                  {/* Safety first */}
                  <section id="safety-first" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Safe Places to Practice Driving: Safety First
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Safe places to practice driving protect you. They protect others. They reduce anxiety.
                      They build confidence correctly.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border-color bg-base-300 p-6">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Look for these features:
                        </p>
                        <ul className="mt-2 space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                          <li>Low speed limits</li>
                          <li>Minimal traffic</li>
                          <li>Clear sight lines</li>
                          <li>Wide lanes</li>
                          <li>Few pedestrians</li>
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-base-300 p-6">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Avoid these initially:
                        </p>
                        <ul className="mt-2 space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                          <li>Major highways</li>
                          <li>School zones at peak times</li>
                          <li>Narrow streets with heavy parking</li>
                          <li>Complex roundabouts</li>
                          <li>Steep hills</li>
                        </ul>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      Safety creates comfort. Comfort enables learning. Learning builds skill. Skill creates safe drivers.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We prioritize your safety. Our<Link href="/services/car-hire-for-instructor" className="location-link">dual-control vehicles
            </Link>add protection. Our instructors watch constantly.
                      You practice without fear.
                    </p>
                  </section>

                  {/* Strategic prep */}
                  <section id="strategic-prep" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Practice Driving Before Test: Strategic Preparation
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Practice driving before the test requires specific locations. You need test-route streets.
                      You need similar conditions. You need realistic challenges.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Drive near your test center. Learn the surrounding suburbs. Master local intersections.
                      Know the speed limit changes.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Practice these elements:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Hill starts if your route has slopes</li>
                        <li>Lane changes if highways appear</li>
                        <li>Roundabouts if they feature heavily</li>
                        <li>Reverse parking near the actual test streets</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We specialize in this approach. We call ourselves Test Route for a reason.
                      We know the Kogarah test streets. We know nearby practice areas that mirror them perfectly.
                    </p>
                  </section>

                  {/* Quiet streets */}
                  <section id="quiet-streets" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Quiet Streets for Learner Drivers: Building Basics
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Quiet streets for learner drivers form your foundation. You master fundamentals here.
                      You build muscle memory. You develop good habits.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Start with straight streets. Practice smooth steering. Practice consistent speed.
                      Practice gentle braking.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Progress to gentle corners. Learn to judge curves. Learn to position correctly.
                      Learn to adjust speed.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Add simple intersections. Practice stopping completely. Practice checking both ways.
                      Practice turning safely.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We begin with every student this way. We find the quietest streets near you.
                      We eliminate distractions. You focus purely on driving.
                    </p>
                  </section>

                  {/* Near test centre */}
                  <section id="near-test-centre" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Driving Practice Near the Test Centre: Local Knowledge Wins
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Driving practice near the test centre provides huge advantages. You absorb the area.
                      You notice details. You feel at home on test day.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      You learn:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Where examiners turn</li>
                        <li>Which lanes do they prefer</li>
                        <li>Where they test specific skills</li>
                        <li>What hazards appear frequently</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      This familiarity transforms your test performance. You drive confidently.
                      You anticipate directions. You show local expertise.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We center our lessons around test centers. We finish lessons at your test location.
                      You arrive knowing the streets intimately. You pass more easily.
                    </p>
                  </section>

                  {/* Suburbs guide */}
                  <section id="suburbs-guide" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Sydney Suburbs for Driving Practice: Regional Guide
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Sydney suburbs for driving practice offer diverse challenges. Match suburbs to your skill level.
                      Progress systematically.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Beginner-Friendly Suburbs
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Kogarah: Wide residential streets <br />
                          Miranda: Quiet weekend areas <br />
                          Caringbah: Gentle gradients
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Intermediate Challenge Suburbs
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Hurstville: Moderate traffic <br />
                          Rockdale: Varied intersections <br />
                          Bankstown: Busier conditions
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7 font-semibold text-secondary">
                          Advanced Test Preparation
                        </p>
                        <p className="mt-2 text-sm md:text-base leading-7">
                          Sydney CBD: Complex traffic (for advanced learners) <br />
                          Mascot: Highway merging practice <br />
                          Airport surrounds: Heavy traffic experience
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We guide you through this progression. We know every suburb&apos;s character.
                      We advance you when ready. You develop complete skills.
                    </p>
                  </section>

                  {/* Night practice */}
                  <section id="night-practice" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Night Driving Practice NSW: Essential Hours
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      <Link href="/services/night-driving-lesson" className="location-link">Night driving practice
            </Link>in NSW is mandatory for under-25 learners.
                      You need 20 night hours. You need safe locations. You need proper technique.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Start in well-lit areas. Practice headlight use. Practice judging distances.
                      Practice spotting pedestrians.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Progress to darker streets. Learn high-beam etiquette. Learn to manage glare.
                      Learn to read road signs with limited light.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Best night practice areas:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Well-lit shopping centers after hours</li>
                        <li>Quiet residential streets with street lighting</li>
                        <li>Industrial areas with minimal traffic</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We schedule night lessons. We ensure your safety. We teach night-specific skills.
                      You complete your hours confidently.
                    </p>
                  </section>

                  {/* Beginner locations */}
                  <section id="beginner-locations" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Beginner Driving Practice Locations: First Steps
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Beginner driving practice locations should feel welcoming. They should remove pressure.
                      They should encourage experimentation.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Ideal First Locations:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Empty school parking lots on weekends</li>
                        <li>Quiet sports ground car parks</li>
                        <li>Industrial estates on Sundays</li>
                        <li>New housing developments with few residents</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      These spaces let you stall without embarrassment. They let you practice reversing freely.
                      They let you build coordination.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We accompany beginners to these spots. We provide immediate feedback.
                      We correct errors gently. You learn quickly without stress.
                    </p>
                  </section>

                  {/* Progressive practice */}
                  <section id="progressive-practice" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Progressive Practice: From Empty Lots to Busy Roads
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Your practice locations should evolve. Empty lots teach control. Quiet streets teach rules.
                      <Link href="https://en.wikipedia.org/wiki/Traffic" className="location-link" target="_blank">Busy roads
            </Link>teach judgment.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Stage 1: Parking Lots</strong>
                          <br />
                          Master the vehicle. Feel the pedals. Learn the dimensions.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Stage 2: Quiet Streets</strong>
                          <br />
                          Add road rules. Practice signs. Learn intersections.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Stage 3: Moderate Traffic</strong>
                          <br />
                          Handle other cars. Practice courtesy. Build awareness.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Stage 4: Test Routes</strong>
                          <br />
                          Face real conditions. Manage pressure. Prove readiness.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We guide this progression. We assess your comfort. We advance you appropriately.
                      You grow systematically.
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
                    Your Sydney Practice Partners
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Practice driving in Sydney works best with expert guidance. Random practice builds bad habits.
                    Structured practice builds excellence. Local knowledge accelerates progress. <br />
                    At Test Route Driving School, we know every practice location. We know Kogarah&apos;s quiet streets.
                    We know Greater Sydney&apos;s training grounds. We match locations to your needs. <br />
                    Start in the right place. Progress on the right challenges. Pass your test with confidence.
                    Your perfect practice location awaits.
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