
import Link from "next/link";
import Image from "next/image";
import automaticLessonImg from "@/app/assets/service-lesson-test-route-driving-school.png";
import {
  FaCheckCircle,
} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import ServicePackages from "../components/ServicePackages";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/Faq";

const automaticDrivingPackages = [
  {
    id: 1,
    title: "Test Day Pack",
    description:
      "1 x 60 min Warm up Lesson on test day",
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
    description:
      "2 x 60 min Warm up Lesson on test day",
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

export default function DrivingTestPackage() {
  const features = [
    "Pick up and drop off",
    "Warm up lesson",
    "Car hire for duration of test",
    "1 hour lesson prior to your test day in our Full Test Package",
  ];

  return (
    <div className="">
      <PageHeroSection
        title={`Driving Test Package in Sydney`}
        subtitle={`Prepare for your driving test with confidence. Our comprehensive package includes expert instruction, practical assessments, and personalized guidance to help you pass with ease.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
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
                Test Route Driving School offers test packages throughout East
                Sydney to help make your driving test day as straightforward as
                possible. <br/> Both test packages include a warm up lesson where you can relax into driving before sitting the test, as well as receive feedback for things to watch out for during your test. Please contact us if you have any questions about sitting your driving test!


              </p>
              <h3 className="text-lg font-semibold">
                 Our packages include:
              </h3>
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
        sectionTitle="Driving Test Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured automatic driving lessons designed for success."
        packages={automaticDrivingPackages}
      />
<MovingCar/>
      <WhyChooseUs />

      <Faq />
    </div>
  );
}
