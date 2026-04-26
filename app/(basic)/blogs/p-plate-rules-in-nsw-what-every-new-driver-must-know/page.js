/* eslint-disable react/no-unescaped-entities */
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Image from "next/image";
import Link from "next/link";
import {FaCheckCircle, FaEnvelope, FaHandPointer} from "react-icons/fa";
import {IoCallSharp} from "react-icons/io5";
import BlogToc from "@/app/shared/shared/blog/BlogToc";
import FaqSection from "@/app/shared/FaqSection";

export const metadata = {
  title: "P-Plate Rules in NSW for New Drivers / Avoid Fines and Suspensions",
  description:
    "Master the P-plate rules in NSW to ensure you never lose your P’s. We explain demerit point limits and night-time passenger restrictions for every learner in Sydney.",
  keywords: [
    "P-Plate Rules",
    "P1 licence rules in NSW",
    "P2 licence restrictions",
    "red P plate rules",
    "green P plate rules",
    "speed limit for P platers in NSW",
    "passenger restrictions P1",
    "Transport for NSW",
    "Can P-plate drivers use a phone for GPS in NSW?",
    "What cars can P-platers drive?",
    "Blood alcohol limit P plate",
    "When do P plates expire in NSW?",
  ],
};

const toc = [
  {
    id: "navigating-complex-rules",
    label: "Navigating the Complex NSW P-Plate Rules",
  },
  {
    id: "red-plates-restrictions",
    label: "Red P-Plates: The P1 Licence Restrictions",
  },
  {
    id: "green-plates-restrictions",
    label: "Green P-Plates: Moving to P2 Licence Restrictions",
  },
  {id: "mobile-phone-ban", label: "Mobile Phones and Technology: A Total Ban"},
  {
    id: "vehicle-restrictions",
    label: "Vehicle Restrictions and Alcohol Limits",
  },
  {
    id: "what-cars-can-p-platers-drive",
    label: "What Cars Can P-Platers Drive?",
  },
  {
    id: "professional-vs-trial",
    label: "Professional Training vs. Trial and Error",
  },
  {id: "faqs", label: "Frequently Asked Questions"},
];

const faqs = [
  {
    question: "When do P plates expire in NSW?",
    answer:
      "Your P1 license is valid for 18 months, but you can move to P2 after 12 months. Your P2 license is valid for 36 months, and you can apply for a full license after holding it for 24 months without a suspension.",
  },
  {
    question: "Can I use Google Maps on my car's built-in screen?",
    answer:
      "Only if the car has a built-in GPS that does not require a mobile phone connection. You cannot use a phone-linked map like CarPlay.",
  },
  {
    question: "What happens if I get a speeding fine on my Ps?",
    answer:
      "For P1 drivers, any speeding fine usually results in an immediate 3-month suspension. This is because any speeding offence carries at least 4 demerit points in NSW.",
  },
  {
    question: "Are there exemptions for the 11 pm passenger rule?",
    answer:
      "Yes. You can apply for an exemption for work or family reasons. You must carry the approved exemption letter with you at all times.",
  },
  {
    question: "Can I tow a boat on my green Ps?",
    answer:
      "Yes, P2 drivers can tow trailers or boats, provided the vehicle is rated for it. Just ensure you display a green P plate on the back of the trailer.",
  },
];

