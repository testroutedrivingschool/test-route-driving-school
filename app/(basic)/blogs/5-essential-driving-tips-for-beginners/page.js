import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import blogImg16 from "@/app/assets/car-hire.jpg";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Link from "next/link";


export const metadata = {
  title: "5 Essential Driving Tips for Beginners",
  description:
    "Learn the most important driving habits that will keep you safe and confident on the road.",
  keywords: [
    "5 Essential Driving Tips for Beginners",
    "NSW driving test process",
    "NSW practical driving test steps",
    "driving test NSW checklist",
    "how long is the NSW driving test",
    "test day requirements NSW",
    "driving test centre",
    "test day requirements NSW",
    "Driving Test Manoevres",
    "booking the driving test",
    "Driving skills assessed",
  ],
};
const blogItems = [
  "**Maintain a Safe Following Distance**: Always keep a safe distance from the vehicle in front of you. This allows enough time to react in case of sudden stops or emergencies.",
  "**Check Blind Spots Regularly**: Get into the habit of checking your mirrors and blind spots before changing lanes. Many accidents happen because drivers neglect this simple step.",
  "**Practice Defensive Driving**: Always anticipate potential hazards. Pay attention to other drivers, pedestrians, and road signs. Being proactive can help you avoid accidents.",
  "**Learn Proper Vehicle Control**: Practice smooth acceleration, braking, and steering. Understanding how your car responds in different situations is crucial for safe driving.",
  "**Stay Calm and Focused**: Avoid distractions like phones or loud music. Keeping calm and focused helps you make better decisions on the road.",
];
export default function Blog16() {

  return (
    <>
      <PageHeroSection
        title={"5 Essential Driving Tips for Beginners"}
        subtitle={
          "Learn the most important driving habits that will keep you safe and confident on the road."
        }
      />

      <section className="py-16 bg-base-300">
        <Container>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Blog Image */}
            <div className="relative w-full h-80 md:h-[700px]">
              <Image
                src={blogImg16}
                alt={"5 Essential Driving Tips for Beginners"}
                fill
                className="object-cover w-full h-full object-center"
              />
            </div>

            {/* Blog Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                5-essential-driving-tips-for-beginners
              </h1>
              <p className="text-neutral mb-6">
                Driving can be challenging for beginners, especially when
                you&apos;re learning the rules of the road and trying to develop
                confidence behind the wheel. Here are five essential driving
                tips every beginner should follow:
              </p>
              {/* Content */}
              <div className="prose prose-lg max-w-full text-gray-700 mb-8">
                <ul className="list-disc list-inside mb-4">
                  {blogItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <p  className="text-neutral mb-6">By practicing these tips consistently, you’ll develop the skills and confidence needed to become a safe and responsible driver. Remember, driving is a lifelong learning process, and continuous practice is key to improvement.</p>

<Link href={`/blogs`}>

              <PrimaryBtn>
                ← Back to Blogs
              </PrimaryBtn>
</Link>
          
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
