"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Hero() {
  const router = useRouter();
  const [videoReady, setVideoReady] = useState(false);

  const [src, setSrc] = useState("");

  useEffect(() => {
    // start loading after first paint
    const t = setTimeout(() => setSrc("/hero.mp4"), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full min-h-[81vh] overflow-hidden py-25">
      {/* ✅ Poster  */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{backgroundImage: "url(/hero-poster.png)"}}
        poster="/hero-poster.png"
      />

      {/* ✅ Video  */}
      {src && (
        <video
          className={`absolute top-0 left-0 w-full h-full object-cover object-top scale-105 animate-slowZoom transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/hero-poster.png"
          onCanPlay={() => setVideoReady(true)}
        />
      )}

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 animate-fadeUp">
        <h1 className="text-white text-3xl md:text-3xl lg:text-4xl font-extrabold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] max-w-6xl">
          Driving School in Sydney Suburbs | Learn to Drive Safely & Confidently
        </h1>

        <p className="text-gray-200 mt-5 md:text-lg max-w-6xl leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          Join our expert instructors and gain confidence behind the wheel. At{" "}
          <Link href="/" className="location-link">
            Test Route Driving School,
          </Link>{" "}
          we provide structured, safe, and friendly driving lessons in
          Sydney&apos;s suburbs. Whether you&apos;re a beginner or improving
          your skills, our lessons help you feel comfortable on the road. Our
          programs cover both automatic and manual cars, and we tailor every
          session to your pace. You’ll learn city driving, highway skills,
          parking techniques, and more—all designed to prepare you for your
          driving test.
          <Link className="font-medium underline" href={`/packages`}>
            Book your lessons today
          </Link>{" "}
          and start your journey with a trusted driving school near you in
          Sydney Suburbs.
        </p>

        <PrimaryBtn
          onClick={() => router.push("/bookings")}
          className="mt-8 text-lg px-10 py-4 shadow-xl shadow-black/20"
        >
          Book Your First Lesson
        </PrimaryBtn>
      </div>
    </section>
  );
}
