"use client"
import Link from "next/link";
import Image from "next/image";
import carHireImg from "@/app/assets/car-hire.jpg";
import {FiArrowRight} from "react-icons/fi";
import fleet1Img from "@/app/assets/fleet1.png";
import fleet2Img from "@/app/assets/fleet2.png";
import fleet3Img from "@/app/assets/fleet3.png";
import {toast} from "react-toastify";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
import DrivingTipsSection from "../../components/Home/DrivingTipsSection";
import { FaAward, FaBrain, FaCalendarAlt, FaCar, FaChartLine, FaShieldAlt } from "react-icons/fa";

  const whyChoosePoints = [
    {
      title: "Expert Driving Instructors",
      description:
        "Our trainers teach safe and efficient driving skills.",
    },
    {
      title: "Comprehensive Training",
      description:
        <>
        We offer practical and theoretical lessons for real-world driving.
        </>,
    },
    {
      title: "License Assistance",
      description:
        "We simplify and streamline the application process.",
    },
    {
      title: "Modern Vehicles",
      description:
        "Learn in well-maintained cars for a smooth and enjoyable experience.",
    },
    {
      title: "Flexible Timing",
      description: "Choose class schedules that fit your routine in Kogarah.",
    },
  ];

    const drivingLessonTips = [
      {
        title: "Practice Regularly",
        description:
          "Consistent practice builds your Confidence behind the wheel.",
        icon: <FaCalendarAlt className="h-6 w-6" />,
        color: "text-blue-600 bg-blue-50",
        duration: "Ongoing",
      },
      {
        title: "Prioritize Road Safety",
        description:
          "Always follow traffic rules and maintain safe distances.",
        icon: <FaShieldAlt className="h-6 w-6" />,
        color: "text-green-600 bg-green-50",
        priority: "High",
      },
      {
        title: "Build Confidence Gradually",
        description:
          "Begin with simple exercises before progressing to more challenging ones.",
        icon: <FaChartLine className="h-6 w-6" />,
        color: "text-purple-600 bg-purple-50",
        level: "Beginner to Advanced",
      },
      {
        title: "Understand Both Manual & Automatic Cars",
        description:
          " Knowing both manual and automatic controls enhances your driving skills.",
        icon: <FaCar className="h-6 w-6" />,
        color: "text-amber-600 bg-amber-50",
        type: "Technical",
      },
      {
        title: "Stay Calm and Focused",
        description:
          "Focus on the road and avoid any mental distractions.",
        icon: <FaBrain className="h-6 w-6" />,
        color: "text-teal-600 bg-teal-50",
        focus: "Mental",
      },
      {
        title: "Prepare for Driving Tests",
        description:
          "Learn specific tips for parking and city maneuvers.",
        icon: <FaAward className="h-6 w-6" />,
        color: "text-red-600 bg-red-50",
        goal: "Test Success",
      },
    ];

   const faqs = [
  {
    question: "How many lessons do I need to pass my driving test?",
    answer:
      <>
     The number of lessons varies for every<a target="_blank" href={`https://drivinglessons.site/blog/lessons-hours-pass-driving-test/`} className="font-semibold underline px-1">
         learner
        </a> in Kogarah. On average, students require 5 to 10 lessons, depending on their Level of Confidence. We assess your skills and help you reach your goals fast.
      </>,
  },
  {
    question: "Do you provide pickup and drop-off for lessons?",
    answer:
      <>
       Yes, we offer convenient pickup and drop-off from your home or workplace. This service is available throughout our entire service area in the Sydney Suburbs  .
      </>,
  },
  {
    question: "Which suburbs do your instructors cover?",
    answer:
      <>
     Our instructors cover Kogarah, Hurstville, Rockdale, Bexley, Carlton, and Arncliffe. We are familiar with the local roads and testing routes in these areas.
      </>,
  },
  {
    question: "What type of car will I learn in?",
    answer:
      <>
You will learn in a modern automatic vehicle with dual controls. These cars ensure maximum safety during your entire training period.
      </>,
  },
  {
    question: "Can I book lessons online?",
    answer:
      <>
Yes! You can easily book your driving lessons online through our website. Our booking form is available 24/7 for your total convenience.
      </>,
  },


];

const fleets = [
  {
    id: 1,
    title: "Toyota Avanza",
    price: "100",
    features: [
      "Quatily Dual Brake Installed",
      "Instructor Mirror and Blind Spot Mirror Installed",
      "Insurance Covered",
      "8' LCD Touch Screen with wireless Andriod Auto & Apple Car Play",
      "Lane Keeping Assist",
      "Lane Following Assist",
    ],
    img: fleet1Img,
  },
  {
    id: 2,
    title: "Toyota Corolla Hybrid 2023",
    price: "110",
    features: [
      "Quatily Dual Brake Installed",
      "Instructor Mirror and Blind Spot Mirror Installed",
      "Insurance Covered",
      "APPLE CARPLAY & ANDROID AUTO",
      "BLIND SPOT SENSORS",
      "LANE DEPARTURE WARNING",
      "CRUISE CONTROL",
      "REVERSE CAMERA",
      "KEYLESS ENTRY/STAR",
    ],
    img: fleet2Img,
  },
  {
    id: 3,
    title: "Toyota Camry",
    price: "110",
    features: [
      "Quatily Dual Brake Installed",
      "Instructor Mirror and Blind Spot Mirror Installed",
      "Insurance Covered",
      "Apple CarPlay & Android Auto",
      "Key-less Entry & Push Button Start",
      "Blind Spot Monitors with Rear Cross Traffic Alert",
      "Active Cruise Control",
      "Lane Keep Assistance",
    ],
    img: fleet3Img,
  },
];

