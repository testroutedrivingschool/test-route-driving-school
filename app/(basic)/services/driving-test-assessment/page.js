import Link from "next/link";
import Image from "next/image";
import automaticLessonImg from "@/app/assets/service-lesson-test-route-driving-school.png";
import {FaCheckCircle} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import MovingCar from "@/app/shared/MovingCar";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import ServicePackages from "../components/ServicePackages";
import Faq from "@/app/shared/FaqSection";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import localDrivingImg from "@/app/assets/local-driving-lesson-test-route-driving-school.png";
import HomeMap from "@/app/shared/ui/HomeMap";
export const metadata = {
  title: "Driving Test Assessment in Sydney suburbs| Book Online Now",
  description:
    "Master the road with an expert Driving Test Assessment in Kogarah. We offer mock tests and local route practice to ensure you pass. Book your assessment online now!",
  keywords: [
    "Driving Test Assessment  in Sydney suburbs",
    "Driving test practice Sydney suburbs",
    "Driving assessment near Sydney suburbs",
    "Sydney suburbsdriving test assessment",
    "Driving test Sydney suburbs",
    "Driving test assessment Sydney suburbs",
    "Driving Test Assessment  in Sydney suburbs",
    "Driving test assessment near Sydney suburbs",
    "Driving test preparation Sydney suburbs",
    "Pre driving test assessment Sydney suburbs",
    "Driving test routes Sydney suburbs",
  ],
};
const automaticDrivingPackages = [
  {
     _id: "695be1371f72e6c2fa81e094",
    name: "1 hour 30 mins Driving Test Assessment",
    packageThumbline: "/pkg.png",
    duration: "1 hr 30 min",
    price: 140,
    originalPrice: "$170",
   
  
    features: ["Pick Up and Drop Off from Your Location", "One Driving Test Assessment from the RMS Driving Test Center", "Test Assessment Report at the End of the Session","Access to our tutorial videos and training materials","Warm Up Lesson"],
    buttonText: "Buy 1 hr 30 min Assessment Package",
    popular: false,
  },
  {
     _id: "695beb281f72e6c2fa81e097",
    name: "2 Hours Driving Test Assessment",
    packageThumbline: "/pkg.png",
    duration: "2 hr",
    price: 175,
    originalPrice: "$200",
   
  
    features: ["Pick Up and Drop Off from Your Location", "Two Driving Test Assessments from the RMS Driving Test Center", "Test Assessment Report at the End of the Session","Access to our tutorial videos and training materials","Warm Up Lesson"],
    buttonText: "Buy 2 hr Assessment Package",
    popular: false,
  },
 
];
const features = [
  <>
    <strong>Door-to-Door Service:</strong>
    We offer pickup and drop-off from your location.
  </>,
  <>
    <strong>Realistic Simulation:</strong>
    Get a driving assessment near Sydney suburbs from the local RMS centre.
  </>,
  <>
    <strong>Detailed Feedback:</strong>
    Receive a comprehensive test assessment report upon completion.
  </>,
  <>
    <strong>Expert Insight:</strong>
    Learn from instructors who know every{" "}
    <strong>Sydney suburb&apos;s driving test assessment</strong> detail.
  </>,
];
const whyChoosePoints = [
  {
    title: "Expert Driving Instructors",
    description: "Our trainers teach safe and efficient driving skills.",
  },
  {
    title: "Comprehensive Training",
    description: <>We prepare you for both the test and life.</>,
  },
  {
    title: "License Assistance",
    description: "We simplify and streamline the application process for you.",
  },
  {
    title: "Modern Vehicles",
    description: "You will learn in well-maintained cars with dual controls.",
  },
  {
    title: "Flexible Timing",
    description:
      "You can select schedules that perfectly fit your daily routine.",
  },
];

