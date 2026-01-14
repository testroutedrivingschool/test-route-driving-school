import Link from "next/link";
import Image from "next/image";
import nightDrivingLessonImg from "@/app/assets/night-driving-test-route-driving-school.jpg";
import {
  FaAward,
  FaBrain,
  FaCalendarAlt,
  FaCar,
  FaChartLine,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import ServicePackages from "../components/ServicePackages";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
import nightDrivingImg from "@/app/assets/local-driving-lesson-test-route-driving-school.png";
export const metadata = {
  title:
    "Night Driving Lessons in Sydney suburbsfor Beginners & Nervous Drivers",
  description:
    "Master the road with expert Night Driving Lessons in Kogarah. Gain confidence after dark with patient instructors and flexible packages. Book your first lesson now!",
  keywords: [
    "Night Driving Lessons in Sydney suburbs",
    "local night driving lessons Sydney suburbs",
    "night driving classes near Sydney suburbs",
    "driving school in Sydney suburbsat night",
    "night driving lessons near me",
    "night driving instructor Sydney suburbs",
    "night time driving lessons near me",
    "driving lessons at night Sydney suburbs",
  ],
};

const automaticDrivingPackages = [
  {
    id: 1,
    title: "1 Hour Lesson",
    description: "1 x 60 min Driving  Lesson ",
    price: "75",
    duration: "1 x 60 min lesson",
    buttonText: "Book 1 Hour Lesson",
  },
  {
    id: 2,
    title: "5 Hour Lesson Pack",
    description: "5 x 60 min Driving Lesson",
    price: "365",
    duration: "5 x 60 min lessons",
    buttonText: "Buy 5 Hours Pack",
  },
  {
    id: 3,
    title: "10 Hour Pack",
    description: "10 x 60min Driving Lesson",
    price: "700",
    duration: "10 x 60 min lessons",
    buttonText: "Buy 10 Hours Pack",
  },
  {
    id: 4,
    title: "20 Hour Pack",
    description: "20 x 60min Driving Lesson",
    price: "1360",
    duration: "20 x 60 min lessons",
    buttonText: "Buy 20 Hours",
  },
];
const features = [
  <>
    <strong>Low Visibility:</strong>
    You learn to use your headlights effectively for better sight.
  </>,
  <>
    <strong>Wet Roads:</strong>
    We teach you how to spot slippery patches during winter nights.
  </>,
  <>
    <strong>Hazard Detection:</strong>
    You will improve your reaction times for spotting pedestrians crossing the
    road.
  </>,
  <>
    <strong>Visual Cues:</strong>
    Our experts demonstrate how to locate markers when the signs are difficult
    to read.
  </>,
];
const whyChoosePoints = [
  {
    title: "Expert Driving Instructors",
    description:
      " Our trainers teach you safe and efficient night driving habits.",
  },
  {
    title: "Comprehensive Training",
    description: (
      <>
        We combine theory with practical
        <Link href={`/faq`} className="px-1 font-semibold underline">
          experience to achieve better results. Frequently Asked Questions About
          Driving Lessons.
        </Link>
      </>
    ),
  },
  {
    title: "License Assistance",
    description:
      " We guide you through the application process to make it easy.",
  },
  {
    title: "Modern Vehicles",
    description: "You will learn in well-maintained cars with dual controls.",
  },
  {
    title: "Flexible Timing",
    description: "Choose a schedule that fits your work or study routine.",
  },
];

const faqs = [
  {
    question: "How many nighttime driving lessons do I need near me?",
    answer: (
      <>
        The number of sessions depends on your current confidence and
        experience. On average, most students require 5 to 10 lessons to feel
        fully safe. We assess your skills during the first session in the Sydney
        Suburbs.
      </>
    ),
  },
  {
    question: "Do you provide pickup for driving lessons at night in Kogarah?",
    answer: (
      <>
        Yes, we offer convenient pickup and drop-off from your home or
        workplace. We serve a wide range of areas, including Allawah, Arncliffe,
        Bexley, Rockdale, Hurstville, and Kogarah. For more details, please
        refer to the
        <Link href={`/area-covered`} className="font-semibold underline px-1">
          Areas We Cover page.
        </Link>
      </>
    ),
  },
  {
    question: "What car will I use for my night driving lessons near me?",
    answer: (
      <>
      You will drive a modern automatic vehicle equipped with dual safety controls. This ensures your instructor can assist you if any dangerous situation arises. Safety is our main priority for every student in the Sydney Suburbs.
      </>
    ),
  },
  {
    question: "Can I book my driving lessons online?",
    answer: (
      <>
        Yes, you can easily book your sessions through our website at any time. Visit our Blog for more tips or use the booking form. We make the process simple so you can start learning immediately.
      </>
    ),
  },
];
export default function NightDrivingLesson() {
  return (
    <div className="">
      <PageHeroSection
        title={`Night Driving Lessons in Sydney suburbsfor Beginners & Nervous Drivers`}
        subtitle={`
This guide explores the best Night Driving Lessons in Sydney suburbsfor all learners. You will discover how to handle low visibility and bright glares safely. Our expert instructors provide personalized coaching to boost your road confidence after dark. We cover essential safety tips and local test routes in the Sydney Suburbs. Start your journey to becoming a fearless night driver with our professional team today.
`}
      />

      {/* Main Content Section */}
      <section className=" py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={nightDrivingLessonImg}
                  className="w-full h-120 object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Night Driving Lesson with Test Route Driving School"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Gain Confidence with Night Driving Lessons in Sydney suburbs
                <span className="pl-2 inline-block text-primary">
                  After Dark
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Do you feel nervous driving when the streetlights turn on? You
                are certainly not alone in feeling this way. Many Sydney drivers
                struggle with heavy glare from oncoming high-beam headlights.
                You might find unfamiliar roads in Sydney suburbsmuch harder to
                navigate at night. We offer a{" "}
                <Link
                  href={`/packages`}
                  className="font-semibold underline px-1"
                >
                  Find Your Perfect Driving Package
                </Link>{" "}
                to address these specific concerns for you. Why do these
                specialized sessions matter for your growth as a driver?
              </p>
              <h3 className="font-semibold mt-4 text-lg">
                Why Night Driving Lessons Matter
              </h3>
              {/* Key Features */}
              <div className="mt-4 space-y-4 mb-8">
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/packages" className="group">
                  <PrimaryBtn className="px-8 py-3 text-lg font-semibold group-hover:scale-105 transition-transform">
                    Book Your Night Lesson
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

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="Night Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured Night driving lessons designed for success."
        packages={automaticDrivingPackages}
      />

      <section className="py-20 bg-white">
        <Container>
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            {/* Left Text Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Affordable Night Driving Lessons in Sydney suburbsand
                <span className="text-primary px-1">Sydney, NSW</span>
              </h2>

              <p className="text-neutral text-lg leading-relaxed">
                Are you looking for reliable local night driving lessons in
                Sydney suburbsthat you can trust? We offer both automatic and
                manual sessions tailored for every beginner driver. Our
                certified instructors focus on road safety and smooth vehicle
                control. You can master city streets, tight parking, and highway
                merging in Rockdale. We ensure your learning experience is
                stress-free and highly productive. Do you need to prepare for a
                specific test route in Hurstville? We have the{" "}
                <Link
                  href={`/company/resources`}
                  className="font-semibold underline px-1"
                >
                  Resources
                </Link>{" "}
                and local knowledge to guide you through every turn. Our
                structured programs provide everything you need to become a
                truly independent driver.
              </p>

              <p className="text-neutral text-lg leading-relaxed">
                Whether you want to master city streets, highway driving, or
                parking techniques, our structured driving programs in provide
                everything you need to become a safe and confident driver.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <PrimaryBtn>Book a Lesson</PrimaryBtn>
                <OutlineBtn>Learn More</OutlineBtn>
              </div>
            </div>

            {/* Right Image */}
            <div className=" rounded-xl w-full md:w-auto md:flex-1 flex justify-center">
              <Image
                src={nightDrivingImg}
                width={1000}
                height={1000}
                alt="Night Driving Package Test Route Driving School"
                className="object-cover w-full h-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </Container>
      </section>
      <section className="mt-5 py-12 bg-primary/10">
        <Container>
          <div className="space-y-4">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get Ready with a Night Driving Instructor Sydney suburbsExpert
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  Learning to drive at night is challenging without the right
                  professional guidance. With a dedicated night driving
                  instructor from our team, you receive personal care. We tailor
                  every lesson to your current skill level and comfort. Whether
                  you are a total beginner or an advanced learner, we&apos;re
                  here to help you. Our lessons cover vital traffic rules and
                  hazard perception skills in Bexley. You will practice scanning
                  the road for animals or unlit cyclists. We focus on preparing
                  you for real-world driving situations. Our goal is to turn
                  your hesitation into expert{" "}
                  <Link
                    href={`/about`}
                    className="font-semibold underline px-1"
                  >
                    precision in About Test Route Driving School.
                  </Link>
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pre-Test Assessment and Night Driving Classes Near Kogarah
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  We understand that every learner has a unique and busy
                  schedule. That is why we offer night driving classes near
                  Sydney suburbsduring flexible hours. You can book sessions on
                  evenings or weekends to fit your lifestyle.{" "}
                  <Link
                    href={`/instructors`}
                    className="font-semibold underline px-1"
                  >
                    Our Instructors
                  </Link>{" "}
                  create custom plans based on your specific strengths. We give
                  you consistent feedback to help you improve your steering and
                  braking. Are you a busy professional in Carlton or a student
                  in Arncliffe? We accommodate your needs while maintaining the
                  highest safety standards on the road. By the end of our
                  course, you will handle night traffic with ease.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs
        title={`Why Choose Our Driving School in Sydney suburbsat Night?`}
        subTitle={`We provide the best driving school in Sydney suburbsat night for several reasons. You deserve an education that prioritizes both your safety and success in obtaining a license.`}
        points={whyChoosePoints}
      />

      <Faq faqs={faqs} title={"Frequently Asked Questions About Night Time Driving Lessons Near Me"}/>
    </div>
  );
}