export default function CarHireForInstructorClient() {
  const handleBookCar = () => {
    return toast.info("We don't have car for rent at this stage.");
  };
  return (
    <div className="">
      <PageHeroSection
        title={`Dual Brake Car Hire in Sydney Suburbs | Flexible Timings & Professional Support`}
        subtitle={`Test Route Driving School is your reliable source for Dual Brake Car Hire in Kogarah. We tailor our services to meet the specific needs of local driving instructors. Our team prioritizes safety and excellence in every lesson you provide. We supply well-maintained vehicles equipped with state-of-the-art dual brake systems. This allows you to teach with total peace of mind in Kogarah. You can focus on your students while we handle the vehicle quality. We ensure your business remains professional and highly safe at all times.`}
      />

      {/* Main Content Section */}
      <section className=" py-16">
        <Container>
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="lg:flex-1 w-full">
              <div className="relative rounded-xl overflow-hidden bg-base-300">
                <Image
                  src={carHireImg}
                  className="w-full h-120 object-cover transform hover:scale-105 transition-transform duration-700"
                  width={600}
                  height={500}
                  alt="Automatic Driving Lesson with Test Route Driving School"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:flex-1 w-full">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
               Dual-controlled Vehicles Available
                <span className="pl-2 inline-block text-primary">for Hire</span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
               We offer a wide range of cars for your driving instructor car hire in Kogarah. You can choose the perfect vehicle to match your specific teaching style. We provide flexible rental options and competitive pricing for all Sydney Suburbs  trainers. Our packages are designed to be both affordable and very convenient. If your car breaks down, we have the perfect cover for you. Do not lose work while your vehicle is being repaired. Our support team makes the dual control car hire near Sydney Suburbs  process seamless. Trust us to enhance the quality of your driving school business.
              </p>
              <p className="text-neutral leading-relaxed mb-6">
                Our wide range of cars allows you to choose the perfect vehicle
                for your teaching style and preferences.With flexible rental
                options and competitive pricing packages designed for driving
                instructors, we ensure affordability and convenience.
              </p>
              <p className="text-neutral leading-relaxed mb-6">
                If you are a driving instructor and your vehicle has broken
                down, or is being repaired, and you are stressed about losing
                work, we have cover for you. Our dedicated customer support team
                is always ready to assist you, making the rental process
                seamless and hassle-free. Trust Test Route Driving School to
                enhance the quality of your driving.
              </p>
              <p className="text-neutral leading-relaxed mb-6">
                Please{" "}
                <Link
                  className="text-primary font-semibold"
                  href={`/company/contact`}
                >
                  Contact Us
                </Link>{" "}
                to discuss more about Dual brake car for hire. We guarantee the
                best service and price in Sydney.
              </p>

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

      <section className="py-16">
        <Container>
          <SectionHeader
            className={`mt-0!`}
            title={`Our Fleet`}
            subtitle={
              "A modern and diverse range of vehicles designed for comfort, safety, and an excellent driving experience."
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fleets.map((fleet) => (
              <div
                key={fleet.id}
                className="bg-white border border-border-color rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Fleet Image */}
                <div className="relative w-full h-48 md:h-56">
                  <Image
                    src={fleet.img}
                    alt={fleet.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Fleet Info */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Title and Price */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {fleet.title}
                      </h3>
                      <span className="text-primary font-semibold">
                        ${fleet.price}/hr
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-2 text-gray-600 text-sm">
                      {fleet.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">•</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <PrimaryBtn
                    onClick={handleBookCar}
                    className="w-full!"
                  >
                    Book This Car
                  </PrimaryBtn>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="mt-5 py-12 bg-primary/10">
        <Container>
          <div className="space-y-4">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                 Why Instructors Choose Our Dual Brake Car Hire
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                 Driving instructors face many challenges, and we are here to help you solve them. Our Dual Brake Car Hire for instructors in Sydney Suburbs  ensures your lessons run smoothly without any interruptions. We offer the best service and price in the area to ensure your business stays profitable. Many local trainers prefer our dual brake car hire Sydney Suburbs  because of our flexible schedules. You can hire a car for a few days or several weeks, depending on your needs. We take the stress out of vehicle maintenance so you can focus on your learners. Choosing our Dual Controlled Car Hire means you always have a safe backup plan. We are the most reliable source for car hire for driving instructors in Kogarah.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                 Flexible Schedules and Tailored Learning Plans in Kogarah
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  Every learner has a unique schedule and a different learning pace. That is why we offer flexible lesson timings throughout Sydney Suburbs  for our students. This includes evenings and weekends, allowing you to fit your busy life perfectly. Our instructors create custom plans based on your current progress and strengths. You will receive consistent feedback to improve your skills on the road. We ensure you are ready for real-life driving scenarios with ease. Our dual brake car hire near me ensures that even if our main car is busy, we stay active.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs points={whyChoosePoints}/>
      <DrivingTipsSection title={`Expert Driving Tips & Advice for Sydney Suburbs  Learners`} subtitle={
        <>
          <a target="_blank" href={`https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/learner-driver-licence/supervising`} className="font-semibold underline px-1">
          Learning
        </a> to drive is challenging but rewarding with the right mindset. Our professional instructors offer expert guidance to learners of all skill levels.
        </>
      } tips={drivingLessonTips}/>
      <Faq className={`bg-white`} faqs={faqs}/>
    </div>
  );
}
