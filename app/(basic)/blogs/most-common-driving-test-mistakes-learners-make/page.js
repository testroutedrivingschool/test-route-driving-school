import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import {FaEnvelope, FaHandPointer} from "react-icons/fa";
import {IoCallSharp} from "react-icons/io5";
import blog2Img from "@/app/assets/blog/blog2.png";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "Most Common Driving Test Mistakes Learners Make – How to Avoid Them",
  description:
    "Explore the most common driving test mistakes that fail 50% of learners and expert fixes to avoid them. Master observation checks and speed control. Call now to pass first time.",
  keywords: [
    "Driving Test Mistakes",
    "Why do people fail the driving test",
    "instant fail driving test",
    "fail driving test NSW",
    "major and minor faults driving test",
    "mirror check driving test",
    "signalling errors driving test",
    "not stopping correctly driving test",
    "Driving safety",
    "using mirrors correctly",
    "driving test fault ",
  ],
};

const toc = [
  {id: "why-fail", label: "Why Do People Fail the Driving Test?"},
  {id: "instant-fail", label: "Instant Fail Driving Test: The Critical Errors"},
  {
    id: "major-minor",
    label: "Major and Minor Faults Driving Test: Understanding the Score",
  },
  {
    id: "mirror-check",
    label: "Mirror Check Driving Test: The Most Overlooked Skill",
  },
  {
    id: "signalling",
    label: "Signalling Errors Driving Test: Timing Is Everything",
  },
  {
    id: "stop-sign",
    label: "Not Stopping Correctly Driving Test: The Stop Sign Trap",
  },
  {
    id: "mirrors-correctly",
    label: "Using Mirrors Correctly: Beyond Quick Glances",
  },
  {
    id: "driving-safety",
    label: "Driving Safety: The Real Goal Behind the Test",
  },
  {id: "recover", label: "Driving Test Fault: How to Recover From Errors"},
  {id: "nsw-insights", label: "Fail Driving Test NSW: Local Insights"},
  {id: "faqs", label: "Frequently Asked Questions"},
];

const faqs = [
  {
    question: "What is the most common reason for failing a driving test?",
    answer:
      "Poor observation checks. Learners forget blind spot checks. They miss mirror head movements. Examiners spot this instantly. Practice your checks until they become automatic.",
  },
  {
    question: "Can you fail for going too slow?",
    answer:
      "Yes. Unjustifiably slow driving creates danger. It frustrates other drivers. It shows poor confidence. Match your speed to conditions and limits.",
  },
  {
    question: "How many mistakes are allowed in a driving test?",
    answer:
      "You can make some minor errors and still pass. However, one instant-fail item ends your test. You need 90% overall score. Focus on eliminating critical errors first.",
  },
  {
    question: "Is hitting the curb an automatic fail?",
    answer:
      "Touching the curb lightly during parking may be a minor error. Mounting the curb or hitting it hard fails you immediately. Stay controlled during all maneuvers.",
  },
  {
    question: "What should I do if I make a mistake during my test?",
    answer:
      "Stay calm. Fix it safely. Do not panic. Do not apologize. Drive on confidently. Examiners watch your recovery more than the error itself.",
  },
];

