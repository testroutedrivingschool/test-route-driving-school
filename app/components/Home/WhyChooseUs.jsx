"use client";
import {FaCheck} from "react-icons/fa";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import whyChooseImg from "@/app/assets/whychooseus-test-route-driving-school.jpg";
import SecondaryBtn from "@/app/shared/Buttons/SecondaryBtn";
import {useRouter} from "next/navigation";
export default function WhyChooseUs({className}) {
  const points = [
    {
      title: "Expert Driving Instructors",
      description:
        "Our certified trainers ensure you learn safe and efficient driving skills.",
    },
    {
      title: "Comprehensive Training",
      description:
        "We offer both practical and theoretical lessons to prepare you for real-world driving.",
    },
    {
      title: "License Assistance",
      description:
        "We help you through the driving license application process, making it hassle-free.",
    },
    {
      title: "Modern Vehicles",
      description:
        "Learn to drive with well-maintained, modern vehicles for a smooth experience.",
    },
    {
      title: "Flexible Timing",
      description:
        "Choose from convenient class schedules that fit your routine.",
    },
  ];
  const router = useRouter();
  return (
    <section className={`py-16 ${className} `}>
      <Container>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold ">
              Why Choose{" "}
              <span className="text-primary">Test Route Driving School?</span>
            </h2>
            <p className="text-neutral">
              At Bangladesh Driving Training Institute, we provide professional
              driving lessons along with assistance in obtaining your driving
              license. Here&apos;s why we are the best choice for your driving
              education:
            </p>

            <ul className="flex flex-col gap-4 mt-4">
              {points.map((point, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="shrink-0 w-6 h-6 text-white bg-primary rounded-full flex items-center justify-center mt-1">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {point.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <SecondaryBtn
              onClick={() => router.push("/about")}
              className={`w-full justify-center`}
            >
              Learn More
            </SecondaryBtn>
          </div>

          {/* Right Image */}
          <div className="relative">
            <Image
              src={whyChooseImg}
              alt="Driving Training"
              width={600}
              height={400}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
