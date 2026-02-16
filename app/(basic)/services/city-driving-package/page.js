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
  title:
    "City Driving Class in Sydney suburbs| Book Professional Driving Lessons Today",
  description:
    "Master urban roads with our City Driving Class in Sydney suburbs. Get expert guidance and flexible lesson packages to pass your test fast. Book your first lesson online!",
  keywords: [
    "City Driving Class in Sydney suburbs",
    "Best driving school in Sydney suburbs",
    "Learn city driving in Sydney suburbs",
    "City driving lessons near Sydney suburbs",
    "Professional driving instructor Sydney suburbs",
    "Driving school Sydney suburbs",
    "Driving lessons in Sydney suburbs",
    "City driving class Sydney suburbs",
    "City driving lessons Sydney suburbs",
  ],
};
const cityCarDrivingPackages = [
  {
    id: 1,
    title: "City Driving Package 1",
    description:
      "Driving in the city can be one of the most challenging aspects of learning to drive, with constant traffic, unpredictable pedestrians, tight spaces, and frequent stop-and-go conditions. Our City Driving lesson is designed specifically for learner drivers who want to build confidence and competence navigating busy urban environments.",
    price: "250",
    buttonText: "Book Now",
  },
  {
    id: 2,
    title: "City Driving Package 2",
    description:
      "Driving in the city can be one of the most challenging aspects of learning to drive, with constant traffic, unpredictable pedestrians, tight spaces, and frequent stop-and-go conditions. Our City Driving lesson is designed specifically for learner drivers who want to build confidence and competence navigating busy urban environments.",
    price: "270",
    buttonText: "Book Now",
  },
];
const features = [
  <>
    <strong>Flexible Scheduling: </strong>We offer easy pickup and drop-off from
    your home.
  </>,
  <>
    <strong>Modern Fleet: </strong>You will use automatic vehicles with dual
    controls.
  </>,
  <>
    <strong>Top Safety: </strong>Our cars boast 5-Star ANCAP ratings for your
    peace of mind.
  </>,
  <>
    <strong>Fast Progress:</strong>You receive personalized feedback to
    accelerate your learning and development.
  </>,
  <>
    <strong>Expert Guidance:</strong> Learn city driving in Sydney suburbs with
    local professionals.
  </>,
];
const whyChoosePoints = [
  {
    title: "Expert Driving Instructors",
    description: " Our trainers teach safe and efficient driving skills.",
  },
  {
    title: "Comprehensive Training",
    description: (
      <>We offer practical and theoretical lessons for real success.</>
    ),
  },
  {
    title: "License Assistance",
    description:
      "We simplify and streamline the application process to make it hassle-free.",
  },
  {
    title: "Modern Vehicles",
    description: (
      <>
        <a
          className="location-link"
          href={
            "https://www.rateddriving.com/learner-driver/how-many-driving-lessons-do-i-need-to-pass/"
          }
          target="_blank"
          rel="noreferrer"
        >
          Learn
        </a>{" "}
        in well-maintained cars for a smooth experience.
      </>
    ),
  },
  {
    title: "Flexible Timing",
    description: " Choose schedules that fit your busy daily routine.",
  },
  {
    title: "Professional Support:",
    description:
      "Work with a top professional driving instructor in Sydney suburbs.",
  },
];

