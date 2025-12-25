
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
import Faq from "@/app/shared/Faq";

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

export default function CityCarDrivingPackage() {
  const features = [
    "Flexible lesson scheduling with pick-up & drop-off",
    "Automatic transmission vehicles with dual controls",
    "5-Star ANCAP safety-rated cars for a secure learning experience",
    "Personalized feedback to accelerate your progress",
    "Dual-brake car hire for driving tests",
  ];

  return (
    <div className="">
      <PageHeroSection
        title={`City Driving Class in Sydney, NSW`}
        subtitle={`At Test Route Driving School, we provide expert automatic driving lessons across Sydney to help learners of all skill levels become confident, safe drivers.`}
      />

      {/* Main Content Section */}
      <section className="mt-10 md:mt-15 py-16">
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
                City Car Driving
                <span className="pl-2 inline-block text-primary">
                  Lesson Package
                </span>
              </h2>

              <p className="text-neutral leading-relaxed mb-6">
                At Test Route Driving School, we provide expert automatic
                driving lessons across Sydney to help learners of all skill
                levels become confident, safe drivers. Our certified instructors
                tailor lessons to suit your individual needs, ensuring you are
                well-prepared for your driving test and help you pass in the
                first go. Safety is the number one priority in our lessons, and
                we will encourage drivers to be aware, considerate, and practice
                safe driving for life.
              </p>
              <h3 className="text-lg font-semibold">
                Package Included:
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
          <h3 className="text-lg md:text-2xl font-semibold">
            Why City Driving Package Is Different
          </h3>
          <ul className="mt-2 list-disc pl-3 space-y-2">
            <li className="text-base-300 ">
              Quick decision-making in high-traffic areas
            </li>
            <li className="text-base-300 ">
              Navigating multi-lane intersections and roundabouts
            </li>
            <li className="text-base-300 ">
              Managing bus lanes, tram lines, and shared zones
            </li>
            <li className="text-base-300 ">
              Handling tight parallel parking and one-way streets
            </li>
            <li className="text-base-300 ">
              Using hazard perception to anticipate unpredictable conditions
            </li>
          </ul>
          <h3 className="mt-4 text-lg md:text-2xl font-semibold">
            Prepare for Success
          </h3>
          <p className="mt-2 max-w-4xl">
            Don’t leave your driving test to chance. With Right Choice Driving School, you’ll receive the support and guidance you need to pass your test with confidence. Contact us today to book your driving test assessment and take the first step towards becoming a licensed driver.
          </p>
        </Container>
      </section>

      {/* Service Packages */}
      <ServicePackages
        sectionTitle="City Car Driving Lesson Packages"
        sectionSubtitle="Choose the perfect package for your learning journey with our structured City Car driving lessons designed for success."
        packages={cityCarDrivingPackages}
      />
<MovingCar/>
      <WhyChooseUs />

      <Faq />
    </div>
  );
}
