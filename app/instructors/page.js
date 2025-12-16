"use client"
import Image from "next/image";

import Container from "../shared/ui/Container";
import PrimaryBtn from "../shared/Buttons/PrimaryBtn";
import SectionHeader from "../shared/ui/SectionHeader";
import OutlineBtn from "../shared/Buttons/OutlineBtn";
import { useRouter } from "next/navigation";
import PageHeroSection from "../shared/ui/PageHeroSection";

const instructors = [
  {
    id: 1,
    name: "MD Firoj Hossain",
    experience: "15 years of Driving experience",
    image: "/instructor1.png",
  },
  {
    id: 2,
    name: "John Doe",
    experience: "10 years of Driving experience",
    image: "/instructor1.png",
  },
  {
    id: 3,
    name: "Jane Smith",
    experience: "8 years of Driving experience",
    image: "/instructor1.png",
  },
  {
    id: 4,
    name: "Alex Brown",
    experience: "12 years of Driving experience",
    image: "/instructor1.png",
  },
  {
    id: 5,
    name: "Sara Khan",
    experience: "7 years of Driving experience",
    image: "/instructor1.png",
  },
];

export default function Instructors() {
  const router = useRouter()
  return (
    <section>
      <PageHeroSection title={`Our Instructors`} subtitle={`Our team of skilled and passionate instructors is dedicated to helping you achieve your goals. With years of experience and a commitment to personalized learning, they provide the guidance, support, and motivation you need to master every skill confidently. Whether you’re just starting out or looking to sharpen your abilities, our instructors are here to make your learning journey engaging, effective, and inspiring.`}/>
      <Container className={`pb-16`}>
        <SectionHeader title="Our Instructors" />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <Image
                width={80}
                height={80}
                className="w-full h-56 object-cover"
                src={inst.image}
                alt={inst.name}
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{inst.name}</h2>
                <p className="text-gray-700 mb-2">{inst.experience}</p>
                <div className="flex gap-4 mt-4">
                  <PrimaryBtn className={`text-sm font-medium `}>Book Now</PrimaryBtn>
                  <OutlineBtn  className={`text-sm font-medium `} onClick={()=>router.push(`/instructors/${inst.id}`)}>View Profile</OutlineBtn>
             
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
