import Link from "next/link";
import Image from "next/image";
import automaticLessonImg from "@/app/assets/service-lesson-test-route-driving-school.png";
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
import localDrivingImg from "@/app/assets/local-driving-lesson-test-route-driving-school.png";
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
                possible. <br /> Both test packages include a warm up lesson
                where you can relax into driving before sitting the test, as
                well as receive feedback for things to watch out for during your
                test. Please contact us if you have any questions about sitting
                your driving test!
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
        sectionTitle="Driving Test Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured automatic driving lessons designed for success."
        packages={automaticDrivingPackages}
      />

         <section className="py-20 bg-white">
                    <Container>
                      <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
                        {/* Left Text Content */}
                        <div className="flex-1 space-y-6">
                          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                            Driving Test Package Lessons in  
                            <span className="text-primary"> Sydney, NSW</span>
                          </h2>
            
                          <p className="text-neutral text-lg leading-relaxed">
                            Looking for reliable and professional driving lessons in ? At
                            Test Route Driving School, we offer both automatic and manual
                            driving lessons designed to suit beginners, learners, and those
                            preparing for their driving test. Our certified instructors
                            focus on building confidence, road safety, and practical driving
                            skills to ensure a smooth learning experience.
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
                        <div className="rounded-xl flex-1 flex justify-center">
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
                              Learning to drive can be challenging, but with our certified
                              instructors in , you’ll receive personalized guidance tailored
                              to your skill level. Whether you&apos;re a beginner starting
                              from scratch or looking to refine advanced driving techniques,
                              our lessons cover all aspects of safe and confident driving.
                              We focus on both practical skills and theoretical knowledge,
                              including road safety, traffic rules, and hazard perception.
                              Each lesson is structured to build your confidence behind the
                              wheel, ensuring you are fully prepared for your driving test
                              and real-world driving situations.
                            </p>
                          </div>
            
                          <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                             Pre-Driving Test Package Lessons for Learner Drivers in Sydney
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
      <WhyChooseUs />

      <Faq />
    </div>
  );
}
