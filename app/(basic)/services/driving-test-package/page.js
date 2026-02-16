import Link from "next/link";
import Image from "next/image";
import automaticLessonImg from "@/app/assets/service-lesson-test-route-driving-school.png";
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
import localDrivingImg from "@/app/assets/local-driving-lesson-test-route-driving-school.png";
export const metadata = {
  title:
    "Driving Test Package in Sydney suburbs| Pass Your Test with Confidence",
  description:
    "Pass your exam with our Driving Test Package in Sydney suburbs. Get expert prep, a warm-up lesson, and car hire to boost your confidence. Book your test day success now!",
  keywords: [
    "Driving Test Package in Sydney suburbs",
    "Driving test preparation Sydney suburbs",
    "Driving test service Sydney suburbs",
    "Driving test car hire Sydney suburbs",
    "Sydney suburbsdriving test package",
    "Driving test package Sydney suburbs",
    "Driving lessons Sydney suburbs",
    "Driving school Sydney suburbs",
    "Driving test car Sydney suburbs",
    "Driving test car hire near Sydney suburbs",
  ],
};

const features = [
  <>Convenient pickup and drop-off services.</>,
  <>
    A professional <strong>Driving test preparation Sydney suburbs</strong>
    warm-up lesson.
  </>,
  <>
    Reliable <strong>Driving test car hire in Sydney suburbs </strong> for the
    test duration.
  </>,
  <>A 1-hour lesson before your test day in our Full Test Package.</>,
];
const automaticDrivingPackages = [
  {
    id: 1,
    title: "Test Day Pack",
    description: "1 x 60 min Warm up Lesson on test day",
    price: "220",
    duration: "1 x 60 min lesson",
    features: [
      "Pick up and drop off",
      "Warm up lesson",
      "Car hire for duration of test",
      "1 hour lesson prior to your test day in our Full Test Package",
    ],
    buttonText: "Book Now",
  },
  {
    id: 2,
    title: "Full Test Pack",
    description: "2 x 60 min Warm up Lesson on test day",
    price: "290",
    duration: "2 x 60 min lessons",
    features: [
      "Pick up and drop off",
      "Warm up lesson",
      "Car hire for duration of test",
      "1 hour lesson prior to your test day in our Full Test Package",
    ],
    buttonText: "Book Now",
  },
];

const whyChoosePoints = [
  {
    title: "Expert Driving Instructors",
    description: " Our trainers ensure you learn safe and efficient skills.",
  },
  {
    title: "Comprehensive Training",
    description: (
      <>
        We provide practical and theoretical lessons that apply to real-world
        scenarios.
      </>
    ),
  },
  {
    title: "License Assistance",
    description:
      "We help you through the application process to keep it hassle-free.",
  },
  {
    title: "Modern Vehicles",
    description:
      " Learn in well-maintained cars for a smooth and safe experience.",
  },
  {
    title: "Flexible Timing",
    description:
      "Select schedules that accommodate your routine, including school or work commitments",
  },
  {
    title: "Local Knowledge",
    description: (
      <>
        We know the best routes in
        <strong>Hurstville, Rockdale, and Bexley.</strong>
      </>
    ),
  },
];

