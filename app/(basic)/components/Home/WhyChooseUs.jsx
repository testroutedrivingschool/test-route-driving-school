"use client";
import {FaCheck} from "react-icons/fa";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import whyChooseImg from "@/app/assets/whychooseus-test-route-driving-school.jpg";
import SecondaryBtn from "@/app/shared/Buttons/SecondaryBtn";
import {useRouter} from "next/navigation";
export default function WhyChooseUs({className,title, subTitle, points}) {
  const defaultPoints = [
    {
      title: "Expert Driving Instructors",
      description:
        "Certified trainers who teach safe and efficient driving skills.",
    },
    {
      title: "Comprehensive Training",
      description:
        "Practical and theoretical lessons covering all driving scenarios.",
    },
    {
      title: "License Assistance",
      description:
        "Guidance through the Australian license process, making it hassle-free.",
    },
    {
      title: "Modern Vehicles",
      description:
        "Learn in well-maintained, dual-controlled cars for a smooth experience.",
    },
    {
      title: "Flexible Timing",
      description: "Convenient schedules tailored to your lifestyle.",
    },
  ];
  const router = useRouter();
  return (
    <section className={`py-16 ${className} `}>
      <Container>
        <div className="flex flex-col md:flex-row gap-10 items-center ">
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-4">
         <h2 className="text-2xl md:text-4xl font-bold">
  {title ? (
    title
  ) : (
    <>
      Why Choose Test Route Driving School
      <span className="text-primary"> in Sydney Suburbs?</span>
    </>
  )}
</h2>
            <p className="text-neutral">
              {subTitle
                ? subTitle
                : ` At Test Route Driving School, We are one of the top driving schools near me in Sydney Suburbs for learners seeking expert guidance. Here's why we are the best choice for your driving education:`}
            </p>

            <ul className="flex flex-col gap-4 mt-4">
              {points
                ? points.map((point, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="shrink-0 w-6 h-6 text-white bg-primary rounded-full flex items-center justify-center mt-1">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {point.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {point.description}
                        </p>
                      </div>
                    </li>
                  ))
                : defaultPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="shrink-0 w-6 h-6 text-white bg-primary rounded-full flex items-center justify-center mt-1">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {point.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {point.description}
                        </p>
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
          <div className="w-full md:flex-1 md:w-auto relative">
            <Image
              src={whyChooseImg}
              alt="Driving Training Test Route Driving School"
              width={1000}
              height={1000}
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
