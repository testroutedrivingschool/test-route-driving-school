import Image from "next/image";

import {
  FaCar,
  FaUserGraduate,
  FaShieldAlt,
  FaAward,
  FaUsers,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaCarSide,
  FaFileAlt,
  FaGift,
} from "react-icons/fa";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import WhatWeOffer from "../components/Home/WhatWeOffer";
import MovingCar from "@/app/shared/MovingCar";
import Faq from "@/app/shared/FaqSection";
import aboutImg from "@/app/assets/whychooseus-test-route-driving-school.jpg";
import aboutImg2 from "@/app/assets/about-img2.png";
import Link from "next/link";
import HomeMap from "@/app/shared/ui/HomeMap";

export const metadata = {
  title:
    "About Us | Test Route Driving School – Learn to Drive with Confidence",
  description:
    "Master real test routes with Test Route Driving School – experienced Sydney instructors. Start your journey today and drive with confidence.",
  keywords: [
    "Test Route Driving School",
    "driving school",
    "best driving school near me",
    "driving school near me",
    "driving instructor near me",
    "best driving school",
    "local driving school",
    "driving lessons",
    "professional driving instructor",
    "driving classes",
    "beginner driving lessons",
    "driving instructor",
    "driving lessons for beginners",
    "driving school packages",
  ],
};

const services = [
  {
    icon: <FaCar className="w-8 h-8 text-white" />,
    title: "Dual-Controlled Vehicles",
    description: (
      <>
        Our modern <strong>dual-controlled vehicles</strong> allow instructors
        to step in when needed, keeping you safe while learning essential
        driving skills. We also provide{" "}
        <Link
          className="font-semibold underline"
          href={`/services/driving-test-assessment`}
        >
          driving test assessments
        </Link>{" "}
        with detailed feedback, helping you focus on areas that need
        improvement.
      </>
    ),
  },
  {
    icon: <FaClipboardCheck className="w-8 h-8 text-white" />,
    title: "Driving Test Assessment",
    description: (
      <>
        Our certified instructors provide thorough driving assessments with
        detailed feedback. You’ll know the areas needing improvement to pass
        your test confidently.{" "}
        <Link
          href="/packages"
          className="text-primary font-semibold underline hover:text-primary-focus"
        >
          Book your assessment
        </Link>{" "}
        now to get started.
      </>
    ),
  },
  {
    icon: <FaMapMarkerAlt className="w-8 h-8 text-white" />,
    title: "Pickup and Drop-off",
    description: (
      <>
        For convenience, we offer pickup and drop-off across Kogarah, Rockdale,
        Hurstville, Arncliffe, and nearby Sydney suburbs. You can also rent a
        safe vehicle for your{" "}
        <Link
          href="/services/driving-test-package"
          className="text-primary font-semibold underline hover:text-primary-focus"
        >
          driving test
        </Link>{" "}
        , including Kia, Toyota Hybrid, and Nissan cars.
      </>
    ),
  },
  {
    icon: <FaCarSide className="w-8 h-8 text-white" />,
    title: "Car Hire for Test Day",
    description:
      "Use our modern vehicles for your driving test with our Test Day Packages. We also rent dual-controlled Kia, Toyota Hybrid, and Nissan cars, ensuring a smooth experience on test day.",
  },
  {
    icon: <FaFileAlt className="w-8 h-8 text-white" />,
    title: "Driving Test Support",
    description: (
      <>
        We provide <strong>full driving test support</strong>, including warm-up
        lessons and step-by-step guidance, ensuring you feel confident and
        prepared on test day.
      </>
    ),
  },
  {
    icon: <FaGift className="w-8 h-8 text-white" />,
    title: "Lesson Packages",
    description: (
      <>
        Our{" "}
        <Link
          href="/services/automatic-driving-lessons"
          className="text-primary font-semibold underline hover:text-primary-focus"
        >
          lesson packages
        </Link>
        —5, 10, or 20 hours—are flexible and affordable, giving you structured
        learning while saving money.
      </>
    ),
  },
];

const faqs = [
  {
    question: "Are you a certified and professional driving school in Sydney?",
    answer:
      "Yes, you learn with fully certified and experienced driving instructors.All lessons follow NSW road rules and approved training standards.Professional guidance helps you build real-world driving confidence.",
  },
  {
    question: "Why should you choose Test Route Driving School near you?",
    answer:
      "You receive personalised lessons with flexible scheduling and modern vehicles.Each session adapts to your confidence and learning pace.A calm environment helps you progress without pressure.",
  },
  {
    question: "Do you offer beginner driving lessons for nervous learners?",
    answer:
      "Yes, specialised lessons support beginners and nervous drivers.Step-by-step training builds confidence gradually.Safe practice prepares you for busy roads and traffic conditions.",
  },
  {
    question: "Do you provide pickup and drop-off for driving lessons?",
    answer:
      "Yes, free pickup and drop-off are available in selected Sydney suburbs.Lessons can start from home, work, or school.This saves time and reduces travel stress.",
  },
  {
    question: "How do your instructors help you pass the driving test?",
    answer: (
      <>
        You receive focused test preparation and professional feedback. Common
        mistakes are corrected early. Practice on real test routes improves
        success rates.
      </>
    ),
  },
];