export default function Blog8() {
  return (
    <section>
      <PageHeroSection
        title={"P-Plate Rules in NSW – What Every New Driver Must Know"}
        subtitle={
          <>
            Mastering{" "}
            <Link
              href="/services/driving-test-assessment"
              className="location-link"
            >
              P-Plate Rules
            </Link>{" "}
            is the final hurdle to keeping your freedom on the road. In NSW,
            provisional drivers face strict restrictions on speed, passengers,
            and technology to ensure safety. This guide breaks down red and
            green P-plate laws, alcohol limits, and mobile phone bans. Stay
            informed to protect your license and avoid heavy fines while driving
            throughout Sydney and beyond.
          </>
        }
      />

      <Container>
        {/* FEATURE IMAGE */}
        <section className="mt-8 md:mt-12">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={"/images/blog/blog8.png"}
              alt="P-Plate Rules in NSW – Test Route Driving School"
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
                  {/* Navigating the Complex NSW P-Plate Rules */}
                  <section
                    id="navigating-complex-rules"
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Navigating the Complex NSW P-Plate Rules
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      I have guided hundreds of students through their first
                      year of solo driving. I know that transitioning from a
                      learner to the P-Plate Rules is exciting. However, the{" "}
                      <strong>P1 licence rules in NSW</strong> are designed to
                      be strict for a reason. Statistics show that the first six
                      months of solo driving are the riskiest. <br /> <br />
                      In my 10 years of experience, the biggest shock for new
                      drivers is the complexity. You aren't just driving; you
                      are managing a list of "don'ts." From speed limits for
                      P-platers in NSW to strict mobile phone bans, the law
                      expects total compliance. One small mistake can lead to an
                      immediate three-month suspension.{" "}
                      <strong>Transport for NSW</strong> has even tightened
                      rules in early 2026 regarding overseas license
                      conversions, showing their focus on higher road standards.
                    </p>
                  </section>

                  {/* Red P-Plates: The P1 Licence Restrictions */}
                  <section
                    id="red-plates-restrictions"
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Red P-Plates: The P1 Licence Restrictions
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      When you pass your test, you start on a P1 license. These
                      red <strong>P-Plate Rules</strong> are the most
                      restrictive. You must hold this license for at least 12
                      months. If you are under 25, you face even tougher
                      conditions during late-night hours.
                    </p>
                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7">
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Passenger and Speed Limits:</strong> The
                            passenger restrictions P1 drivers face are often
                            misunderstood. If you are under 25, you can only
                            carry one passenger under 21 between 11 pm and 5 am.
                            I have seen many students get caught simply driving
                            their friends home from a late movie. Immediate
                            family members are exempt from this, but you should
                            always carry proof if needed.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Speed Limit:</strong> The speed limit for P
                            platers in NSW on red Ps is a hard 90 km/h. It does
                            not matter if the highway sign says 110 km/h. You
                            must stick to 90. Going even slightly over can
                            result in 4 demerit points, which is your entire
                            limit.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Green P-Plates: Moving to P2 Licence Restrictions */}
                  <section
                    id="green-plates-restrictions"
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Green P-Plates: Moving to P2 Licence Restrictions
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Once you complete 12 months on red Ps, you move to your
                      green Ps. The{" "}
                      <Link
                        href={`https://www.qld.gov.au/transport/licensing/driver-licensing/applying/provisional/p2`}
                        className="location-link"
                        target="_blank"
                      >
                        P2 licence restrictions{" "}
                      </Link>
                      offer a bit more freedom. Your speed limit for P-platers
                      in NSW increases to 100 km/h. You also have 7 demerit
                      points to work with. However, many green P-Plate Rules
                      stay the same. You still cannot supervise a learner. You
                      still cannot have any alcohol in your system. I always
                      tell my students that green Ps are not a "free pass."
                      Transport for NSW still monitors your driving habits very
                      closely. If you receive a suspension on your P2 license,
                      the time you are suspended does not count toward your
                      24-month requirement for a full license.
                    </p>
                  </section>

                  {/* Mobile Phones and Technology: A Total Ban */}
                  <section id="mobile-phone-ban" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Mobile Phones and Technology: A Total Ban
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      A common question I get is: Can P-plate drivers use a
                      phone for GPS in NSW? The answer is a firm No. Even in
                      2026, Transport for NSW maintains a total ban. You cannot
                      use your phone for music, calls, or navigation. <br />
                      This includes hands-free, Bluetooth, or even having the
                      phone in a cradle. If you need maps, you must use a
                      dedicated GPS unit that is not a phone. I once had a
                      student lose their license because they touched their
                      phone to skip a song at a red light.
                    </p>
                    <div className="mt-5 rounded-2xl border border-border-color bg-base-300 p-6">
                      <ul className="space-y-2 text-sm md:text-base leading-7">
                        <li className="flex gap-2">
                          <FaCheckCircle className="mt-1 shrink-0" />
                          <span>
                            <strong>Important 2026 Update:</strong> This ban
                            also applies to Apple CarPlay and Android Auto. You
                            cannot have your phone connected to your car's
                            screen via a cable or Bluetooth if you are a P1 or
                            P2 driver. Using these systems counts as illegal
                            mobile phone use.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 overflow-x-auto rounded-2xl border border-border-color">
                      <table className="w-full text-left text-sm md:text-base">
                        <thead className="bg-base-300">
                          <tr>
                            <th className="p-4 font-semibold text-secondary">
                              Rule Category
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              P1 (Red Plates)
                            </th>
                            <th className="p-4 font-semibold text-secondary">
                              P2 (Green Plates)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {[
                            ["Max Speed", "90 km/h", "100 km/h"],
                            ["Alcohol (BAC)", "0.00 (Zero)", "0.00 (Zero)"],
                            [
                              "Mobile Phone/CarPlay",
                              "Prohibited (Total Ban)",
                              "Prohibited (Total Ban)",
                            ],
                            [
                              "Demerit Points",
                              "4 Points (Suspension at 4)",
                              "7 Points (Suspension at 7)",
                            ],
                            [
                              "Towing",
                              "Up to 250kg",
                              "Allowed (Standard weights)",
                            ],
                            [
                              "High Performance",
                              "Banned (Over 130kW/t)",
                              "Banned (Over 130kW/t)",
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

                  {/* Vehicle Restrictions and Alcohol Limits */}
                  <section id="vehicle-restrictions" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Vehicle Restrictions and Alcohol Limits
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      The blood alcohol limit P plate drivers must follow is
                      0.00. There is no "one drink" rule for you. Alcohol stays
                      in your system longer than you think. If you had a big
                      night, you might still be over the limit the next morning.
                      Police in areas like Kogarah and Sydney’s South frequently
                      run morning breath tests for this reason.
                    </p>
                  </section>

                  {/* What Cars Can P-Platers Drive? */}
                  <section
                    id="what-cars-can-p-platers-drive"
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      What Cars Can P-Platers Drive?
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      You might wonder,{" "}
                      <strong>what cars can P-platers drive?</strong> You are
                      banned from high-performance vehicles. This usually means
                      cars with a power-to-weight ratio over 130kW per tonne.
                      This includes many turbocharged, supercharged, or V8
                      engines. Always check the Transport for NSW prohibited
                      vehicle list before buying. Driving a banned car is an
                      instant fine and loss of points.
                    </p>
                  </section>

                  {/* Professional Training vs Trial and Error */}
                  <section id="professional-vs-trial" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Professional Training vs Trial and Error
                    </h2>

                    <p className="mt-3 text-sm md:text-base leading-7">
                      Many new drivers think they know the P-Plate Rules until
                      they get a fine in the mail. My expert opinion is that
                      structured training is the best prevention. At{" "}
                      <Link href={`/`} className="location-link">
                        Test Route Driving School,
                      </Link>{" "}
                      we teach more than just how to steer. We teach the law.
                      I’ve met many parents who were shocked to learn that their
                      child’s phone cradle was actually illegal for a P-plater.
                      By taking lessons with a professional, you learn these
                      nuances before you hit the road alone. This saves you
                      money in fines and protects your driving record from the
                      very start.
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
                    Secure Your Freedom with Test Route Driving School
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral">
                    Understanding{" "}
                    <Link
                      href={`https://en.wikipedia.org/wiki/Driver%27s_licences_in_Australia`}
                      className="location-link"
                      target="_blank"
                    >
                      P-Plate Rules
                    </Link>{" "}
                    is just the beginning of your driving life. At Test Route
                    Driving School, we don't just help you pass the test; we
                    prepare you for life as a solo driver. We specialise in the
                    Kogarah area and across Sydney. Our expert instructors teach
                    you the defensive habits that keep your license safe.
                    Don&apos;t let a simple rule mistake cost you your freedom.
                    Let&apos;s build your confidence and knowledge together.
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
