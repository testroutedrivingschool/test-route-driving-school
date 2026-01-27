import Link from "next/link";
import Image from "next/image";
import highwayPackageImg from "@/app/assets/highway-package-test-route-driving-school.jpg";
import {FaCheckCircle} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import ServicePackages from "../components/ServicePackages";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
export const metadata = {
  title: "Highway Driving Lessons in Sydney suburbs| Safe & Confident Driving",
  description:
    "Learn highway driving safely – Join Highway Driving Lessons in Sydney suburbs. Flexible lessons for beginners & P-platers. Book your lesson today!",
  keywords: [
    "Highway Driving Lessons in Sydney suburbs",
    "Highway driving instructor near me",
    "Best driving instructor in Sydney suburbs",
    "Professional driving lessons Sydney suburbs",
    "Driving instructor Sydney suburbs",
    "Highway Driving Lessons in Sydney suburbs",
    "Driving training Sydney suburbs",
    "Driving lessons near Sydney suburbs",
    "Advanced driving lessons Sydney suburbs",
    "Highway driving instructor near me",
    "Highway driving lessons near me",
  ],
};

const automaticDrivingPackages = [
  {
    id: 1,
    title: "Highway Package 1",
    description:
      "Parking can be one of the most challenging skills for new drivers to master, but with the right guidance and practice, you can build the confidence needed to park safely and efficiently in any situation.",
    price: "220",
    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Book Now",
  },
  {
    id: 2,
    title: "Highway Package 2",
    description:
      "Parking can be one of the most challenging skills for new drivers to master, but with the right guidance and practice, you can build the confidence needed to park safely and efficiently in any situation.",
    price: "255",
    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Book Now",
  },
];
const features = [
  <>
    <strong>Hazard Perception:</strong>Scan further ahead to react to dangers at
    high speeds.
  </>,
  <>
    <strong>Lane Discipline:</strong>Stay in the correct lane and use signals
    properly every time.
  </>,
  <>
    <strong>Safe Merging:</strong>Learn to enter highways by matching the speed
    of traffic.
  </>,
  <>
    <strong>Smart Overtaking:</strong> Learn how to pass vehicles safely without
    tailgating or cutting them off.
  </>,
  <>
    <strong>Speed Control: </strong>Maintain a steady and safe pace in various
    weather conditions.
  </>,
];
const whyChoosePoints = [
  {
    title: "Expert Driving Instructors",
    description: " Our trainers ensure you learn safe and efficient skills.",
  },
  {
    title: "Comprehensive Training",
    description: (
      <>We offer practical and theoretical lessons for real-world driving.</>
    ),
  },
  {
    title: "License Assistance",
    description:
      "We simplify and streamline the application process to make it hassle-free.",
  },
  {
    title: "Modern Vehicles",
    description: "Learn in well-maintained, safe cars for a smooth experience.",
  },
  {
    title: "Flexible Timing",
    description:
      "Choose schedules that fit your routine in Carlton or Kogarah.",
  },
];

