import galleryImg1 from "@/app/assets/service-lesson-test-route-driving-school.png";
import galleryImg2 from "@/app/assets/test-lesson-test-route-driving-school.png";
import galleryImg3 from "@/app/assets/highway-package-test-route-driving-school.jpg";
import galleryImg4 from "@/app/assets/about-img2.png";
import Image from "next/image";
import galleryImg5 from "@/app/assets/test-route-driving-school-cover.png";
import galleryImg6 from "@/app/assets/car-hire.jpg";
import galleryImg7 from "@/app/assets/test-packageimg2.png";
import galleryImg8 from "@/app/assets/whychooseus-test-route-driving-school.jpg";

import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
import Link from "next/link";
import HomeMap from "@/app/shared/ui/HomeMap";
const galleryImages = [
  {
    id: 1,
    src: galleryImg1,
  },
  {
    id: 2,
    src: galleryImg2,
  },
  {
    id: 3,
    src: galleryImg3,
  },
  {
    id: 4,
    src: galleryImg4,
  },
  {
    id: 5,
    src: galleryImg5,
  },
  {
    id: 6,
    src: galleryImg6,
  },
  {
    id: 7,
    src: galleryImg7,
  },
  {
    id: 8,
    src: galleryImg8,
  },
];
export const metadata = {
  title: "Driving School Gallery – See Real Success",
  description:
    "View real lesson moments, student progress, and training quality. See why learners trust Test Route Driving School. Explore our gallery and book your lesson today.",
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

const whyChoosePoints = [
  {
    title: "Professional Driving Instructors",
    description: "Qualified trainers with real test and road experience.We focus on safety, control, and smart decision-making.",
  },
  {
    title: "Complete Skill-Based Training",
    description: (
      <>
        Lessons cover city driving, highways, parking, and test routes.
 You learn practical and theory-based skills together.

      </>
    ),
  },
  {
    title: "Licence Process Support",
    description:
      "We guide you through every licensing step.From preparation to test day, we stay with you.",
  },
  {
    title: "Modern Dual-Control Vehicles",
    description:
     <>
     Train in clean, safe, and well-maintained automatic cars.
 Dual controls ensure extra    <a
          className="location-link"
          href={"https://www.nhtsa.gov/ten-tips-for-safe-driving"}
          target="_blank"
        >
          safety
        </a> during practice.
     </>,
  },
  {
    title: "Flexible Lesson Scheduling",
    description:
      " Choose lesson times that fit your routine.We offer weekday, evening, and weekend options.",
  },
];

const faqs = [
  {
    question: "What is the pass rate for students at Test Route Driving School?",
    answer: (
      <>
        Test Route Driving School maintains a high first-time pass rate by focusing on specific Vicroads/Service NSW test routes. Our gallery showcases hundreds of successful students who have mastered complex traffic scenarios and gained their licenses on the first attempt.

      </>
    ),
  },
  {
    question: "Can I see the types of cars used for driving lessons?",
    answer: (
      <>
        Yes, our gallery features our modern fleet of dual-controlled vehicles. We use late-model, 5-star ANCAP safety-rated cars (both Automatic and Manual) to ensure students learn in a comfortable, safe, and reliable environment.

      </>
    ),
  },
  {
    question: "Are the instructors at Test Route Driving School qualified?",
    answer: (
      <>
       Every instructor pictured in our gallery is a fully licensed and accredited professional. They specialize in anxiety management and advanced defensive driving techniques, ensuring every student becomes a  <Link
        href={`https://www.nhtsa.gov/ten-tips-for-safe-driving`}
        className="location-link"
        target="_blank"
      >safe, 
      </Link>independent driver.

      </>
    ),
  },
  {
    question: "Do you provide driving lessons for nervous or beginner drivers?",
    answer: (
      <>
      Absolutely. A large portion of our gallery features beginner <Link
        href={`https://en.wikipedia.org/wiki/Driver%27s_education`}
        className="location-link"
        target="_blank"
      >drivers 
      </Link> who started with zero experience. Our &quot;Step-by-Step&quot; curriculum is designed to build confidence gradually, moving from quiet backstreets to busy test routes.

      </>
    ),
  },
  {
    question: "Where can I see real student reviews and success stories?",
    answer: (
      <>
       Our gallery serves as a visual testimonial of our success. Each photo represents a student who has successfully navigated the specific challenges of their local driving test center with the help of our expert instructors.

      </>
    ),
  },
];
export default function Gallery() {
  return (
    <>
      <PageHeroSection
        title={`Our Driving School Gallery`}
        subtitle={<>
      View real moments from our  <Link
        href={`/services/automatic-driving-lessons`}
        className="location-link"
      >
        Driving Lessons
      </Link> practice sessions, and student success stories.
 See how learners grow in confidence, skill, and road awareness through professional training. Each image reflects commitment, safety, and real progress on Sydney roads.
        </>}
      />
      <section className="py-16">
        <Container>
          <SectionHeader
            className={`mt-0!`}
            title={`Our Driving School Gallery`}
            subtitle={<>
        View real moments from our   <Link href="/instructors" className="location-link">
       driving lessons,
        </Link>{" "} practice sessions, and student success stories.
 See how learners grow in confidence, skill, and road awareness through professional training. Each image reflects commitment, safety, and real progress on Sydney roads.
        </>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {galleryImages.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg">
                <Image
                  className="w-full h-50 object-cover hover:scale-110 transition border border-border-color"
                  src={img.src}
                  width={300}
                  height={300}
                  alt="Gallery Img Test Route Driving School"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs title={`Why Choose Test Route Driving School in Sydney Suburbs?
`} subTitle={<>
  <Link href="/" className="location-link">
       Test Route Driving School
        </Link> supports learners with expert guidance and proven teaching methods. We help students gain confidence, pass tests, and drive safely for life. Here’s why learners trust us for quality driving education.

</>} points={whyChoosePoints}/>
      <Faq faqs={faqs}/>
          <HomeMap/>
    </>
  );
}
