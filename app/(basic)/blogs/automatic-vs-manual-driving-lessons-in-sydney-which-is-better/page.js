import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import {FaCheckCircle, FaEnvelope, FaHandPointer} from "react-icons/fa";
import {IoCallSharp} from "react-icons/io5";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title:
    "Automatic vs Manual Driving Lessons - Choose the Best Path for Your P's",
  description:
    "Compare automatic vs manual driving lessons to see which suits your Sydney goals. Learn about license restrictions, costs, and expert tips to pass your test today.",
  keywords: [
    "Automatic vs Manual Driving Lessons",
    "Automatic driving lessons Sydney",
    "manual driving lessons Sydney",
    "Should I learn automatic or manual NSW?",
    "manual licence vs automatic licence NSW",
    "The difference between an auto and a manual licence",
    "Transport for NSW",
    "P1 licence",
    "Is manual harder than automatic?",
    "Can I drive a manual with an automatic licence",
    "Is a manual licence better in Australia?",
    "manual driving school Sydney",
    "automatic driving instructor near me",
    "Upgrade from auto to manual licence Nin SW",
  ],
};

const toc = [
  {
    id: "understanding-choice",
    label: "Understanding the Choice Between Auto and Manual",
  },
  {id: "licensing-differences", label: "The Core Differences in NSW Licensing"},
  {id: "is-manual-harder", label: "Is Manual Harder than Automatic?"},
  {
    id: "manual-vs-auto-license",
    label: "Manual License vs Automatic License NSW",
  },
  {id: "upgrading-license", label: "Upgrading Your License in Sydney"},
  {id: "expert-opinion", label: "Expert Opinion: Which Should You Choose?"},
  {id: "faqs", label: "Frequently Asked Questions"},
];

const faqs = [
  {
    question: "Can I drive a manual with an automatic licence?",
    answer:
      "Not if you are on your P1 licence in NSW. You must wait until you have a P2 or full license. Even then, it is dangerous to drive a manual without training.",
  },
  {
    question: "Is it worth learning manual in 2026?",
    answer:
      "It is worth it if you plan to drive overseas or work in trades. Most European rentals are still manual. Many Australian work utes are manual too.",
  },
  {
    question: "Does Test Route Driving School offer both?",
    answer: (
      <>
        Yes. We provide tailored lessons for both types. Our instructors use
        modern dual-controlled vehicles for your{" "}
        <Link href={``} className="location-link" target="_blank">
          safety.
        </Link>
      </>
    ),
  },
  {
    question: "How many hours do I need to master the manual?",
    answer:
      "Most students need 5 to 10 extra hours compared to auto. This time covers hill starts and smooth gear changes.",
  },
];

