"use client";
import Container from "@/app/shared/ui/Container";
import CountUp from "react-countup";
import {
  FaStar,
  FaUserGraduate,
  FaCarSide,
  FaChalkboardTeacher,
  FaAward,
} from "react-icons/fa";
import {useEffect, useRef, useState} from "react";
import SectionHeader from "@/app/shared/ui/SectionHeader";

const features = [
  {
    id: 1,
    title: "Google Rating",
    value: 4.9,
    isFloat: true,
    suffix: "★",
    icon: <FaStar />,
    color: "from-yellow-400 to-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    description: "Rated by 850+ students",
  },
  {
    id: 2,
    title: "Students Trained",
    value: 2500,
    suffix: "+",
    icon: <FaUserGraduate />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    description: "Happy learners",
  },
  {
    id: 3,
    title: "Successful Drivers",
    value: 12000,
    suffix: "+",
    icon: <FaCarSide />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    description: "Licensed drivers",
  },
  {
    id: 4,
    title: "Expert Instructors",
    value: 5,
    suffix: "+",
    icon: <FaChalkboardTeacher />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    description: "Certified professionals",
  },
];

export default function FeatureCards() {
  const sectionRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      {threshold: 0.3},
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-17">
      <Container>
        <SectionHeader
          className={`mt-0!`}
          title="Trusted by Thousands of Drivers"
          subtitle="Years of excellence in driver education with proven results and satisfied students"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => (
            <div key={item.id} className="group relative">
              {/* Glow */}
              <div
                className={`absolute inset-0 ${item.color} opacity-20 blur-xl rounded-2xl`}
              ></div>

              {/* Main card */}
              <div
                className={`relative bg-white p-6 rounded-xl shadow-lg border border-border-color hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-4 `}
                >
                  <div
                    className={`text-2xl ${
                      item.color.replace("from-", "text-").split(" ")[0]
                    }`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* CountUp */}
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {startCount ? (
                    item.isFloat ? (
                      <CountUp
                        end={item.value}
                        decimals={1}
                        duration={2.5}
                        separator=","
                      />
                    ) : (
                      <CountUp end={item.value} duration={2.5} separator="," />
                    )
                  ) : item.isFloat ? (
                    "0.0"
                  ) : (
                    "0"
                  )}
                  <span
                    className={`text-3xl ml-1 ${
                      item.color.replace("from-", "text-").split(" ")[0]
                    }`}
                  >
                    {item.suffix}
                  </span>
                </h3>

                {/* Title + Desc */}
                <h4 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-neutral text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