export default function About() {
  const features = [
    {
      icon: <FaCar className="text-blue-600" />,
      title: "Modern Fleet",
      description: "Latest dual-controlled vehicles",
    },
    {
      icon: <FaUserGraduate className="text-green-600" />,
      title: "Expert Instructors",
      description: "Certified & experienced professionals",
    },
    {
      icon: <FaShieldAlt className="text-purple-600" />,
      title: "Safety First",
      description: "Defensive driving focus",
    },
    {
      icon: <FaAward className="text-yellow-600" />,
      title: "High Pass Rate",
      description: "98% first-time success",
    },
  ];

  return (
    <>
      <PageHeroSection
        title={
          "About Us | Test Route Driving School – Learn to Drive with Confidence"
        }
       subtitle={`At Test Route Driving School, we are committed to helping learners become safe, confident, and independent drivers. Our experienced Sydney instructors provide structured lessons, real test route practice, and personalised guidance tailored to your skill level. Whether you are a beginner, a nervous learner, or preparing for your NSW driving test, we focus on building lifelong driving skills through safety, patience, and professionalism. Start your journey with us and experience supportive training designed to help you succeed on the road and beyond.`}
      />
      <section className="pt-16 ">
        <Container>
          <SectionHeader
            title="About Test Route Driving School"
            subtitle="Your trusted partner in driver education since 2012"
            className="mt-0! mb-4"
          />

          <section className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 mb-12 ">
            <div className="lg:w-1/2 w-full relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={aboutImg}
                  alt="Test Route Driving School instructor with student"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  width={800}
                  height={800}
                />
              </div>

          
              <div className="absolute -bottom-4 right-0 md:-right-2 bg-white p-4 rounded-xl shadow-lg border border-border-color">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <FaUsers className="text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">2,500+</div>
                    <div className="text-sm text-neutral">
                      Confident Drivers
                    </div>
                  </div>
                </div>
              </div>
            </div>

     
            <div className="lg:w-1/2 w-full space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Learn to Drive with Confidence & Safety
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 md:text-lg leading-relaxed">
                    At
                    <Link
                      className="font-bold px-1 underline"
                      href={`/services/driving-test-assessment`}
                    >
                      {" "}
                      Test Route Driving School
                    </Link>
                    , we transform nervous beginners into confident drivers. Our
                    lessons focus on safety, skill, and awareness. You’ll enjoy
                    a stress-free, enjoyable learning experience.
                    <br />
                    We use modern{" "}
                    <Link
                      className="font-semibold underline px-1"
                      href={`/services/car-hire-for-instructor`}
                    >
                      dual-controlled vehicles
                    </Link>{" "}
                    and flexible scheduling. This allows you to learn at your
                    own pace while feeling secure. Our instructors provide
                    personalised guidance, addressing your fears and helping you
                    navigate city roads, traffic, and driving tests with ease.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Whether you are searching for the best driving school near
                    me or local driving lessons that fit your lifestyle, we make
                    learning convenient, flexible, and effective.{" "}
                    <a
                      className="location-link"
                      href={"https://www.nhtsa.gov/road-safety/teen-driving"}
                      target="_blank"
                    >
                      See more services tailored just for you.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

        
          <section className="grid grid-cols-2 gap-4 mt-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-3 p-3 bg-base-300 rounded-xl border border-border-color hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-white rounded-lg">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-neutral mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </Container>

        <section className="py-16 bg-base-300">
          <Container>
            <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-center ">
           
              <div className="flex-1 space-y-6 ">
                <h2 className="text-2xl lg:text-4xl font-bold ">
                  Professional Driving School You{" "}
                  <span className="text-primary">Can Trust</span>
                </h2>

                <p className="text-neutral md:text-lg">
                  <Link className="font-semibold underline px-1" href={`/`}>
                    Test Route Driving School
                  </Link>
                  is a leading
                  <strong>local driving school</strong> in Kogarah and
                  surrounding NSW suburbs. Our experienced instructors
                  specialise in helping beginners, nervous drivers, and
                  international students gain confidence behind the wheel.
                </p>

                <p className="text-neutral md:text-lg">
                  We provide structured{" "}
                  <Link
                    className="font-semibold underline px-1"
                    href={`/services/automatic-driving-lessons`}
                  >
                    driving lessons
                  </Link>
                  covering real-world scenarios, defensive driving, and exam
                  preparation. Learning with our{" "}
                  <strong>professional driving instructors</strong> gives you
                  personalised feedback and a supportive environment.
                </p>

                <p className="text-neutral md:text-lg">
                  At <strong>Test Route Driving School</strong>, you’ll learn in
                  safe, modern vehicles, enjoy flexible{" "}
                  <strong>lesson packages</strong>, and gain the confidence to
                  pass your test the first time. Our step-by-step guidance
                  ensures you develop lifelong driving skills with a trusted,
                  experienced instructor.
                </p>
              </div>

            
              <div className="flex-1">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src={aboutImg2}
                    alt="Professional driving lessons at Test Route Driving School"
                    className="w-full h-full object-cover"
                    width={1000}
                    height={1000}
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <WhatWeOffer
          services={services}
          sectionSubtitle="We offer services that make learning to drive comfortable, safe, and convenient. Each lesson is designed to build your confidence and practical skills."
          extra={
            <p className="text-sm text-neutral mt-6">
              With these services,{" "}
              <Link className="font-semibold underline px-1" href={`/`}>
                Test Route Driving School
              </Link>{" "}
              stands out as a professional driving school offering practical,
              comprehensive lessons for every{" "}
              <a
                className="location-link"
                href={"https://en.wikipedia.org/wiki/Driver%27s_education"}
                target="_blank"
              >
                learner.
              </a>
            </p>
          }
        />

        <MovingCar className="mt-20 md:mt-25" />
        <Faq faqs={faqs} />
        <HomeMap/>
      </section>
    </>
  );
}
