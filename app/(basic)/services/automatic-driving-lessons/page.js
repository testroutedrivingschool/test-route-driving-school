import Link from "next/link";

import Image from "next/image";
import automaticLessonImg from "@/app/assets/service-lesson-test-route-driving-school.png";
import {FaAward, FaBrain, FaCalendarAlt, FaCar, FaChartLine, FaCheckCircle, FaShieldAlt} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import MovingCar from "@/app/shared/MovingCar";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import ServicePackages from "../components/ServicePackages";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
import DrivingTipsSection from "../../components/Home/DrivingTipsSection";
import localDrivingImg from "@/app/assets/local-driving-lesson-test-route-driving-school.png";

export const metadata = {
  title: "Top-Rated Driving Lessons in Sydney suburbs| Book Your Lesson Today",
  description:
    "Get the best driving lessons in Sydney suburbs with expert instructors. Master automatic driving and pass your test fast with our affordable local packages. Book now!",
  keywords: [
    "Driving Lessons in Sydney suburbs",
    "driving school in Sydney suburbs",
    "driving instructor in Sydney suburbs",
    "driving lessons Sydney suburbs",
    "driving class Sydney suburbs",
    "Learn to drive Sydney suburbs",
    "Professional driving instructor Sydney suburbs",
    "Cheap driving lessons Sydney suburbs",
    "Driving lessons near Sydney suburbs",
    "Affordable driving lessons Sydney suburbs",
    "Best driving lessons in Sydney suburbs",
    "Driving lessons for beginners Sydney suburbs",
  ],
};

