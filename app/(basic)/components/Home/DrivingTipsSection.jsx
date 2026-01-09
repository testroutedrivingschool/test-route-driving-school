import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import React from "react";
import {
  FaCalendarAlt,
  FaShieldAlt,
  FaChartLine,
  FaCar,
  FaBrain,
  FaAward,
} from "react-icons/fa";

export default function DrivingTipsSection() {
  const tips = [
    {
      title: "Practice Regularly",
      description:
        "Consistent practice is key to building confidence. Drive on varied roads, in various traffic conditions, and navigate challenging parking situations to gain real-world experience while consistently improving safety and control behind the wheel.",
      icon: <FaCalendarAlt className="h-6 w-6" />,
      color: "text-blue-600 bg-blue-50",
      duration: "Ongoing",
    },
    {
      title: "Prioritize Road Safety",
      description:
        "Always follow traffic rules, maintain a safe distance, and be aware of potential hazards. Developing safe driving habits from your first lesson ensures confidence, reduces risk, and prepares you for real-world driving in Kogarah and the Sydney suburbs.",
      icon: <FaShieldAlt className="h-6 w-6" />,
      color: "text-green-600 bg-green-50",
      priority: "High",
    },
    {
      title: "Build Confidence Gradually",
      description:
        "Begin with simple exercises and progress to more complex scenarios, such as city streets, highways, and nighttime driving. Step-by-step practice helps you build confidence and master essential skills efficiently over time.",
      icon: <FaChartLine className="h-6 w-6" />,
      color: "text-purple-600 bg-purple-50",
      level: "Beginner to Advanced",
    },
    {
      title: "Understand Both Manual & Automatic Cars",
      description:
        "Even if learning automatically, understanding manual cars improves overall vehicle control and awareness. Instructors provide clear guidance, helping you become adaptable and confident in handling different vehicles for any situation.",
      icon: <FaCar className="h-6 w-6" />,
      color: "text-amber-600 bg-amber-50",
      type: "Technical",
    },
    {
      title: "Stay Calm and Focused",
      description:
        "Driving requires concentration and composure. Avoid distractions, follow instructions carefully, and take lessons at your own pace. Confidence grows steadily when you remain calm, alert, and focused during every practice session.",
      icon: <FaBrain className="h-6 w-6" />,
      color: "text-teal-600 bg-teal-50",
      focus: "Mental",
    },
    {
      title: "Prepare for Driving Tests",
      description:
        "Learn practical test strategies, including parking, highway driving, and city navigation. Our instructors provide expert guidance, helping you understand requirements, build confidence, and pass your driving test efficiently and successfully.",
      icon: <FaAward className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      goal: "Test Success",
    },
  ];

  return (
    <section className="py-16 bg-base-300">
      <Container>
        {/* Header with subtle gradient */}
        <div className="text-center space-y-6 mb-12">
          <SectionHeader
          className={`mt-0!`}
            title={`Expert Driving Tips & Advice`}
            subtitle={` Learning to drive can be challenging, but with the right guidance, practice, and mindset, 
            you can become a confident and safe driver. Our professional instructors provide expert 
            advice for learners of all levels.`}
          />
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon and title section */}
              <div className="flex items-start space-x-4 mb-4">
                <div
                  className={`p-3 rounded-lg ${tip.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {tip.title}
                  </h3>
                  {/* Tip metadata */}
                  <div className="flex items-center space-x-3 mt-2">
                    {tip.duration && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {tip.duration}
                      </span>
                    )}
                    {tip.priority && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {tip.priority} Priority
                      </span>
                    )}
                    {tip.level && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {tip.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>

              {/* Bottom accent */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Tip #{index + 1}</span>
                  <div className="flex items-center space-x-2">
                    {tip.type && (
                      <span className="font-medium text-gray-700">
                        {tip.type}
                      </span>
                    )}
                    {tip.goal && (
                      <span className="font-medium text-gray-700">
                        {tip.goal}
                      </span>
                    )}
                    {tip.focus && (
                      <span className="font-medium text-gray-700">
                        {tip.focus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