const faqs = [
  {
    question: "How many lessons do I need to pass my driving test?",
    answer: (
      <>
        The number of lessons varies for every learner we teach in Kogarah. On
        average, most students require between 5 and 10 professional lessons.
        This depends on your current experience, confidence, and basic
        <a
          target="_blank"
          href={`https://drivinglessons.site/blog/lessons-hours-pass-driving-test/`}
          className="font-semibold underline px-1"
        >
          driving skills.
        </a>
      </>
    ),
  },
  {
    question: "Do you provide pickup and drop-off for lessons?",
    answer: (
      <>
        Yes, we offer convenient pickup and drop-off from your preferred
        location. This includes your home, school, or workplace within our
        service area. We serve all Sydney suburbs to make your learning
        experience easy.
      </>
    ),
  },
  {
    question: "Which suburbs do your instructors cover?",
    answer: (
      <>
        Our instructors cover Kogarah, Hurstville, Rockdale, Bexley, Carlton,
        and Arncliffe. We are familiar with the local highway entry points and
        exit routes.
      </>
    ),
  },
  {
    question: "What type of car will I learn in?",
    answer: (
      <>
        You will learn in a modern automatic vehicle with dual controls. These
        cars ensure maximum safety while you practice on high-speed roads.
      </>
    ),
  },
  {
    question: "Can I book lessons online?",
    answer: (
      <>
        Yes! You can book your Highway driving lessons near me online at any
        time. Visit our website and fill out the booking form to get started.
      </>
    ),
  },
];
export default function HighwayPackage() {
  return (
    <div className="">
      <PageHeroSection
        title={`Highway Driving Lessons in Sydney suburbs | Safe & Confident Driving`}
        subtitle={`
Test Route Driving School offers premium Highway Driving Lessons in Sydney suburbs for all learners. We offer experienced instructors and affordable car lessons for all skill levels. If you need a Highway driving instructor near me, look no further than us. We are the top-rated school for test-prep and refresher courses in the area. Our team focuses on building your confidence on busy NSW motorways. You will learn to handle high speeds safely with our expert guidance. We ensure you feel prepared for any long-distance journey.
`}
      />

      {/* Main Content Section */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={highwayPackageImg}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Parking Package with Test Route Driving School"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Highway Driving Lessons in Sydney suburbs
                <span className="pl-2 inline-block text-primary">
                  Package Details
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Driving on a highway requires a new level of total confidence.
                While city driving focuses on traffic, highways build your speed
                management skills. Our Highway Driving Lessons in Sydney suburbs
                help you master merging and overtaking safely. We offer the Best
                driving instructor in Sydney suburbs to lead your training
                sessions. You will learn to maintain focus during long-distance
                drives across the Sydney suburbs . Our lessons are perfect for
                those seeking Professional driving lessons in Sydney suburbs at
                great prices. We help you transition from quiet streets to
                fast-moving motorway traffic seamlessly.
              </p>
              <h3 className="text-lg font-semibold mb-6">
                Why Highway Driving Lessons in Sydney suburbs Are Important
              </h3>
              <p className="text-neutral leading-relaxed ">
                Mastering the highway is essential for every safe driver in
                Australia. Our Highway Driving Lessons in Sydney suburbs cover
                these vital safety skills:
              </p>
              {/* Key Features */}
              <div className="mt-4  space-y-4 mb-8">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-green-500 text-sm" />
                    </div>
                    <span className="text-neutral">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Link href="/packages" className="group">
                  <PrimaryBtn className="px-8 py-3 text-lg font-semibold group-hover:scale-105 transition-transform">
                    Book Highway Package
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </PrimaryBtn>
                </Link>

                <Link href="/instructors" className="group">
                  <OutlineBtn className="py-3! px-8! border-2!">
                    Meet Our Instructors
                  </OutlineBtn>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-12 bg-primary/80 text-white">
        <Container>
          <h3 className="text-lg md:text-2xl font-semibold">
            Who Needs Highway Driving Lessons in Kogarah?
          </h3>
          <p className="mt-2 text-base-300">
            Many different types of drivers benefit from our
            <a
              target="_blank"
              href={`https://www.transport.nsw.gov.au/roadsafety/young-drivers/learners`}
              className="font-semibold underline px-1"
            >
              Driving lessons
            </a>{" "}
            near Kogarah.
          </p>
          <ul className="mt-2 list-disc pl-3 space-y-2">
            <li className="text-base-300 ">
              <strong>New Learners:</strong> Prepare for your P’s test with
              motorway experience.
            </li>
            <li className="text-base-300 ">
              <strong>Overseas Drivers:</strong> Adapt to the unique Australian
              road systems and signs.
            </li>
            <li className="text-base-300 ">
              <strong>Anxious Drivers:</strong> Overcome Your Fear of Fast
              Motorways with Patient Support.
            </li>
            <li className="text-base-300 ">
              <strong>Commuters:</strong> Perfect for those moving from
              Hurstville or Rockdale to the city.
            </li>
            <li className="text-base-300 ">
              <strong>Experienced Drivers: </strong>Take Advanced driving
              lessons in Sydney suburbs to sharpen your skills.
            </li>
          </ul>
          <h3 className="mt-4 text-lg md:text-2xl font-semibold">
            Prepare for Success with a Driving Instructor in Kogarah
          </h3>
          <p className="mt-2 max-w-4xl">
            Don’t leave your safety or your driving test to mere chance. With
            test route driving school, you receive the guidance needed to pass
            with flying colors. We provide a Highway driving instructor near me
            who knows local roads perfectly. Take the first step toward becoming
            a fully licensed and safe driver. Contact us today to book your
            assessment in Bexley or Arncliffe. Our team is ready to help you
            reach your driving goals quickly. You will enjoy a supportive
            environment that makes learning to drive a fun experience.
          </p>
        </Container>
      </section>

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="Highway Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured highway driving lessons designed for success."
        packages={automaticDrivingPackages}
      />
      <MovingCar />
      <WhyChooseUs
        title={`Why choose Test Route driving School in Kogarah?`}
        subTitle={`We provide professional lessons and help you obtain your Australian driving license. Here is why we are the best choice for your education:`}
        points={whyChoosePoints}
      />

      <Faq faqs={faqs} />
    </div>
  );
}