const faqs = [
  {
    question: "What urban driving skills are taught in city driving classes?",
    answer: (
      <>
        Training covers intersections, roundabouts, and lane filtering. Traffic
        signal timing is explained clearly. Road positioning is practised daily.
      </>
    ),
  },
  {
    question: "How do city driving lessons improve awareness in busy areas?",
    answer: (
      <>
        Learners practise multi-directional scanning techniques. Pedestrian and
        cyclist detection is emphasised. Blind-spot checks become automatic.
      </>
    ),
  },
  {
    question: "Will you learn how to handle peak-hour traffic conditions?",
    answer: (
      <>
        Lessons include morning and evening traffic sessions. Stop-start driving
        is practised safely. Patience and spacing control improve.
      </>
    ),
  },
  {
    question: "Are city driving classes helpful for navigating narrow streets?",
    answer: (
      <>
        Training includes tight-lane positioning exercises. Kerb clearance
        techniques are taught. Mirror usage is refined.
      </>
    ),
  },
  {
    question: "Can city driving lessons help reduce mistakes at intersections?",
    answer: (
      <>
        Right-of-way rules are practised repeatedly. Gap selection skills are
        developed. Decision timing improves steadily.
      </>
    ),
  },
];
export default function CityCarDrivingPackage() {
  return (
    <div className="">
      <PageHeroSection
        title={`City Driving Class in Sydney suburbs | Book Professional Driving Lessons Today`}
        subtitle={
          <>
            At
            <Link href="/" className="location-link">
              Test Route Driving School,
            </Link>
            we offer expert City Driving Classes in Sydney suburbs. We help
            learners of all skill levels become safe drivers. Our team offers
            top-tier automatic driving lessons across the local area. You will
            acquire the skills necessary to navigate dense urban traffic. We
            prioritize your safety and build your road confidence every day. Our
            instructors understand the unique challenges of the local Sydney
            suburbs streets. You can trust us to guide you toward driving
            success. We focus on making you a responsible and aware driver.
          </>
        }
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
                City Car Driving Lesson Package in
                <span className="pl-2 inline-block text-primary">
                  Sydney suburbs
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Our City Driving Class in Sydney suburbs helps you pass your
                test easily. We tailor every session to suit your individual
                learning needs. This ensures you are well-prepared for the
                real-world driving environment. Our certified instructors
                encourage you to be considerate on the road. Safety remains the
                number one priority in all our lessons. You will learn to
                practice safe driving habits for the rest of your life. We offer
                the best driving school experience in Sydney suburbs for new
                learners. Our goal is to help you pass on your first go.
              </p>
              <h3 className="text-lg font-semibold">Package Included:</h3>
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
                    Book The Package
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
          <h3 className="text-lg md:text-2xl font-semibold mb-4">
            Why Choose Test Route driving School for Your City Driving Class in
            Sydney suburbs?
          </h3>
          <p>
            We offer professional driving lessons in the city, near Sydney
            suburbs, and provide license assistance. Here is why we are the best
            choice for your education:
          </p>
          <ul className="mt-4 list-disc pl-3 space-y-2">
            <li className="text-base-300 ">
              <strong>Flexible Scheduling:</strong> We offer easy pickup and
              drop-off from your home.
            </li>
            <li className="text-base-300 ">
              <strong>Modern Fleet: </strong>You will use automatic vehicles
              with dual controls.
            </li>
            <li className="text-base-300 ">
              <strong>Top Safety: </strong>Our cars boast 5-Star ANCAP ratings
              for your peace of mind.
            </li>
            <li className="text-base-300 ">
              <strong>Fast Progress:</strong>You receive personalized feedback
              to accelerate your learning and development.
            </li>
            <li className="text-base-300 ">
              <strong>Expert Guidance:</strong>Learn city driving in Sydney
              suburbs with local professionals.
            </li>
          </ul>
          <h3 className="mt-4 text-lg md:text-2xl font-semibold">
            Prepare for Success
          </h3>
          <p className="mt-2 max-w-4xl">
            Don’t leave your driving test to chance. With{" "}
            <strong>Test Route Driving School</strong>, you’ll receive the
            professional support and guidance you need to pass your test with
            confidence. Alongside our test preparation lessons, we also offer a
            dedicated
            <Link
              href="/services/highway-driving-package"
              className="font-semibold underline  hover:text-primary-focus px-1"
            >
              highway driving package
            </Link>
            to help you master high-speed roads, lane discipline, and safe
            overtaking techniques. Contact us today to book your driving test
            assessment and take the first step towards becoming a licensed
            driver.
          </p>
        </Container>
      </section>

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="City Car Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured City Car driving lessons designed for success."
        packages={cityCarDrivingPackages}
      />
      <MovingCar />
      <WhyChooseUs
        points={whyChoosePoints}
        title={`Why Choose Test Route driving School for Your City Driving Class in Sydney suburbs?`}
        subtitle={`We offer professional driving lessons in the city, near Sydney suburbs, and provide license assistance. Here is why we are the best choice for your education:`}
      />

      <Faq faqs={faqs} />
    </div>
  );
}