export default function Blog7() {
  return (
    <section>
      <PageHeroSection
        title={
          "Automatic vs Manual Driving Lessons in Sydney – Which Is Better?"
        }
        subtitle={
          <>
            Choosing between{" "}
            <Link
              href="/services/automatic-driving-lessons"
              className="location-link"
            >
              Automatic vs Manual Driving Lessons
            </Link>{" "}
            depends on your goals and lifestyle. Automatic cars offer a faster
            learning curve for busy Sydney traffic. Manual cars provide more
            control and a versatile license. This guide compares the pros, cons,
            and license restrictions in NSW to help you decide. Understanding
            these differences ensures you pick the right training for your
            driving future.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={"/images/blog/blog7.png"}
              alt="Automatic vs Manual Driving Lessons in Sydney – Test Route Driving School"
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
                  {/* Understanding the Choice Between Auto and Manual */}
                  <section id="understanding-choice" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Understanding the Choice Between Auto and Manual
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      I have spent over 10 years as a driving instructor in
                      Sydney. I often hear one question: &quot;Should I learn
                      automatic or manual NSW?&quot; There is no single
                      &quot;right&quot; answer. Your choice changes how you
                      interact with the car and the road. Automatic driving
                      lessons in Sydney are very popular right now. They allow
                      you to focus more on the road and less on the machinery.
                      However,{" "}
                      <Link
                        href={`/services/automatic-driving-lessons`}
                        className="location-link"
                        target="_blank"
                      >
                        manual driving lessons in Sydney
                      </Link>{" "}
                      remain a classic skill. When you master a clutch, you gain
                      a deeper feel for the vehicle. Most modern cars in
                      Australia are automatic. Yet, many work vehicles and
                      performance cars still use manual gearboxes. Your decision
                      will affect your P1 licence conditions and your freedom to
                      drive different cars.
                    </p>
                  </section>

                  {/* The Core Differences in NSW Licensing */}
                  <section id="licensing-differences" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      The Core Differences in NSW Licensing
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The{" "}
                      <strong>
                        difference between an auto and a manual licence
                      </strong>{" "}
                      is significant under Transport for NSW rules. If you pass
                      your test in an automatic car, your P1 licence will have a
                      condition &quot;A.&quot; This means you cannot drive a
                      manual car until you move to your green Ps or full
                      license.
                    </p>
                    <h2 className="mt-3 text-2xl md:text-3xl font-bold text-secondary">
                      Manual Licence vs Automatic Licence NSW
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      If you get a{" "}
                      <strong>
                        manual licence vs an automatic licence in NSW,
                      </strong>{" "}
                      you have zero restrictions. You can hop into any passenger
                      car immediately. For many, this versatility makes people
                      ask: is a manual licence better in Australia? If you plan
                      to travel overseas or drive delivery vans, the answer is
                      often yes.
                    </p>
                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7">
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Automatic:</strong> No clutch pedal. The car
                            shifts gears for you.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Manual:</strong> You use a clutch and gear
                            stick. It requires more coordination.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Licensing:</strong> An automatic test limits
                            your P1 phase to auto-only vehicles.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Is Manual Harder than Automatic? */}
                  <section id="is-manual-harder" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Is Manual Harder than Automatic?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The short answer is yes, initially. When students ask,
                      &quot;Is manual harder than automatic?&ldquo; I tell them
                      about the &quot;cognitive load.&quot; In a manual car,
                      your brain handles four limbs at once. You must time the
                      clutch and accelerator perfectly to avoid stalling. In
                      Kogarah traffic, stalling at a green light is stressful.
                    </p>
                    <p className="mt-3 text-sm md:text-base leading-7">
                      <Link
                        href={`/services/automatic-driving-lessons`}
                        className="location-link"
                      >
                        Automatic driving lessons in Sydney
                      </Link>{" "}
                      remove that stress. You simply &quot;D&quot; for Drive and
                      &quot;P&quot; for Park. This lets you focus on NSW Driving
                      Test Routes and hazard perception. I have seen students
                      pass their test much faster automatically. They spend less
                      time learning gears and more time learning safety.
                    </p>
                    <div className="mt-6 overflow-x-auto rounded-2xl border border-border-color">
                      <table className="w-full text-left text-sm md:text-base">
                        <thead className="bg-base-300">
                          <tr>
                            <th className="p-4 font-semibold text-secondary">
                              Feature
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              Automatic Lessons
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              Manual Lessons
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {[
                            [
                              "Learning Speed",
                              "Faster (5-10 lessons)",
                              "Slower (10-20 lessons)",
                            ],
                            [
                              "Complexity",
                              "Low (Focus on the road)",
                              "High (Focus on the car)",
                            ],
                            [
                              "NSW Restriction",
                              "Limited to Auto on P1",
                              "No Restrictions)",
                            ],
                            [
                              "Vehicle Choice",
                              "Most modern cars",
                              "Vans, trucks, sports cars",
                            ],
                            [
                              "Cost",
                              "Usually standard rates",
                              "Can be higher per lesson",
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

                  {/* Upgrading Your License in Sydney */}
                  <section id="upgrading-license" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Upgrading Your License in Sydney
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Don&apos;t feel stuck if you start with an auto. You can
                      upgrade from an auto to a manual licence in NSW later. You
                      generally need to pass a fresh practical test in a manual
                      vehicle. Many drivers do this once they realise they need
                      a manual for work. <br />
                      If you are looking for an{" "}
                      <Link
                        href={`/services/automatic-driving-lessons`}
                        className="location-link"
                      >
                        automatic driving instructor near me,
                      </Link>{" "}
                      consider your long-term needs. Do you want to get on the
                      road quickly? Go automatic. Do you want a career in
                      transport or love vintage cars? Choose a manual driving
                      school in Sydney.
                    </p>
                  </section>

                  {/* Expert Opinion: Which Should You Choose? */}
                  <section id="expert-opinion" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Expert Opinion: Which Should You Choose?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      In my experience, 80% of Sydney learners now choose
                      automatic. The traffic in the Greater Sydney region is
                      heavy. Dealing with a clutch in stop-start traffic on the
                      Princes Highway is tiring. However, I always respect the
                      &quot;purist&quot; who wants a manual. It is a rewarding
                      skill that makes you a very attentive driver.
                    </p>
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
                    Start Your Driving Journey Today
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Whether you want{" "}
                    <Link
                      href={`/services/automatic-driving-lessons`}
                      className="location-link"
                    >
                      automatic driving lessons in Sydney
                    </Link>{" "}
                    or want to master the clutch, we can help. Test Route
                    Driving School focuses on making you a safe, confident
                    driver. We know the Kogarah area and Sydney test routes
                    inside and out. Our patient instructors will guide you
                    through every gear change or intersection. Don&apos;t let
                    the choice overwhelm you. Call us to discuss your goals. We
                    will find the best path for your NSW license.
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
