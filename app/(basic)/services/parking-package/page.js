import Link from "next/link";
import Image from "next/image";
import parkingPackageImg from "@/app/assets/parking-package-img-test-route-driving-school.jpg";
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
    "Affordable Parking Driving Lesson Package in Sydney suburbs| Book Today",
  description:
    " Master every spot with our Parking Driving Lesson Package in Sydney suburbs. Get expert 1-on-1 coaching to ace your test and park with confidence. Book your session now!",
  keywords: [
    "Parking Driving Lesson Package in Sydney suburbs",
    "Driving school in Sydney suburbsNSW",
    "Learn parking driving Sydney suburbs",
    "Driving instructor in Sydney suburbs",
    "Parking lessons for learners in Sydney suburbs",
    "Driving lesson packages in Sydney suburbs",
    "Parking driving lessons in Sydney suburbs",
    "Best driving school near Sydney suburbs",
    "Parking driving instructor near me",
    "Driving lessons near Sydney suburbs",
  ],
};

const features = [
  <>
    <strong> Parallel Parking Mastery:</strong> Learn smooth and accurate
    techniques for test conditions and everyday driving.
  </>,
  <>
    <strong>Reverse Bay Parking:</strong> Build confidence performing one of the
    most difficult test maneuvers.
  </>,
  <>
    <strong>Kerbside Stops:</strong> Practice in car parks and roadside
    conditions commonly faced in urban Sydney.
  </>,
  <>
    <strong>Tight Space Navigation:</strong> Learn how to handle confined areas
    calmly and confidently.
  </>,
];

const automaticDrivingPackages = [
  {
    id: 1,
    title: "Highway Driving Lesson 2 Hours",
    description:
      "Driving on the highway can be intimidating for new drivers, but it’s an essential skill for gaining full independence behind the wheel. Our Highway Driving lesson is designed to give learner drivers the confidence and experience needed to navigate fast-paced highways and motorways safely.",
    price: "250",
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
    title: "Highway Driving Lesson 3 Hours",
    description:
      "Driving on the highway can be intimidating for new drivers, but it's an essential skill for gaining full independence behind the wheel. Our Highway Driving lesson is designed to give learner drivers the confidence and experience needed to navigate fast-paced highways and motorways safely.",
    price: "270",
    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Book Now",
  },
];

  const whyChoosePoints = [
    {
      title: "Expert Driving Instructors",
      description:
        "Our certified trainers ensure you learn safe and efficient driving skills.",
    },
    {
      title: "Comprehensive Training",
      description:
        <>
       We offer both practical and theoretical lessons to prepare you for real-world driving.
        </>,
    },
    {
      title: "License Assistance",
      description:
        " We help you through the application process to make it hassle-free.",
    },
    {
      title: "Modern Vehicles",
      description:
        "Learn in well-maintained cars for a smooth and comfortable experience.",
    },
    {
      title: "Flexible Timing",
      description: " Choose from convenient class schedules that fit your busy routine.",
    },
  ];

   const faqs = [
  {
    question: "How many lessons do I need to pass my driving test?",
    answer:
      <>
      The number of lessons varies for each learner. On average, most students require between 5 and 10 lessons. This depends on your experience, confidence, and current driving skills. We offer various<strong>driving lesson packages in Sydney suburbs </strong>to suit your specific needs.
      </>,
  },
  {
    question: "Do you provide pickup and drop-off for lessons?",
    answer:
      <>
       Yes, we offer convenient pickup and drop-off services. We can meet you at your home, school, or workplace. We serve a wide range of areas, including 
     <strong>
      Sydney suburbs, Hurstville, and Rockdale.
     </strong>
      </>,
  },
  {
    question: "Which suburbs do your instructors cover?",
    answer:
      <>
     Our instructors cover a wide range of suburbs in the <strong>Sydney Suburbs.</strong>This includes Allawah, Arncliffe, Bexley, Rockdale, Hurstville, and Sydney suburbs. We are familiar with the local test routes in these areas better than anyone else.

      </>,
  },
  {
    question: "What type of car will I learn in?",
    answer:
      <>
      You will learn in a modern automatic vehicle. Every car features dual controls to ensure maximum safety and security. This allows me to intervene if you make a mistake while you <strong>learn to park in Sydney suburbs.</strong>
      </>,
  },
  {
    question: "Can I book lessons online?",
    answer:
      <>
      YYes, you can! Visit our<Link href={`/packages`} className="font-semibold underline px-1">Find Your Perfect Driving Package</Link> page to book at any time. Our online form is simple and fast to use for your convenience.

      </>,
  },


];

