"use client";

import Lottie from "lottie-react";
import Container from "@/app/shared/ui/Container";
import carAnimation from "@/app/assets/vehicle.json";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Link from "next/link";
import SecondaryBtn from "@/app/shared/Buttons/SecondaryBtn";
import { FaCheckCircle, FaArrowRight, FaCar, FaAward, FaUserGraduate } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function HomeDrivingJourney() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-primary text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Left Text Column */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-4">
          
              
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Driving Journey
                <span className="block text-accent">Starts Here</span>
              </h2>
              
              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                Transform from a beginner to a confident driver with our expert 
                instructors. Experience personalized lessons in modern vehicles.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {[
                "Expert certified instructors",
                "Modern dual-controlled vehicles",
                "Flexible scheduling options",
                "98% first-time pass rate"
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <FaCheckCircle className="text-green-300" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/book-lesson" className="group">
                <PrimaryBtn className="py-4 bg-accent!">
                  <span className="flex items-center gap-2">
                    Book Your First Lesson
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </PrimaryBtn>
              </Link>
              
              <Link href="/packages" className="group">
                <SecondaryBtn className="py-4">
                  View All Packages
                </SecondaryBtn>
              </Link>
            </div>

          
          </div>

          {/* Right Animation Column */}
          <div className="lg:w-1/2 relative">
            {/* Animated Card Background */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-blue-900/20 rounded-3xl blur-xl"></div>
            
            <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {/* Animation Container */}
              <div className="relative">
                <Lottie
                  animationData={carAnimation}
                  loop={true}
                  className="w-full max-w-lg mx-auto"
                />
             
              </div>

              {/* Progress Bar */}
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Beginner</span>
                  <span className="font-semibold">Confident Driver</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className={`h-full bg-linear-to-r from-green-500 to-primary rounded-full transition-all duration-1000 ${isVisible ? 'w-3/4' : 'w-0'}`}></div>
                </div>
                <p className="text-center text-sm text-blue-200 mt-2">
                  Most students achieve confidence within 15-20 lessons
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}