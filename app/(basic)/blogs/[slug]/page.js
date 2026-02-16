"use client";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";
import blogImg1 from "@/app/assets/car-hire.jpg";
import blogImg2 from "@/app/assets/blog2.jpg";
import blogImg3 from "@/app/assets/blog3.jpg";
import {useParams, useRouter} from "next/navigation";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";

const blogs = [
  {
    id: 1,
    title: "5 Essential Driving Tips for Beginners",
    slug: "5-essential-driving-tips-for-beginners",
    excerpt:
      "Learn the most important driving habits that will keep you safe and confident on the road.",
    content: [
      `Driving can be challenging for beginners, especially when you're learning the rules of the road and trying to develop confidence behind the wheel. Here are five essential driving tips every beginner should follow:`,
      {
        type: "list",
        items: [
          "**Maintain a Safe Following Distance**: Always keep a safe distance from the vehicle in front of you. This allows enough time to react in case of sudden stops or emergencies.",
          "**Check Blind Spots Regularly**: Get into the habit of checking your mirrors and blind spots before changing lanes. Many accidents happen because drivers neglect this simple step.",
          "**Practice Defensive Driving**: Always anticipate potential hazards. Pay attention to other drivers, pedestrians, and road signs. Being proactive can help you avoid accidents.",
          "**Learn Proper Vehicle Control**: Practice smooth acceleration, braking, and steering. Understanding how your car responds in different situations is crucial for safe driving.",
          "**Stay Calm and Focused**: Avoid distractions like phones or loud music. Keeping calm and focused helps you make better decisions on the road.",
        ],
      },
      `By practicing these tips consistently, you’ll develop the skills and confidence needed to become a safe and responsible driver. Remember, driving is a lifelong learning process, and continuous practice is key to improvement.`,
    ],
    image: blogImg1,
  },
  {
    id: 2,
    title: "How to Master Parallel Parking",
    slug: "how-to-master-parallel-parking",
    excerpt:
      "Step-by-step guide to improve your parking skills and avoid common mistakes.",
    content: [
      `Parallel parking is a skill that intimidates many drivers, but with practice, it can become second nature. Follow this step-by-step guide to master parallel parking:`,
      {
        type: "list",
        items: [
          "**Choose a Suitable Space**: Find a space that is slightly longer than your car. Avoid tight spots until you gain confidence.",
          "**Position Your Car**: Pull up alongside the car in front of the parking space, aligning your rear bumper with theirs.",
          "**Reverse Slowly**: Turn your steering wheel towards the curb while reversing slowly. Keep checking your mirrors and blind spots.",
          "**Adjust as Needed**: Once your car is at a 45-degree angle, straighten the wheels and continue reversing. Make small adjustments to align your car perfectly within the space.",
          "**Final Check**: Make sure your car is centered, not too close to the curb, and not obstructing traffic.",
        ],
      },
      `Regular practice in different parking situations will make this process easier. Remember, patience and slow movements are the key to perfect parallel parking.`,
    ],
    image: blogImg2,
  },
  {
    id: 3,
    title: "Manual vs Automatic Cars: Which to Choose?",
    slug: "manual-vs-automatic-cars-which-to-choose",
    excerpt:
      "Pros and cons of manual and automatic cars to help you make the right decision.",
    content: [
      `Choosing between a manual and an automatic car is an important decision for new drivers. Each has its own advantages and challenges:`,
      {
        type: "list",
        items: [
          "**Manual Cars**:",
          "- **Pros**: Typically cheaper, better control over the vehicle, more fuel-efficient in some cases, and great for learning essential driving skills.",
          "- **Cons**: Can be difficult in heavy traffic, requires constant clutch and gear use, and can be tiring for beginners.",
          "**Automatic Cars**:",
          "- **Pros**: Easier to drive, especially in stop-and-go traffic, less stressful for beginners, and convenient for city driving.",
          "- **Cons**: Usually more expensive, less control over engine power, and may be less fuel-efficient in some models.",
        ],
      },
      `When deciding, consider your driving environment, budget, and long-term goals. If you plan to drive in congested city areas, an automatic may be more comfortable. If you enjoy more control and want to save on initial costs, a manual car could be ideal.`,
      `Ultimately, understanding the pros and cons of each type helps you make an informed decision and ensures a smooth and enjoyable driving experience.`,
    ],
    image: blogImg3,
  },
];

export default function BlogDetails() {
  const {slug} = useParams();
  const router = useRouter();
  const blogData = blogs.find((blog) => blog.slug == slug);

  if (!blogData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Blog Not Found</h2>
        <p className="mt-2 text-neutral">
          The blog you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeroSection title={blogData.title} subtitle={blogData.excerpt} />

      <section className="py-16 bg-base-300">
        <Container>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Blog Image */}
            <div className="relative w-full h-80 md:h-[400px]">
              <Image
                src={blogData.image.src}
                alt={blogData.title}
                fill
                className="object-cover w-full h-full"
              />
            </div>

            {/* Blog Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {blogData.title}
              </h1>

              {/* Content */}
              <div className="prose prose-lg max-w-full text-gray-700 mb-8">
                {blogData.content.map((section, index) => {
                  if (typeof section === "string") {
                    return <p key={index}>{section}</p>;
                  } else if (section.type === "list") {
                    return (
                      <ul key={index} className="list-disc list-inside mb-4">
                        {section.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                })}
              </div>

              {/* Back Button */}
              <PrimaryBtn onClick={() => router.push("/blogs")}>
                ← Back to Blogs
              </PrimaryBtn>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