const automaticDrivingPackages = [
  {
    id: 1,
    title: "1 Hour Lesson",
    description: "Perfect for beginners starting their journey",
    price: "75",
    duration: "1 x 60 min lesson",
    features: ["Single session", "Basic fundamentals", "Instructor feedback"],
    buttonText: "Book 1 Hour",
    popular: false,
  },
  {
    id: 2,
    title: "5 Hour Pack",
    description: "Build confidence with multiple sessions",
    price: "365",
    originalPrice: "395",
    duration: "5 x 60 min lessons",
    features: ["Save $30", "Progress tracking", "Flexible scheduling"],
    buttonText: "Buy 5 Hours",
    popular: false,
  },
  {
    id: 3,
    title: "10 Hour Pack",
    description: "Comprehensive training for test preparation",
    price: "700",
    originalPrice: "750",
    duration: "10 x 60 min lessons",
    features: ["Save $50", "Mock tests", "Highway driving"],
    buttonText: "Buy 10 Hours",
    popular: true,
  },
  {
    id: 4,
    title: "20 Hour Pack",
    description: "Complete mastery package",
    price: "1360",
    originalPrice: "1500",
    duration: "20 x 60 min lessons",
    features: ["Save $140", "Advanced maneuvers", "Exam readiness"],
    buttonText: "Buy 20 Hours",
    popular: false,
  },
];
  const features = [
    <>
      Dual-control vehicles for maximum safety in<strong>Hurstville</strong>
    </>,
    <>
      Personalized lesson plans for all skill levels in<strong>Rockdale</strong>
    </>,
    <>
      Real-time feedback and progress tracking in<strong>Bexley</strong>
    </>,
    <>
      Test route practice and mock exams in<strong>Carlton</strong>
    </>,
  ];
  const whyChoosePoints = [
    {
      title: "Expert Driving Instructors",
      description:
        "Our trainers ensure you learn safe and efficient skills.",
    },
    {
      title: "Comprehensive Training",
      description:
        <>
        We offer <Link href={`/services`} className="px-1 font-semibold underline">Our Driving Services</Link> for both practical and theoretical mastery.
        </>,
    },
    {
      title: "License Assistance",
      description:
        " We help you through the application process to keep it hassle-free.",
    },
    {
      title: "Modern Vehicles",
      description:
        "Learn in well-maintained cars for a smooth and comfortable experience.",
    },
    {
      title: "Flexible Timing",
      description: " Choose class schedules that perfectly align with your daily routine.",
    },
  ];

    const drivingLessonTips = [
      {
        title: "Practice Regularly",
        description:
          "Consistent driving builds your muscle memory and Confidence.",
        icon: <FaCalendarAlt className="h-6 w-6" />,
        color: "text-blue-600 bg-blue-50",
        duration: "Ongoing",
      },
      {
        title: "Prioritize Road Safety",
        description:
          "Always follow traffic rules and anticipate hazards early.",
        icon: <FaShieldAlt className="h-6 w-6" />,
        color: "text-green-600 bg-green-50",
        priority: "High",
      },
      {
        title: "Build Confidence Gradually",
        description:
          "Begin on quiet streets before progressing to heavy traffic.",
        icon: <FaChartLine className="h-6 w-6" />,
        color: "text-purple-600 bg-purple-50",
        level: "Beginner to Advanced",
      },
      {
        title: "Understand Both Manual & Automatic Cars",
        description:
          "If learning automatically, understanding manual cars improves overall vehicle control. ",
        icon: <FaCar className="h-6 w-6" />,
        color: "text-amber-600 bg-amber-50",
        type: "Technical",
      },
      {
        title: "Stay Calm and Focused",
        description:
          "Focus on the road and avoid distractions while you drive.",
        icon: <FaBrain className="h-6 w-6" />,
        color: "text-teal-600 bg-teal-50",
        focus: "Mental",
      },
      {
        title: "Prepare for Driving Tests",
        description:
          "Learn specific maneuvers, such as reverse parallel parking and three-point turns, to enhance your driving skills.",
        icon: <FaAward className="h-6 w-6" />,
        color: "text-red-600 bg-red-50",
        goal: "Test Success",
      },
    ];

   const faqs = [
  {
    question: "How many lessons do I need to pass?",
    answer:
      <>
      The number varies for every learner in the <strong>Sydney Suburbs</strong>. Most students need 5 to 10 lessons to feel truly ready. For more details, please visit our <Link href={`/faq`} className="font-semibold underline px-1">FAQ page.</Link>

      </>,
  },
  {
    question: "Do you provide pickup and drop-off?",
    answer:
      <>
       Yes, we offer convenient pickup from your home or school. We serve
     <strong>
      the areas of Sydney suburbs, Hurstville, Rockdale, Bexley, Carlton, and Arncliffe.
     </strong>
      </>,
  },
  {
    question: "Which suburbs do your instructors cover?",
    answer:
      <>
      We cover a wide range of areas, including <strong>Allawah, Arncliffe, Bexley, Rockdale, and Hurstville</strong>. Visit our<Link href={`/area-covered`} className="font-semibold underline px-1">Areas We Cover</Link>  page for the complete list.
      </>,
  },
  {
    question: "Can I book lessons online?",
    answer:
      <>
      Yes, you can easily book through our website or <Link href={`/company/contact`} className="font-semibold underline px-1">Contact Us</Link>  page. Our online system is available 24/7 for your convenience.
      </>,
  },


];
export default function AutomaticDrivingLesson() {


  return (
    <div className="">
      <PageHeroSection
        title={`Best Driving Lessons in Sydney suburbs for Fast Success`}
        subtitle={
          <>
            Mastering the road starts with the right{" "}
            <strong>driving school in Sydney suburbs</strong>. You deserve a
            stress-free experience while learning to handle modern traffic
            safely. We offer top-tier{" "}
            <strong>driving lessons in Sydney suburbs</strong> that cater to
            your specific needs. Our team utilizes dual-control cars to ensure
            your safety during every session. You will find that our{" "}
            <strong>driving class in Sydney suburbs</strong> makes learning a
            fun and straightforward experience. We help you build the skills
            required for a lifetime of safe driving. Are you ready to get behind
            the wheel with a{" "}
            <strong>professional driving instructor in Sydney suburbs?</strong>{" "}
            Our experts guide you through every turn with patience and
            straightforward advice.
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
                Cruise Sydney with Confidence in
                <span className="pl-2 inline-block text-primary">
                  Automatic Cars
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                At<strong>TestRoutedrivingSchool</strong>, we specialize in
                automatic training across the <strong>Sydney Suburbs.</strong>{" "}
                that cater to your specific needs. Our team utilizes
                dual-control cars to ensure your safety during every session.
                You will find that our{" "}
                <strong>driving class in Sydney suburbs</strong>Our certified{" "}
                <strong> driving instructor in Sydney suburbs</strong> offers
                personalized coaching to help you build your road confidence. We
                ensure you feel well-prepared to pass your practical test on the
                first attempt.
              </p>

              {/* Key Features */}
              <div className="space-y-4 mb-8">
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
                  <PrimaryBtn className="px-8 py-3 min-w-12 text-lg font-semibold group-hover:scale-105 transition-transform">
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
        sectionTitle="Affordable Driving Lessons Sydney suburbs Packages"
        sectionSubtitle={
          <>
            Choose the perfect plan for your journey with our structured
            <strong>driving lessons in Sydney suburbs</strong> sessions. We
            offer{" "}
            <strong> affordable driving lessons that Sydney suburbs </strong>{" "}
            learners can afford without compromising on quality or safety.
            Whether you need a single refresher or a complete beginner course,
            we have you covered. Explore our{" "}
            <Link href={`/packages`} className="font-semibold underline px-1">
              {" "}
              Driving Packages
            </Link>{" "}
            to find the best fit for you. You will save money while receiving
            the<strong>best driving lessons in Sydney suburbs </strong> from
            local, expert instructors. Our goal is to deliver high-value
            training tailored to your specific budget and needs.
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
                Driving Lessons for Beginners Sydney suburbs
                <span className="text-primary px-1">Residents Trust</span>
              </h2>

              <p className="text-neutral text-lg leading-relaxed">
               Our 
            <strong>driving lessons for beginners in Sydney suburbs</strong>  focus on a smooth, stress-free learning path. Since automatic cars have no clutch, you can focus entirely on road awareness. You will learn vital hazard perception skills from our
            <Link href={`/instructors`} className="font-semibold underline px-1">
               instructors 
            </Link>{" "}
             in real-world conditions.<strong> Learn to drive Sydney suburbs </strong> streets with ease as we guide you through intersections and school zones. We ensure you master city driving and parking techniques before your big test day. Our structured programs provide everything you need to become a safe, independent driver.

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
                  Flexible Driving Lessons Near Sydney suburbs for Busy Lives
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                 We offer flexible <strong>driving lessons near Sydney suburbs</strong>, including weekdays, evenings, and weekends. Our instructors tailor each session to your learning pace and personal schedule. Whether you are a student or a working professional, we fit into your life. We understand that every learner has a unique pace and different goals. That is why we offer flexible timings across<strong>Arncliffe</strong> to accommodate your busy routine. Our instructors create customized plans based on your progress and areas for improvement. You will advance your skills steadily while maintaining total safety on the road.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Flexible Schedules and Tailored Learning Plans
                </h3>
                <p className="text-gray-700 text-lg mb-3">
                  We understand that every learner has a unique schedule and
                  learning pace. That’s why we offer flexible lesson timings
                  throughout , including evenings and weekends, to accommodate
                  students, professionals, and busy parents. Our instructors
                  create customized lesson plans based on your progress,
                  strengths, and areas that need improvement. With consistent
                  feedback and practical exercises, you’ll steadily advance your
                  driving skills while maintaining safety and confidence on the
                  road. By the end of your course, you’ll not only be ready for
                  your driving test but also for real-life driving scenarios
                  with ease.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs points={whyChoosePoints} subTitle={<>
        As a leading <strong>driving school</strong>, we provide professional lessons and license assistance. We are the best choice for your education in the <strong>Sydney Suburbs.</strong>
        </>}/>
      <DrivingTipsSection subtitle={"Learning to drive can be challenging, but having the right mindset makes it easier. Our experts offer these tips to help you succeed on NSW roads:"} tips={drivingLessonTips}/>
      <Faq className={`bg-white`} faqs={faqs}/>
    </div>
  );
}
