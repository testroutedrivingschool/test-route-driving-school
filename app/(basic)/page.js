import {
  FaCar,
  FaCarSide,
  FaClipboardCheck,
  FaFileAlt,
  FaGift,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Faq from "../shared/FaqSection";
import MovingCar from "../shared/MovingCar";
import BlogSection from "./components/Blogs/BlogSection";
import DrivingTestAssessment from "./components/Home/DrivingTestAssessment";
import DrivingTestPackage from "./components/Home/DrivingTestPackage";
import DrivingTipsSection from "./components/Home/DrivingTipsSection";
import FeatureCards from "./components/Home/FeatureCards";
import FindInstructor from "./components/Home/FindInstructor";
import Hero from "./components/Home/Hero";
import HomeAbout from "./components/Home/HomeAbout";
import HomeDrivingJourney from "./components/Home/HomeDrivingJourney";
import HomePackage from "./components/Home/HomePackage";
import HowItWorks from "./components/Home/HowItWorks/HowItWorks";
import LocalDrivingLessons from "./components/Home/LocalDrivingLessons";
import GoogleReviewCard from "./components/Home/Reviews/GoogleReviewCard";
import Reviews from "./components/Home/Reviews/Reviews";
import WhatWeOffer from "./components/Home/WhatWeOffer";
import WhyChooseUs from "./components/Home/WhyChooseUs";
import Link from "next/link";

const schema = {
  "@context": "https://schema.org",
  "@type": "DrivingSchool",
  "name": "Test Route Driving School",
  "legalName": "Test Route Driving School",
  "url": "https://testroutedrivingschool.com.au/",
  "logo": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=96&q=75",
  "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=96&q=75",
  "description": "Join our expert instructors and gain confidence behind the wheel. At Test Route Driving School, we provide structured, safe, and friendly driving lessons in Sydney Suburbs. Whether you’re a beginner or improving your skills, our lessons help you feel comfortable on the road.",
  "slogan": "Learn to Drive Safely & Confidently",
  "telephone": "+61 412 018 593",
  "email": "testroutedrivingschool@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "67 Warialda St",
    "addressLocality": "Kogarah",
    "addressRegion": "NSW",
    "postalCode": "2217",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -33.9835176,
    "longitude": 151.1348637
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "06:00",
      "closes": "20:00"
    }
  ],
  "areaServed": [
    "Kogarah", "Rockdale", "Roselands", "Sandringham", "Sans Souci", "South Hurstville", 
    "Sutherland", "Sylvania", "Sylvania Waters", "Taren Point", "Tempe", "Turella", 
    "Wali Creek", "Woolooware", "Kirrawee", "Kogarah Bay", "Kyeemagh", "Marrickville", 
    "Miranda", "Monterey", "Mortdale", "Peakhurst", "Penshurst", "Ramsgate", "Ramsgate Beach", 
    "Riverwood", "Allawah", "Arncliffe", "Banksia", "Bardwell Park", "Bardwell Valley", 
    "Beverly Hills", "Bexley", "Bexley North", "Blakehurst", "Botany", "Brighton-Le-Sands", 
    "Caringbah", "Caringbah South", "Carlton", "Carss Park", "Clemton Park", "Cronulla", 
    "Dolls Point", "Eastgardens", "Endgadline", "Eastlakes", "Gymea", "Gymea Bay", 
    "Hurstville", "Hurstville Grove", "Kangaroo Point", "Kareela", "Kingsgrove", "Mascot", 
    "Pagewood", "Port Botany"
  ],
  "knowsAbout": [
    "Automatic Driving Lessons",
    "Driving Test Assessment",
    "Driving Test Preparation Packages",
    "Car Hire for Driving Instructor",
    "Parking Techniques",
    "Highway and Motorway Driving",
    "Night Driving Lessons",
    "City Driving Navigation"
  ],
  "sameAs": [
    "https://www.facebook.com/share/1A148kMS7g/"
  ]
}

export const metadata = {
  title: "Driving School in Sydney suburbs| Learn to Drive Safely & Confidently",
  description:
    "Gain confidence and pass your driving test with expert lessons in Sydney suburbs. Flexible packages, modern cars, and certified instructors. Book today!",
  keywords: [
    "Driving School in Sydney suburbs",
    "driving school near me",
    "driving lessons schools",
    "driving schools in Sydney suburbs",
    "driving schools for manual transmission",
    "driving training school near me",
    "affordable driving school in Sydney suburbs",
    "driving schools near by me",
    "driving instructor schools in Sydney suburbs",
    "driving class Sydney suburbs",
    "driving lessons Sydney suburbs",
    "driving instructor in Sydney suburbs",
  ],
};
const whatWeOfferServices = [
  {
    icon: <FaCar className="w-8 h-8 text-white" />,
    title: "Dual-Controlled Vehicles",
    description:
      "All lessons utilize modern, dual-controlled cars, ensuring maximum safety. Instructors can take control if needed, helping you feel secure while learning essential driving skills efficiently.",
  },
  {
    icon: <FaClipboardCheck className="w-8 h-8 text-white" />,
    title: "Driving Test Assessment",
    description: (
      <>
        Our certified instructors provide thorough driving assessments with
        detailed feedback. You’ll know the areas needing improvement to pass
        your test confidently.{" "}
        <Link
          href="/packages"
          className="text-primary font-semibold underline hover:text-primary-focus"
        >
          Book your assessment
        </Link>{" "}
        now to get started.
      </>
    ),
  },
  {
    icon: <FaMapMarkerAlt className="w-8 h-8 text-white" />,
    title: "Pickup and Drop-off",
    description:
      "We offer convenient pickup and drop-off services within Sydney Suburbs and nearby Sydney suburbs. Areas include Rockdale, Bankstown, Newtown, and more, making your lessons hassle-free and time-efficient.",
  },
  {
    icon: <FaCarSide className="w-8 h-8 text-white" />,
    title: "Car Hire for Test Day",
    description:
      "Use our modern vehicles for your driving test with our Test Day Packages. We also rent dual-controlled Kia, Toyota Hybrid, and Nissan cars, ensuring a smooth experience on test day.",
  },
  {
    icon: <FaFileAlt className="w-8 h-8 text-white" />,
    title: "Driving Test Support",
    description:
      "We provide full driving test support, including warm-up lessons and step-by-step guidance. Our instructors help you feel confident, focused, and prepared to pass your test successfully on the day of the exam.",
  },
  {
    icon: <FaGift className="w-8 h-8 text-white" />,
    title: "Lesson Packages",
    description:
      "Save with our 5, 10, or 20-hour lesson packages. You can enjoy structured, high-quality lessons while saving up to $140, giving you more affordable and flexible learning options.",
  },
];
export default function Home() {
  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Hero />
      <FeatureCards />
      <HomeAbout />
      <WhatWeOffer
        sectionTitle={
          "Reliable Services Designed for Your Convenience and Comfort"
        }
        sectionSubtitle={
          "We offer a range of services designed to make your learning experience comfortable, convenient, and safe. Every lesson is structured to enhance confidence and practical driving skills while keeping your needs in mind."
        }
        services={whatWeOfferServices}
      />
      <HomePackage />
      <DrivingTestPackage />
      <DrivingTestAssessment />
      <WhyChooseUs />
      <MovingCar />
      <LocalDrivingLessons />
      <FindInstructor />
      <HomeDrivingJourney />
      <DrivingTipsSection />
      <GoogleReviewCard />
      <Reviews />
      <HowItWorks />
      <BlogSection />
      <Faq />
    </>
  );
}