const faqs = [
  {
    question: "What happens during the warm-up lesson before your driving test?",
    answer: (
      <>
       The session reviews key test manoeuvres and routes.
 Instructors correct last-minute mistakes.
 Confidence improves before meeting the examiner.

      </>
    ),
  },
  {
    question: "How does this driving test package reduce exam-day nerves?",
    answer: (
      <>
       Lessons simulate real testing conditions.
 Instructors teach breathing and focus techniques.
 Familiar routes reduce unexpected pressure.

      </>
    ),
  },
  {
    question: "Will you practise on the same roads used for NSW driving tests?",
    answer: (
      <>
        Training includes common local testing areas.
 Routes near service centres are regularly practised.
 Learners become comfortable with traffic patterns.

      </>
    ),
  },
  {
    question: "What vehicle standards apply to test day car hire?",
    answer: (
      <>
        Cars meet NSW testing safety requirements.
 Dual controls remain fully functional.
 Vehicles are cleaned and inspected before use
      </>
    ),
  },
  {
    question: "How does instructor support continue during your driving test?",
    answer: (
      <>
        Instructors provide final guidance before the exam.
 Key reminders are given at departure.
 Support remains available immediately after testing.

      </>
    ),
  },
];
export default function DrivingTestPackage() {
  return (
    <div className="">
      <PageHeroSection
        title={`Secure Your Driving Test Package in Sydney suburbs`}
        subtitle={
          <>
            Prepare for your driving test with total confidence today. Our
            comprehensive
            <strong>Driving Test Package in Sydney suburbs</strong>includes
            expert instruction and practical assessments. You get personalized
            guidance to help you pass your exam with ease. We understand how
            nervous you might feel about the local traffic. Our team prepares
            you for every turn and intersection in the area. You will learn to
            manage your speed and position perfectly. This package ensures you
            meet all
            <Link
              href={`/company/resources`}
              className="font-semibold underline px-1"
            >
              NSW licensing requirements
            </Link>{" "}
            before you start. We focus on low-risk driving habits that impress
            every testing officer.
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
                Let us help you on your
                <span className="pl-2 inline-block text-primary">
                  test day!
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                <Link href={`/`} className="font-semibold underline px-1">
                  Test Route Driving School
                </Link>
                offers a specialized{" "}
                <strong>Sydney suburbs driving test package</strong> to includes
                expert instruction and practical make your day straightforward.
                We provide services throughout East Sydney to support your
                goals. Both test packages include a vital warm-up lesson before
                the exam. You can relax and drive with confidence, shaking off
                any last-minute nerves. Your instructor provides final feedback
                on things to watch for during the test. Please get in touch with
                us if you have any questions about taking your test.
              </p>
              <h3 className="text-lg font-semibold">Our packages include:</h3>
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/packages" className="group">
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
        sectionTitle="Professional Driving Test Package Sydney suburbs Options"
        sectionSubtitle={
          <>
            Select the ideal
            <strong>Driving Test Package in Sydney suburbs</strong>
            to support your learning journey. We offer structured automatic
            driving lessons designed to help you achieve fast success. Our{" "}
            <strong>Driving test service in Sydney suburbs</strong>focuses on
            your unique strengths and weaknesses. You will practice on roads
            near the Rockdale Service Centre to stay prepared. We ensure you
            feel comfortable with the specific vehicle controls you will use.
            Expert training significantly increases your chances of passing on
            your first attempt. Check our
            <Link href={`/packages`} className="font-semibold underline px-1">
              available packages
            </Link>{" "}
            to find the best fit for your budget.
          </>
        }
        packages={automaticDrivingPackages}
      />

      <section className="py-20 bg-white">
        <Container>
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            {/* Left Text Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Driving Test Package Lessons in
                <span className="text-primary"> Sydney, NSW</span>
              </h2>

              <p className="text-neutral text-lg leading-relaxed">
                Are you looking for a reliable{" "}
                <strong>driving school in Sydney suburbs</strong>? At{" "}
                <strong>Test Route Driving School</strong>, we offer both
                automatic and manual driving lessons. Our programs are suitable
                for beginners, learners, and those nearing their practical
                exams. Certified instructors focus on building your road safety
                and practical skills. Whether you want to master city streets or
                parking, we help you. Our structured{" "}
                <strong>driving lessons in Sydney suburbs</strong> provide
                everything you need to become a safe driver. We cover highway
                driving and complex roundabouts to ensure you feel confident and
                prepared. Visit our{" "}
                <Link
                  href={`/services`}
                  className="font-semibold underline px-1"
                >
                  services page
                </Link>{" "}
                to see how we can help you.
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
            <div className="rounded-xl w-full md:w-auto flex-1 flex justify-center">
              <Image
                src={localDrivingImg}
                width={500}
                height={500}
                alt="Driving Test Package Test Route Driving School"
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
                  Get Ready to Pass Your Driving Test Package
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  Learning to drive is challenging, but our{" "}
                  <strong> Driving test car</strong> instructors in Sydney
                  suburbs make it easy. You will receive personalized guidance
                  tailored to your specific skill level. We cover all aspects of
                  safe Driving, including traffic rules and hazard perception.
                  Each lesson builds your confidence behind the wheel for
                  real-world situations. We focus on both practical skills and
                  the theoretical knowledge you need. Our experts believe that a
                  calm mind leads to a successful test result. You will practice
                  essential maneuvers, such as three-point turns and reverse
                  parallel parking. Learn more{" "}
                  <Link
                    href={`/about`}
                    className="font-semibold underline px-1"
                  >
                    about us
                  </Link>
                  and our commitment to your safety.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pre-Driving Test Package Lessons for Learners
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  We understand that every learner has a unique schedule and
                  pace. That is why we offer flexible lesson timings throughout
                  the
                  <strong>Sydney Suburbs.</strong>You can{" "}
                  <a
                    target="_blank"
                    href={`https://en.wikipedia.org/wiki/Driver%27s_licences_in_Australia`}
                    className="font-semibold underline px-1"
                  >
                    book
                  </a>{" "}
                  sessions during evenings and weekends to fit your life. Our
                  instructors create customized plans based on your progress and
                  areas for improvement. With consistent feedback, you will
                  steadily advance your skills on the road. By the end of your
                  course, you will be ready for any scenario. You can find{" "}
                  <strong>a Driving test car hire near Sydney suburbs</strong>{" "}
                  that fits your timeline perfectly. Check our
                  <Link
                    href={`/area-covered`}
                    className="font-semibold underline px-1"
                  >
                    areas covered
                  </Link>
                  to see if we serve your street.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs
        subTitle={
          <>
            At <strong>Test Route Driving School</strong>, we provide
            professional lessons and license assistance. We are the best choice
            for your
            <a
              target="_blank"
              href={`https://www.transport.nsw.gov.au/roadsafety/young-drivers/learners`}
              className="font-semibold underline px-1"
            >
              driving education
            </a>in the <strong>Sydney Suburbs.</strong>
          </>
        }
        points={whyChoosePoints}
      />

      <Faq faqs={faqs} />
    </div>
  );
}
