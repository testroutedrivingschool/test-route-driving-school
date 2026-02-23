"use client";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import ReviewsCarousel from "../../components/Home/Reviews/ReviewsCarousel";
import MovingCar from "@/app/shared/MovingCar";
import Faq from "@/app/shared/FaqSection";
import Link from "next/link";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {FaStar, FaRegStar, FaStarHalfAlt} from "react-icons/fa";
import Image from "next/image";
import HomeMap from "@/app/shared/ui/HomeMap";

function formatAUDate(date) {
  try {
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

function Stars({rating = 0}) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-1">
      {Array.from({length: full}).map((_, i) => (
        <FaStar key={`f-${i}`} className="text-yellow-400" />
      ))}
      {half ? <FaStarHalfAlt className="text-yellow-400" /> : null}
      {Array.from({length: empty}).map((_, i) => (
        <FaRegStar key={`e-${i}`} className="text-yellow-400" />
      ))}
    </div>
  );
}

const faqs = [
  {
    question: "How many lessons do I need to pass?",
    answer: <>Most learners succeed within 15–30 professional sessions.</>,
  },
  {
    question: "Do you provide pickup and drop-off?",
    answer: <>Yes. We provide door-to-door service in most suburbs.</>,
  },
  {
    question: "Which areas do you cover?",
    answer: <>We serve Kogarah and the surrounding Sydney suburbs.</>,
  },
  {
    question: "What vehicle will I learn in?",
    answer: <>You will train in a modern automatic car.</>,
  },
  {
    question: "Can I book lessons online?",
    answer: <>Yes. Online booking is fast and secure.</>,
  },
];
export default function Testimonials() {
  const {data: reviewsData = [], isLoading} = useQuery({
    queryKey: ["reviews", "website"],
    queryFn: async () => {
      const res = await axios.get("/api/reviews?targetType=website");
      return res.data;
    },
  });
  console.log(reviewsData);
  if (isLoading) return <LoadingSpinner />;
  if (!reviewsData.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No reviews available yet
      </p>
    );
  }
  return (
    <>
      <PageHeroSection
        title="What Our Students Say"
        subtitle={
          <>
            Hear real stories from learners who gained confidence, improved
            driving skills, and passed their tests with ease. Our students share
            how professional guidance helped them feel calm on the road. They
            explain how structured{" "}
            <Link
              href="/services/automatic-driving-lessons"
              className="location-link"
            >
              lessons
            </Link>{" "}
            built strong habits. They highlight how focused training reduced
            test anxiety. Each review reflects real progress and lasting driving
            confidence.
          </>
        }
      />
      <section className="py-16">
        <Container>
          <SectionHeader
            className={`mt-0!`}
            title="Customer Reviews"
            subtitle="Read honest feedback from learners across Sydney suburbs."
          />

          <div>
            {/* Summary card */}
<div className="mt-10 ">
  <div className="rounded-2xl border border-border-color bg-white p-8 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900">
          Students Talk About
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          A quick summary of what learners love most about our lessons.
        </p>
      </div>

     
    </div>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        "Clear instructor communication",
        "Patient teaching methods",
        "Flexible lesson scheduling",
        "Test-focused preparation",
        "Supportive learning environment",
      ].map((t) => (
        <div
          key={t}
          className="flex items-start gap-2 rounded-xl border border-border-color bg-white p-2"
        >
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-700 font-bold">
            ✓
          </span>
          <p className="text-sm text-gray-800 leading-relaxed">{t}</p>
        </div>
      ))}
    </div>

    <p className="mt-6 text-sm text-gray-700 leading-relaxed">
      These reviews show how consistent training leads to safer driving and
      higher pass rates. Real feedback helps new learners choose the right
      driving school.
    </p>
  </div>
</div>

{/* ✅ Reviews  */}
<div className="mt-12 ">
  <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
    <div className="px-7 py-6 border-b border-border-color">
      <h3 className="text-2xl font-extrabold text-gray-900">Latest Reviews</h3>
      <p className="mt-2 text-sm text-gray-600">
        Real feedback from learners across Sydney suburbs.
      </p>
    </div>

    <div className="divide-y divide-border-color">
      {reviewsData.map((r) => {
          const avatarSrc = r?.authorImage
    ? r.authorImage
    : r?.authorImageKey
      ? `/api/storage/proxy?key=${encodeURIComponent(r.authorImageKey)}`
      : "/profile-avatar.png";
        return(
        <div key={r._id} className="px-7 py-7">
          <div className="flex gap-5 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <Image
                width={80}
                height={80}
                src={avatarSrc || "/profile-avatar.png"}
                alt={r.authorName || "Reviewer"}
                className="w-16 h-16 rounded-full object-cover border border-border-color"
                onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<img src="/profile-avatar.png" width="100" height="100" className="h-16 w-16 object-cover border ring-2 text-gray-500" />`;
                  }}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <Stars rating={r.rating} />

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h4 className="text-xl font-extrabold text-gray-900">
                  {r.authorName || "Anonymous"}
                </h4>
                {r.createdAt ? (
                  <span className="text-sm text-gray-500">
                    {formatAUDate(r.createdAt)}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-gray-800 leading-relaxed">
                {r.message || ""}
              </p>
            </div>
          </div>
        </div>
      )})}
    </div>
  </div>

  {/* bottom note */}
  <p className="mt-6 text-sm text-gray-700 leading-relaxed">
    Real feedback helps new{" "}
    <a
      className="location-link"
      href={"https://en.wikipedia.org/wiki/Driver%27s_education"}
      target="_blank"
      rel="noreferrer"
    >
      learners
    </a>{" "}
    choose the right{" "}
    <Link href="/" className="location-link">
      driving school.
    </Link>
  </p>
</div>

          </div>
        </Container>
      </section>
      <MovingCar />

      <Faq
        faqs={faqs}
        subtitle={`Find quick answers about lessons, bookings, and learning support.
`}
      />
          <HomeMap/>
    </>
  );
}