const faqs = [
  {
    question: "What is evaluated during a driving test assessment session?",
    answer: (
      <>
        Assessments measure observation, signalling, and lane discipline. Speed
        control and hazard response are reviewed. Parking accuracy is closely
        analysed.
      </>
    ),
  },
  {
    question: "How accurate is the assessment compared to the real NSW test?",
    answer: (
      <>
        Sessions follow official RMS testing procedures. Scoring reflects
        examiner marking guidelines. Results mirror real test expectations.
      </>
    ),
  },
  {
    question: "Will you receive a written performance report after assessment?",
    answer: (
      <>
        A detailed feedback summary is provided. Strengths and weaknesses are
        clearly outlined. Improvement priorities are listed.
      </>
    ),
  },
  {
    question: "Can a driving test assessment predict your chances of passing?",
    answer: (
      <>
        Instructors compare your performance with the pass benchmarks. Readiness
        levels are explained honestly. Clear recommendations are given.
      </>
    ),
  },
  {
    question: "How soon should you book an assessment before your test?",
    answer: (
      <>
        Most learners book two to three weeks early. This allows time for
        corrections. Extra practice can be scheduled if needed.
      </>
    ),
  },
];
export default function DrivingTestAssessment() {
  return (
    <div className="">
      <PageHeroSection
        title={`Driving Test Assessment in Sydney Suburbs | Book Online Now`}
        subtitle={
          <>
            At
            <Link href="/" className="location-link">
              Test Route driving School,
            </Link>
            we understand that being prepared for your exam is crucial. That is
            why we offer a top-tier{" "}
            <strong>Driving Test Assessment in Kogarah.</strong> This session
            helps you find your strengths and fix your driving weaknesses. We
            provide these assessments across the <strong>Sydney suburbs</strong>{" "}
            to boost your confidence. You will work with experts who understand
            the strict RMS testing standards. Our team guides you through every
            step of the practical driving exam process. We aim to help you pass
            your test on the first attempt.
          </>
        }
      />

      {/* Main Content Section */}
      <section className=" py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={automaticLessonImg}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Automatic Driving Lesson with Test Route Driving School"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Sydney Suburbs Driving Test Prep: Discover Your
                <span className="pl-2 inline-block text-primary">
                  Strengths and Weaknesses!
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                We believe that great preparation leads to great results on the
                road. Our{" "}
                <strong>Driving Test Assessment in Sydney suburbs</strong> is
                designed for your total success. We offer a comprehensive{" "}
                <strong>
                  driving test practice session in Sydney suburbs{" "}
                </strong>{" "}
                to simulate a real driving day. Our goal is to ensure you have
                the skills to drive safely. You will learn to handle busy
                intersections and complex roundabouts with ease. We focus on
                building your confidence through clear and helpful feedback.
              </p>
              <h3 className="text-lg font-semibold">
                Our Driving Test Assessment Packages
              </h3>
              <p className="text-neutral mt-2">
                Our packages give you the best value for your{" "}
                <strong>driving test preparation in Kogarah.</strong>
              </p>
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
                <Link href="/bookings" className="group">
                  <PrimaryBtn className="px-8 py-3 text-lg font-semibold group-hover:scale-105 transition-transform">
                    Book Your First Lesson
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
        sectionTitle="Driving Test Assessment Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured automatic driving lessons designed for success."
        packages={automaticDrivingPackages}
      />

      <section className="py-20 bg-white">
        <Container>
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            {/* Left Text Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Driving Test Assessment Lessons in
                <span className="text-primary px-2">Kogarah, NSW</span>
              </h2>

              <p className="text-neutral text-lg leading-relaxed">
                Are you looking for a reliable{" "}
                <strong>Driving Test Assessment in Kogarah</strong>? At{" "}
                <strong>Test Route Driving School</strong>, we offer both
                automatic and manual driving lessons. Our certified instructors
                focus on road safety and practical skills for every learner.
                Whether you are a beginner or a seasoned professional, our
                programs are tailored to meet your needs. We help you master
                residential streets, highway driving, and difficult parking
                techniques. You can book a{" "}
                <strong>pre-driving test assessment in Sydney suburbs</strong>{" "}
                to polish your skills. We ensure a smooth learning experience
                for students in Sydney suburbs and Bexley.
              </p>

              <p className="text-neutral text-lg leading-relaxed">
                Whether you want to master city streets, highway driving, or
                parking techniques, our structured driving programs in provide
                everything you need to become a safe and confident driver.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link href={"/bookings"}>
                
                <PrimaryBtn>Book a Test Assessment</PrimaryBtn>
                </Link>
                   <Link href={"/packages"}>
                <OutlineBtn>Learn More</OutlineBtn>
                   </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="rounded-xl w-full md:w-full md:flex-1 flex-1 flex justify-center">
              <Image
                src={localDrivingImg}
                width={500}
                height={500}
                alt="Local Driving Lesson Test Route Driving School"
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
                  Get Ready to Pass Your Driving Test with Expert Assessment
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  Learning to drive can be challenging, but our experts make it
                  easier. With a Driving Test Assessment in Kogarah, you get
                  personalized guidance for your level. We cover both practical
                  skills and important theoretical road rules. Our lessons focus
                  on hazard perception and safe traffic responses. You will
                  learn the specific{" "}
                  <strong>driving test routes Sydney suburbs</strong> examiners
                  often use. This local knowledge gives you a massive advantage
                  on your big day. We help you refine advanced techniques to
                  ensure you are a safe driver.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pre-Driving Test Assessment Lessons for Learner Drivers in
                  Kogarah
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  Every learner has a unique schedule and a different learning
                  pace. We offer flexible{" "}
                  <strong>Driving Test Assessments in Sydney suburbs</strong> at
                  various timings, including weekends. This helps busy students
                  and professionals in <strong>Hurstville</strong> and{" "}
                  <strong>Rockdale</strong> stay on track. Our instructors
                  create custom plans based on your specific areas for
                  improvement. You will receive consistent feedback to help you
                  advance your skills quickly. By the end, you will be ready for
                  the <strong>driving test in Sydney suburbs</strong> with ease.
                  We prepare you for real-world scenarios, not just the test
                  itself.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs
        title={`Why Choose Test Route driving school?`}
        points={whyChoosePoints}
      />

      <Faq faqs={faqs} />
          <HomeMap/>
    </div>
  );
}
