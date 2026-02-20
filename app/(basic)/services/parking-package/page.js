"use client"
import Link from "next/link";
import Image from "next/image";
import parkingPackageImg from "@/app/assets/parking-package-img-test-route-driving-school.jpg";
import {FaCheckCircle} from "react-icons/fa";
import {FiArrowRight} from "react-icons/fi";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
import HomeMap from "@/app/shared/ui/HomeMap";
import { TbSteeringWheelFilled } from "react-icons/tb";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import { useRouter } from "next/navigation";
import { addToCartLS } from "@/app/utils/cart";


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
    _id: "695bf45c1f72e6c2fa81e099",
    name: "Parking Package 3 Hours",
          packageThumbline: "/pkg.png",
              price: "250",
    description:
      "Parking can be one of the most challenging skills for new drivers to master, but with the right guidance and practice, you can build the confidence needed to park safely and efficiently in any situation. Our Parking Lesson is designed specifically for learner drivers who want to refine their parking skills and feel more at ease in tight spaces. During this focused, hands-on session, you’ll learn essential parking techniques, including parallel parking, reverse parking, and angle parking. You’ll also gain the skills to park in crowded car parks, navigate tight spots, and handle tricky situations like parking on hills or in spaces with limited visibility. ",

    features: [
      "Automatic Driving Lesson - 7 days a week.  ",
      "Pick up and drop off at your desired location.  ",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
    buttonText: "Buy Parking Package",
  },
];

const whyChoosePoints = [
  {
    title: "Expert Driving Instructors",
    description:
     <>
     Our certified trainers ensure you learn safe and efficient  <a
      className="location-link"
      href={"https://www.gov.uk/driving-test/what-to-take?"}
      target="_blank"
      rel="noreferrer"
    >
      driving skills.
    </a>
     </>,
  },
  {
    title: "Comprehensive Training",
    description: (
      <>
        We offer both practical and theoretical lessons to prepare you for
        real-world driving.
      </>
    ),
  },
  {
    title: "License Assistance",
    description:
      " We help you through the application process to make it hassle-free.",
  },
  {
    title: "Modern Vehicles",
    description:
      <>
      
       <a
      className="location-link"
      href={"https://en.wikipedia.org/wiki/Driver%27s_licences_in_Australia"}
      target="_blank"
      rel="noreferrer"
    >
      Learn
    </a>in well-maintained cars for a smooth and comfortable experience.
      </>,
  },
  {
    title: "Flexible Timing",
    description:
      " Choose from convenient class schedules that fit your busy routine.",
  },
];

const faqs = [
  {
    question:
      "How quickly can you improve your parking skills with this package?",
    answer: (
      <>
        Most learners see improvement within one session. Focused drills
        accelerate muscle memory. Confidence increases through repeated
        practice.
      </>
    ),
  },
  {
    question: "Do parking lessons focus on NSW test marking criteria?",
    answer: (
      <>
        Training follows official NSW parking standards. Instructors explain
        common examiner expectations. Mistakes are corrected early.
      </>
    ),
  },
  {
    question: "Will you practise parking in real traffic conditions?",
    answer: (
      <>
        Lessons take place on active suburban streets. Shopping centres and
        roadside locations are used. Real pressure improves control.
      </>
    ),
  },
  {
    question: "Can parking lessons fix long-term bad driving habits?",
    answer: (
      <>
        Instructors analyse steering and positioning errors. Old habits are
        replaced with proven techniques. Consistent methods improve accuracy.
      </>
    ),
  },
  {
    question: "Is this package useful after passing your driving test?",
    answer: (
      <>
        Training helps with everyday city parking. Skills improve safety in
        crowded areas. Confidence remains strong long-term.
      </>
    ),
  },
];

export default function ParkingPackage() {
  const router = useRouter()
   const handleAddToCart = (pkg) => {
      addToCartLS(pkg);
      router.push("/cart");
    };
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
              <strong>P-Platers:</strong> Refine your skills to navigate tricky
              city spots with ease.
            </li>
            <li className="text-base-300 ">
              <strong>Overseas License Holders:</strong> Adapt quickly to local
              Australian road rules and parking signs.
            </li>
            <li className="text-base-300 ">
              <strong>Returning Adults:</strong> Re-learn essential skills after
              a long break from the driver&apos;s seat.
            </li>
          </ul>
          <p className="mt-2 leading-relaxed">
            Anyone searching for a{" "}
            <strong>parking driving instructor near me</strong> to help them
            correct their bad habits.
          </p>
        </Container>
      </section>

      {/* Service Packages */}
        <section className="py-16 bg-base-300">
           <Container>
             <SectionHeader
               className={`mt-0!`}
               title={"Parking Packages"}
               subtitle={"Choose the perfect package for your learning journey with our structured Parking Package designed for success."}
             />
     
             <div className="mt-10 flex flex-wrap gap-4 shrink-0">
               {automaticDrivingPackages.map((pkg) => (
                 <div
                   key={pkg._id}
                   className="w-full md:flex-1 group rounded-xl bg-white px-8 py-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-border-color"
                 >
                   {/* Icon */}
                   <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                     <TbSteeringWheelFilled size={40} />
                   </div>
     
                   {/* Title */}
                   <h3 className="text-center text-lg md:text-xl font-semibold text-gray-900">
                     {pkg.name}
                   </h3>
     
                   {/* Description */}
                   <p className="mt-2 text-center text-sm text-neutral">
                     {pkg.description}
                   </p>
     
                   {/* Features */}
                   {pkg.features && pkg.features.length > 0 && (
                     <ul className="mt-4 space-y-2 text-sm text-gray-700">
                       {pkg.features.map((feature, idx) => (
                         <li key={idx} className="flex items-start">
                           <span className="mr-2 text-primary">•</span>
                           <span className="text-neutral">{feature}</span>
                         </li>
                       ))}
                     </ul>
                   )}
     
                   {/* Divider */}
                   <div className="my-6 h-px bg-border-color" />
     
                   {/* Price */}
                   <div className="text-center">
                     <span className="text-4xl font-extrabold text-gray-900">
                       ${pkg.price}
                     </span>
                   </div>
                   
                   <PrimaryBtn onClick={()=>handleAddToCart(pkg)} className={`w-full! mt-4 text-center! block!`}>
                     {pkg.buttonText}
                   </PrimaryBtn>
                 </div>
               ))}
             </div>
           </Container>
         </section>
      <MovingCar />
      <WhyChooseUs
        points={whyChoosePoints}
        subTitle={
          <>
            {" "}
            Selecting the right{" "}
            <strong>driving school in Sydney suburbs, NSW</strong> makes a
            massive difference. At{" "}
            <Link href={`/`} className="font-semibold underline px-1">
              Test Route Driving School,
            </Link>
            we prioritize your success and safety above all else. I have helped
            hundreds of students in <strong>Allawah</strong> and{" "}
            <strong>Sydney suburbs</strong> find their rhythm on the road. We
            don&apos;t just teach you to drive; we teach you to survive and
            thrive.
          </>
        }
      />

      <Faq
        title={`Frequently Asked Questions About Driving Lessons Near Sydney Suburbs`}
        faqs={faqs}
      />
          <HomeMap/>
    </div>
  );
}
