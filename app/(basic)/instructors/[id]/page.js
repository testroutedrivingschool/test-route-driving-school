"use client";
import { useState } from "react";

import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {FaArrowLeft} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";

export const instructorsData = [
  {
    id: 1,
    name: "MD Firoj Hossain",
    experience: "15 years of Driving experience",
    description: `With over 15 years of hands-on experience in driver education, Firoj is a dedicated and highly skilled driving instructor...`,
    image: "/instructor1.png",
    vehicle: "Toyota Corolla, 2025 Model",
    languages: ["English", "Bangali", "Hindi"],
    qualifications: [
      "Certificate IV in Transport and Logistics",
      "Certificate IV in Training and Assessment",
      "Keys2Drive Accredited Instructor",
      "Safer Driver Facilitator",
      "Safer Driver Coach",
      "Train the Trainer",
      "Older Driver Assessor",
    ],
    suburbsCovered: ["Allawah", "Arncliffe", "Banksia", "Bardwell Park","Miranda", "Monterey", "Mortdale", "Peakhurst"],
  },
  {
    id: 2,
    name: "John Doe",
    experience: "10 years of Driving experience",
    description: `John is a patient and experienced driving instructor, specializing in defensive driving and highway skills. He has trained hundreds of learners with a calm and encouraging approach.`,
    image: "/instructor1.png",
    vehicle: "Honda Civic, 2024 Model",
    languages: ["English"],
    qualifications: [
      "Certificate IV in Transport and Logistics",
      "Keys2Drive Accredited Instructor",
      "Safer Driver Facilitator",
    ],
    suburbsCovered: ["Bexley", "Bexley North", "Clemton Park", "Kingsgrove"],
  },
  {
    id: 3,
    name: "Jane Smith",
    experience: "8 years of Driving experience",
    description: `Jane is known for her clear teaching style and attention to detail. She focuses on building learner confidence and instilling safe driving habits from day one.`,
    image: "/instructor1.png",
    vehicle: "Mazda 3, 2023 Model",
    languages: ["English", "Spanish"],
    qualifications: [
      "Certificate IV in Training and Assessment",
      "Keys2Drive Accredited Instructor",
      "Older Driver Assessor",
    ],
    suburbsCovered: ["Rockdale", "Roselands", "Ramsgate", "Ramsgate Beach"],
  },
  {
    id: 4,
    name: "Alex Brown",
    experience: "12 years of Driving experience",
    description: `Alex specializes in teaching nervous or first-time drivers. His calm demeanor and structured lessons make learning easy and stress-free.`,
    image: "/instructor1.png",
    vehicle: "Toyota Camry, 2025 Model",
    languages: ["English", "French"],
    qualifications: [
      "Certificate IV in Transport and Logistics",
      "Safer Driver Coach",
      "Train the Trainer",
    ],
    suburbsCovered: ["Miranda", "Monterey", "Mortdale", "Peakhurst"],
  },
  {
    id: 5,
    name: "Sara Khan",
    experience: "7 years of Driving experience",
    description: `Sara is passionate about road safety and emphasizes practical skills and defensive driving. She is patient, encouraging, and adapts lessons to individual learners.`,
    image: "/instructor1.png",
    vehicle: "Hyundai Elantra, 2024 Model",
    languages: ["English", "Hindi", "Arabic"],
    qualifications: [
      "Certificate IV in Training and Assessment",
      "Keys2Drive Accredited Instructor",
      "Safer Driver Facilitator",
    ],
    suburbsCovered: ["Kogarah", "Kogarah Bay", "Carlton", "Carss Park"],
  },
];

export default function InstructorDetails() {
  const router = useRouter();
  const params = useParams();
  const {id} = params;
  const instructor = instructorsData.find((inst) => inst.id === parseInt(id));
const [search, setSearch] = useState("");

const filteredSuburbs = instructor.suburbsCovered.filter((suburb) =>
  suburb.toLowerCase().includes(search.toLowerCase())
);

  if (!instructor) return <p>Instructor not found.</p>;

  return (
    <>
    <PageHeroSection title={`Meet With Our Instructor`} subtitle={`${instructor.name}`}/>
    <section className="py-10">
      <Container>
        <button
           onClick={() => router.back()}
          className="inline-flex rounded-xl items-center gap-2 bg-primary px-4 py-2 text-white"
        >
          <FaArrowLeft />Go Back
        </button>
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <Image
            width={80}
            height={80}
            src={instructor.image}
            alt={instructor.name}
            className="w-full md:w-1/3 h-full object-cover rounded"
          />
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
            <p className="text-gray-700 font-medium text-lg mb-2">{instructor.experience}</p>
            <p className="text-neutral mb-4">{instructor.description}</p>

            <p className="font-semibold text-lg">Vehicle:</p>
            <p className="mb-2 text-neutral">{instructor.vehicle}</p>

            <p className="font-semibold text-lg">Languages:</p>
            <p className="mb-2 text-neutral">{instructor.languages.join(", ")}</p>

            <p className="font-semibold text-lg">Qualifications:</p>
            <ul className="list-disc list-inside mb-2">
              {instructor.qualifications.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>

            {/* Suburbs Covered Section */}
<div className="mt-10 border-t border-border-color pt-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <h2 className="text-2xl font-bold text-neutral">
      Suburbs Covered
    </h2>

    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
    {filteredSuburbs.map((suburb, index) => (
      <p
        key={index}
        className="text-red-600 hover:underline cursor-pointer"
      >
        {suburb}
      </p>
    ))}
  </div>
</div>

          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