export default function Blog2() {
  return (
    <section>
      <PageHeroSection
        title={"Most Common Driving Test Mistakes Learners Make"}
        subtitle={
          <>
            You have practiced for weeks. You know the road rules. Yet you worry
            about failing. You are not alone. Many learners make the same
            driving test mistakes repeatedly. This guide shows you exactly what
            to avoid. It helps you pass on your first try. <br />
            At{" "}
            <Link href="/" className="location-link">
              Test Route Driving School,
            </Link>{" "}
            we see these errors daily. We fix them quickly. We turn nervous
            drivers into confident ones. Let us share what we know.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={blog2Img}
              alt="Most Common Driving Test Mistakes Learners Make Test Route Driving School"
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
                  {/* Why fail */}
                  <section id="why-fail" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Why Do People Fail the Driving Test?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Why do people fail the<Link
                        href="/services/driving-test-package"
                        className="location-link"
                      >
                        driving test?
                      </Link>The answer is simple. They overlook small details. They
                      panic under pressure. They forget basic habits.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Examiners do not seek perfection. They seek safety. They
                      watch how you think. They watch how you react. One
                      critical error ends your test immediately.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Most failures stem from observation errors. Speed mistakes
                      follow closely. Poor positioning ranks third. These are
                      avoidable. You just need the right training.
                    </p>
                  </section>

                  {/* Instant fail */}
                  <section id="instant-fail" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Instant Fail Driving Test: The Critical Errors
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Some mistakes kill your test instantly. We call these
                      &quot;fail items.&quot; Instant fail driving test errors
                      include:
                    </p>

                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Running red lights or stop signs</li>
                        <li>Speeding by any amount</li>
                        <li>Causing another driver to brake or swerve</li>
                        <li>Mounting curbs during maneuvers</li>
                        <li>Blocking intersections illegally</li>
                        <li>
                          Disobeying the examiner&apos;s directions dangerously
                        </li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      One such error ends your test. Your score becomes
                      irrelevant. You must rebook and repay.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We train you to recognize danger zones. We drill hazard
                      perception until it becomes automatic. You learn to stay
                      calm. You learn to stay safe.
                    </p>
                  </section>

                  {/* Major/minor */}
                  <section id="major-minor" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Major and Minor Faults Driving Test: Understanding the
                      Score
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The major and minor faults<Link
                        href="/services/driving-test-assessment"
                        className="location-link"
                      >
                      driving test system 
                      </Link>confuse
                      many learners. Let us clarify it.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Fail Items (Critical Errors):</strong> These
                          end your test immediately. You get zero tolerance
                          here.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Immediate Fail Errors:</strong> These are
                          serious but context-dependent. Repeated errors in the
                          same category also fail you.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border-color bg-white p-5 shadow-sm">
                        <p className="text-sm md:text-base leading-7">
                          <strong>Minor Faults (Errors):</strong> These are
                          small lapses. You can make some and still pass.
                          However, too many minors add up to a fail.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      You need 90% to pass. That sounds easy. It is not. One
                      instant fail ruins everything.
                    </p>
                  </section>

                  {/* Mirror check */}
                  <section id="mirror-check" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Mirror Check <Link
                        href="/services/driving-test-package"
                        className="location-link"
                      >
                        Driving Test:
                      </Link>The Most Overlooked Skill
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Mirror check driving test habits separate passers from
                      failers. Examiners cannot see your eyes. They watch your
                      head. You must move it clearly.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Check mirrors before:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Signaling</li>
                        <li>Changing lanes</li>
                        <li>Merging</li>
                        <li>Turning</li>
                        <li>Slowing down</li>
                        <li>Opening doors</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      Check every 5-8 seconds while driving. Make it obvious.
                      Make it deliberate.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Many learners forget head checks. They check mirrors only.
                      This misses blind spots. Examiners penalize this heavily.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We teach the &quot;mirror-signal-manoeuvre&quot; routine
                      until it feels natural. We watch your head movements. We
                      correct bad habits early.
                    </p>
                  </section>

                  {/* Signalling */}
                  <section id="signalling" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Signalling Errors Driving Test: Timing Is Everything
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Signalling errors driving test failures happen often. You
                      must signal for 5 seconds before moving off. You must
                      signal 30 meters before turns. You must cancel signals
                      after completing maneuvers.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Common signalling mistakes include:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Signaling too late</li>
                        <li>Forgetting to signal</li>
                        <li>Leaving signals on too long</li>
                        <li>Signaling the wrong direction</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      These errors confuse other <Link
                        href="https://en.wikipedia.org/wiki/Driver%27s_education"
                        className="location-link"
                        target="_blank"
                      >
                        drivers.
                      </Link>They create danger.
                      Examiners notice immediately.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Practice your timing. Count out loud if needed. Build
                      muscle memory. Good signalling shows you think ahead.
                    </p>
                  </section>

                  {/* Stop sign */}
                  <section id="stop-sign" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Not Stopping Correctly Driving Test: The Stop Sign Trap
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Not stopping correctly, driving test errors fail thousands
                      yearly. A stop sign means complete stop. Your wheels must
                      stop turning. You must check both ways. You must proceed
                      safely.
                    </p>

                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <p className="text-sm md:text-base leading-7 font-semibold">
                        Rolling stops fail you. Slowing down fails you. You must
                        stop fully.
                      </p>
                      <p className="mt-3 text-sm md:text-base leading-7">
                        At stop lines, stop completely. Check for traffic. Check
                        for pedestrians. Then move.
                      </p>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      We practice stop signs repeatedly. We drill the full
                      routine. You will never roll through again.
                    </p>
                  </section>

                  {/* Using mirrors correctly */}
                  <section id="mirrors-correctly" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Using Mirrors Correctly: Beyond Quick Glances
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Using mirrors correctly requires more than looking. You
                      must interpret what you see. You must predict what will
                      happen.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Check your mirrors constantly. Ask yourself: Who is behind
                      me? How fast are they approaching? Are they changing
                      lanes?
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Before any maneuver, check all three mirrors. Check the
                      left mirror. Check the rear mirror. Check the right
                      mirror. Then check blind spots.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      This sounds like a lot. It becomes automatic with
                      practice. We build this rhythm into every lesson.
                    </p>
                  </section>

                  {/* Driving safety */}
                  <section id="driving-safety" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Driving Safety: The Real Goal Behind the Test
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Driving safety is why tests exist. Examiners want safe
                      drivers on NSW roads. They want low-risk behavior. They
                      want smart decisions.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      Safe driving means:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Keeping safe following distances</li>
                        <li>Adjusting speed for conditions</li>
                        <li>Scanning for hazards constantly</li>
                        <li>Predicting other drivers&apos; mistakes</li>
                        <li>Staying calm under pressure</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      Passing the test proves you can handle real roads. It
                      proves you will not endanger others.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Our defensive driving focus prepares you for the test and
                      for life. We teach awareness. We teach anticipation.
                    </p>
                  </section>

                  {/* Recover */}
                  <section id="recover" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Driving Test Fault: How to Recover From Errors
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Everyone makes mistakes. A driving test fault does not
                      always mean failure. Minor errors are acceptable. The key
                      is recovery.
                    </p>

                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <p className="text-sm md:text-base leading-7">
                        If you miss a gear, fix it smoothly. If you drift
                        slightly, correct gently. If you stall, restart calmly.
                      </p>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      Panic kills tests. Composure saves them. Examiners watch
                      your reaction. They want to see you handle problems
                      <Link
                        href="https://www.nhtsa.gov/ten-tips-for-safe-driving"
                        className="location-link"
                        target="_blank"
                      >
                      safely.
                      </Link>
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We simulate errors during practice. We teach recovery
                      techniques. You learn to stay cool when things go wrong.
                    </p>
                  </section>

                  {/* NSW insights */}
                  <section id="nsw-insights" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Fail Driving Test NSW: Local Insights
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Fail driving test: NSW statistics show 45-50% of learners
                      fail first attempts. Why? Local roads challenge you.
                      Sydney traffic tests your nerves. Specific routes trip up
                      the unprepared.
                    </p>

                    <p className="mt-4 text-sm md:text-base leading-7 font-semibold text-secondary">
                      NSW examiners assess five key areas:
                    </p>

                    <div className="mt-3 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7 list-disc pl-6">
                        <li>Speed management</li>
                        <li>Road positioning</li>
                        <li>Decision-making</li>
                        <li>Responding to hazards</li>
                        <li>Vehicle control</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-sm md:text-base leading-7">
                      Know your local test center. Know the surrounding streets.
                      Know the tricky intersections. Local knowledge gives you
                      confidence.
                    </p>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      We specialize in Greater Sydney test routes. We know
                      Kogarah and <Link
                        href="/area-covered"
                        className="location-link"
                      >
                      the surrounding suburbs intimately.
                      </Link>We prepare
                      you for the exact conditions you will face.
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
                {/* TOC */}
                <BlogToc items={toc} offset={88} />

                {/* Contact card */}
                <div className="rounded-2xl border border-border-color bg-white shadow-sm p-5">
                  <h3 className="text-lg font-bold text-secondary">
                    Your Path to a Perfect Test
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Avoiding driving test mistakes requires more than reading.
                    It requires expert guidance. It requires structured
                    practice. It requires local knowledge. <br />
                    At Test Route Driving School, we eliminate common errors
                    before they become habits. We build your confidence. We
                    prepare you for NSW roads and NSW examiners. <br />
                    Stop fearing failure. Start driving with confidence. Your
                    license is closer than you think.
                  </p>

                  <div className="mt-4 space-y-3">
                    <Link
                      href="/bookings"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color"
                    >
                      <FaHandPointer />
                      Book Online
                    </Link>
                    <a
                      href="tel:61412018593"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-white px-5 py-3 font-semibold"
                    >
                      <IoCallSharp />
                      Call 0412 018 593
                    </a>

                    <a
                      href="mailto:testroutedrivingschool@gmail.com"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-semibold hover:bg-gray-50 transition border border-border-color"
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