export default function ParkingPackage() {
  return (
    <div className="">
      <PageHeroSection
        title={`Affordable Parking Driving Lesson Package in Sydney suburbs | Book Today`}
        subtitle={
          <>
            This specialized
            <strong>
              Parking Driving Lesson Package in Sydney suburbs
            </strong>{" "}
            helps you master difficult maneuvers with ease. You will gain
            hands-on experience under the guidance of a professional
            <strong>driving instructor in Sydney suburbs.</strong> Our course
            focuses on reverse parallel parking, bay parking, and steering
            control. We help you build the confidence needed to pass your NSW
            driving test. Join the
            <strong>best driving school near Sydney suburbs</strong>to secure
            your independence on the road today.
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
                  src={parkingPackageImg}
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
                Master Your Skills with a Parking Driving Lesson Package in
                <span className="pl-2 inline-block text-primary">
                  Sydney suburbs
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                Do you feel anxious when parking on a busy street in reverse?
                Squeezing into a tight spot in a crowded car park stresses many
                people. You are not alone in this struggle. Parking is a common
                pain point for both new and experienced drivers. Our{" "}
                <strong>
                  Parking Driving Lesson Package in Sydney suburbs
                </strong>{" "}
                is a comprehensive 3-hour, one-on-one session. I designed this
                lesson to help you overcome your fear and turn parking into a
                strength. As an experienced instructor, I see students transform
                their skills in just one afternoon. You will move from being
                nervous to being completely composed behind the wheel.
              </p>
              <h3 className="text-lg font-semibold mb-6">
                What&apos;s Included in Your Parking Driving Lessons in Sydney
                suburbs?
              </h3>

              <p className="text-neutral leading-relaxed ">
                Our <strong>parking driving lessons in Sydney suburbs</strong>{" "}
                offer more than just basic tips. You receive a structured
                curriculum focused on precision and safety. We utilize modern
                vehicles equipped with dual controls for your absolute
                protection.
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
      <section className="py-16 bg-primary/80 text-white">
        <Container>
          <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
            Real-World Training with a Driving Instructor in Sydney suburbs
          </h3>

          <p className="leading-relaxed ">
            We provide practical, hands-on training in live traffic conditions.
            You won&apos;t just practice in empty lots. Your
            <strong>driving instructor in Sydney suburbs</strong> takes you
            where the action is. This exposure ensures you can park anywhere in
            the Sydney Suburbs. We focus on:
          </p>
          <ul className="mt-4 list-disc pl-3 space-y-2">
            <li className="text-base-300 ">
              Busy suburban streets near<strong>Rockdale.</strong>
            </li>
            <li className="text-base-300 ">
              Major shopping center car parks in<strong>Hurstville.</strong>
            </li>
            <li className="text-base-300 ">
              Narrow side streets throughout<strong>Bexley.</strong>
            </li>
            <li className="text-base-300 ">
              Residential and commercial areas in<strong>Carlton</strong>and
              <strong>Arncliffe.</strong>
            </li>
          </ul>
          <h3 className="mt-6 text-2xl lg:text-3xl font-semibold mb-4">
            Who Can Use These Parking Lessons for Learners in Sydney suburbs?
          </h3>
          <p className="leading-relaxed ">
            This package serves a wide variety of drivers in our community.
            Whether you are a teen or an adult, we adapt to you.
          </p>
          <ul className="mt-4 list-disc pl-3 space-y-2">
            <li className="text-base-300 ">
              <strong>Learner Drivers:</strong> Prepare for the specific
              requirements of the NSW driving test.
            </li>
            <li className="text-base-300 ">
              <strong>P-Platers:</strong> Refine your skills to navigate tricky city spots with ease.

            </li>
            <li className="text-base-300 ">
              <strong>Overseas License Holders:</strong> Adapt quickly to local Australian road rules and parking signs.

            </li>
            <li className="text-base-300 ">
              <strong>Returning Adults:</strong> Re-learn essential skills after a long break from the driver&apos;s seat.
            </li>
           
          </ul>
          <p className="mt-2 leading-relaxed">Anyone searching for a <strong>parking driving instructor near me</strong> to help them correct their bad habits.</p>
        </Container>
      </section>

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="Parking Packages"
        sectionSubtitle={
          <>
         Choose the perfect package for your learning journey with our structured Parking Package designed for success.
          </>
        }
        packages={automaticDrivingPackages}
      />
      <MovingCar />
      <WhyChooseUs points={whyChoosePoints} subTitle={ <>   Selecting the right <strong>driving school in Sydney suburbs, NSW</strong> makes a massive difference. At <strong>Test Route Driving School</strong>, we prioritize your success and safety above all else. I have helped hundreds of students in <strong>Allawah</strong> and <strong>Sydney suburbs</strong> find their rhythm on the road. We don&apos;t just teach you to drive; we teach you to survive and thrive.
          </>}/>

      <Faq faqs={faqs}/>
    </div>
  );
}
