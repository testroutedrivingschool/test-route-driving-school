"use client";
import Image from "next/image";
import carImg from "@/app/assets/car.png";

export default function MovingCar({ className }) {
  return (
    <div className={`overflow-hidden relative w-full bg-[#464F5D] h-24 ${className}`}>
      
      {/* Road line */}
      <svg className="absolute top-14 w-full h-5 -translate-y-1/2">
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke="white"
          strokeWidth="6"
          strokeDasharray="10,5"
        />
      </svg>

      {/* Moving Car */}
      <div className="absolute top-1/2 -translate-y-1/2 animate-moveCar">
        <Image
          src={carImg}
          alt="Car"
          width={120}
          height={60}
        />
      </div>
    </div>
  );
}
