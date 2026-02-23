
import Link from "next/link";
import { locationData } from "./locationData/locationData";
import LocationPageClient from "./LocationPageClient";
import { FaCar, FaCarSide, FaClipboardCheck, FaFileAlt, FaGift, FaMapMarkerAlt } from "react-icons/fa";
function formatLocationFromSlug(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
function buildFallback(slug) {
  const loc = formatLocationFromSlug(slug) || "Sydney";

  return {
 mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d504674.47566681314!2d150.59679825606446!3d-33.80042475703519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sbd!4v1771691089561!5m2!1sen!2sbd",
    pageTitle: `Driving Lessons in ${loc} – Book Today`,
    metaDescription:
      `Gain confidence behind the wheel with Driving Lessons in ${loc} – expert instructors, flexible timings. Book now and enjoy stress-free learning!`,
    keywords: [
      `Driving Lessons in ${loc}`,
      `driving lessons near me in ${loc}`,
      `driving lesson in ${loc}`,
      "driving lessons schools",
      "manual driving lessons",
      "learners driving lessons",
     ` car driving lessons near me in ${loc}`,
      "cheap driving lessons",
     `driving school in ${loc}`,
      "driving lessons schools",
      "driving training school near me",
      `affordable driving school in ${loc}`,
      "drivers education school near me",
      `driver education course in ${loc}`,
      "drivers education",
      "driver education",
      "learn to drive schools",
      "manual driving lessons near me",
      "cheap driving lessons near me",
      "Teen driving lessons",
      `book driving lesson in ${loc}`,
    ],
    heroTitle: `Driving Lessons in ${loc}  –  Book Today`,
    heroDescription: (
      <>
        You need a school that understands the local road challenges. Our{" "}
        <Link
          href={`/services/automatic-driving-lessons`}
          className="font-semibold underline px-1"
        >
          Driving Lessons in {loc}
        </Link>
        focus on your safety and success. You will master difficult
        intersections and busy school zones with us. We provide the best tools
        to help you become a licensed driver. Your journey starts here at{" "}
        <Link href={`/about`} className="font-semibold underline px-1">
          Test Route Driving School,
        </Link>
        the local experts.
      </>
    ),

    section1Title: `Why Learners Choose Our Driving Lessons in ${loc}`,
    section1SubTitle: (
      <>
        You deserve an
        <Link href={`/`} className="font-semibold underline px-1">
          affordable driving school
        </Link>{" "}
        in {loc}, NSW that cares. Many students struggle with nerves during
        their first few sessions. We solve this by providing a calm and patient
        learning environment. You will find our driving lessons near me in 
         {loc}, NSW convenient. Our instructors use local knowledge to prepare
        you for the actual test. You will feel confident in facing any traffic
        situation.
      </>
    ),
    section1Features: [
      <>
        Expert <strong>driving school in {loc}, NSW.</strong>
      </>,
      `High first-time test pass rates.`,
      `Flexible booking for busy students.`,
      `Safe, modern dual-controlled training vehicles.`,
    ],
    section2Title: `Service Areas for Driving Lessons in ${loc}`,
    section2SubTitle: (
      <>
        We provide the most reliable
        <strong>learner&apos;s driving lessons</strong> across major suburbs.
        You can access our premium Driving Services in
        <strong> Hurstville, Rockdale</strong> and <strong>Bexley.</strong>
        Our team also reaches learners in Carlton, Arncliffe, and Allawah. You
        will benefit from our door-to-door pick-up and drop-off service. We make
        it easy to <strong>book a driving lesson in {loc}, NSW</strong>now.
        Our <strong>driving training school near me</strong> covers every corner
        of these areas. You will learn to navigate the Princes Highway and local
        streets. We ensure you gain experience in the exact areas where you
        live.
      </>
    ),
    section2Features: [
      <>Professional Automatic Driving Lessons Rockdale.</>,
      <>Comprehensive Highway Package Hurstville.</>,
      <>Local City Driving Package Bexley.</>,
      <>Specialized Night Driving Lesson Carlton.</>,
    ],
    section3Title1: "Master Local Intersections",
    section3Description1: (
      <>
        You will practice at the busy junctions near the {loc} station. Our{" "}
        <strong>driving lesson in {loc}, NSW</strong>, helps you manage
        pedestrian flow. You will learn to time your turns perfectly in traffic.
        We teach you to stay calm when other drivers are in a rush.
      </>
    ),
    section3Title2: "Reliable Test Preparation",
    section3Description2: (
      <>
        You should expect a thorough{" "}
        <strong>driver education course in {loc}, NSW.</strong> We simulate
        the actual RMS testing conditions to build your strength. You will
        identify your common mistakes before the examiner sees them. Our{" "}
        <Link
          href={`/services/driving-test-assessment`}
          className="font-semibold underline px-1"
        >
          Driving Test Assessment
        </Link>{" "}
        ensures you are 100% ready.
      </>
    ),
    services: [
      {
        icon: <FaCar className="w-8 h-8 text-white" />,
        title: `Dual-Controlled Vehicles in ${loc}`,
        description: (
          <>
            You will find our automatic cars very easy to drive. These{" "}
            <strong>car driving lessons near me in {loc}, NSW</strong>are
            suitable for beginners. You can focus on road rules instead of gear
            changes.
          </>
        ),
      },
      {
        icon: <FaClipboardCheck className="w-8 h-8 text-white" />,
        title: `Driving Test Assessment in ${loc}`,
        description: (
          <>
            You need to know if you are ready for your license. Our instructors
            provide a detailed mock test for every student. This helps you fix
            errors and pass on your first attempt.
          </>
        ),
      },
      {
        icon: <FaFileAlt className="w-8 h-8 text-white" />,
        title: `Driving Test Package in ${loc}`,
        description:
          "You get a warm-up session right before your practical driving exam. This package includes a reliable car for your use at the registry. You will feel supported and focused during this high-pressure moment.",
      },
      {
        icon: <FaCarSide className="w-8 h-8 text-white" />,
        title: `Car Hire for Instructor in ${loc}`,
        description:
          "You can rent our professional vehicle for your official test day. Our cars meet all safety requirements and are easy to maneuver. This service removes the stress of finding a suitable car.",
      },
      {
        icon: <FaMapMarkerAlt className="w-8 h-8 text-white" />,
        title: `Parking Package in ${loc}`,
        description: (
          <>
            You will master the art of reverse parallel parking in spaces. Our{" "}
            <strong>cheap driving lessons</strong> focus on the technical points
            of parking. You will develop the spatial awareness necessary for
            navigating any street.
          </>
        ),
      },

      {
        icon: <FaGift className="w-8 h-8 text-white" />,
        title: `Highway Package in ${loc}`,
        description: (
          <>
            You must learn how to merge safely at high speeds. Our{" "}
            <strong>Driving Lessons in {loc}</strong> include specific
            training for the Highway. You will build the confidence to drive
            anywhere in Australia.
          </>
        ),
      },
    ],
    lessonTipsSectionTitle: "Driving Lesson Tips & Advice",
    lessonTips: [
      {
        name: "Monitor Your Speed",
        description: (
          <>
            You must watch for school zones during your teen driving lessons.
            Speed cameras are common in {loc}, so always stay alert. Check our
            expert{" "}
            <a
              href="https://www.nhtsa.gov/ten-tips-for-safe-driving"
              target="_blank"
              className="location-link"
            >
              Resources
            </a>{" "}
            for more tips on avoiding fines.
          </>
        ),
      },
      {
        name: "Check All Mirrors",
        description: (
          <>
            You should scan your mirrors every few seconds while driving. This
            habit is vital for passing your
            <strong>driving test at learn to drive schools.</strong> Proper
            observation prevents accidents and keeps you and others safe.
          </>
        ),
      },
      {
        name: "Practice Smooth Braking",
        description: (
          <>
            You will learn to brake gently to keep your passengers comfortable.
            Our local{" "}
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/Driver%27s_education"
              className="location-link"
            >
              driver&apos;s education
            </a>{" "}
            school emphasizes control and vehicle handling. Avoid sudden stops
            unless it is an emergency on the road.
          </>
        ),
      },
      {
        name: "Understand Right of Way",
        description: (
          <>
            You must know who has the right of way at a busy intersection. Our
            guides explain these complex Australian road rules clearly and
            concisely. Knowing the rules reduces your anxiety and prevents
            dangerous mistakes.
          </>
        ),
      },
    ],
    faqs: [
      {
        question: "Where can I find cheap driving lessons near me?",
        answer: (
          <>
            You can find competitive rates right here at{" "}
            <strong>test route driving school.</strong> We offer a range of
            packages to suit your budget and goals. You get high-quality
            instruction without a massive price tag.
          </>
        ),
      },
      {
        question: "Do you offer manual driving lessons in my area?",
        answer: (
          <>
            We currently specialize in providing the best Automatic Driving
            Lessons. This focus allows us to provide modern vehicles and
            specialized techniques. Most local learners prefer automatic cars
            for their ease.
          </>
        ),
      },
      {
        question:
          "Is your school a registered provider of driver's education? ",
        answer: (
          <>
            You are choosing a professional and fully licensed{" "}
            <strong>driver&apos;s education</strong> team. We follow all
            official guidelines to ensure you receive great training. Our
            background reflects years of local driving expertise.
          </>
        ),
      },
      {
        question: `How do I book a driving lesson in ${loc} today? `,
        answer: (
          <>
            You can simply visit our contact page to secure your slot. We offer
            flexible hours to accommodate students and young professionals. Our
            team will respond to you promptly to confirm.
          </>
        ),
      },
      {
        question: "What makes your driving lessons school different?",
        answer: (
          <>
            You benefit from our deep local expertise and personalized teaching
            style. We don&apos;t just teach you to drive; we teach safety. Our
            student feedback demonstrates the high value learners place on our
            approach.
          </>
        ),
      },
      {
        question:
          "Do you provide manual driving lessons for international holders?",
        answer: (
          <>
            We focus on automatic cars to help you adapt quickly. If you need a{" "}
            <strong>refresher on driver education</strong>, we can help you. Our
            instructors explain local signs and rules clearly and
            straightforwardly.
          </>
        ),
      },
      {
        question: `What is in your driver education course in ${loc}?`,
        answer: (
          <>
            You will cover everything from car control to hazard perception. We
            show our students how to practice these vital skills. We ensure you
            are a safe driver before your test.
          </>
        ),
      },
      {
        question: "Can I get a discount on cheap driving lessons? ",
        answer: (
          <>
            You can save money by purchasing one of our bulk bundles. These
            packages provide the best value for long-term learners. Quality
            safety training should be accessible to everyone in {loc}.
          </>
        ),
      },
    ],
  }}

export async function generateMetadata({ params }) {
   const resolvedParams = await params;



  const slug = Array.isArray(resolvedParams.locations)
    ? resolvedParams.locations[0]
    : resolvedParams.locations;


  const data = locationData[slug];
  if (!data) {
    return {
      title: "Driving Lessons in Sydney | Test Route Driving School",
      description:
        "Professional driving lessons across Sydney suburbs with expert instructors.",
    };
  }

  return {
    title: data.pageTitle,
    description: data.metaDescription,
    keywords: data.keywords,
  };
}

export default async function LocationDetailsPage({ params }) {
  const resolvedParams = await params;



  const slug = Array.isArray(resolvedParams.locations)
    ? resolvedParams.locations[0]
    : resolvedParams.locations;
console.log(slug);

 

  const data = locationData[slug] || buildFallback(slug);

  return <LocationPageClient locationData={data} />;
}
