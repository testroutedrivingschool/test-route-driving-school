"use client";
import Image from "next/image";
import carImg from "@/app/assets/car.png";
import carRoad from "@/app/assets/road.png";

export default function MovingCar({className}) {
  return (
    <div
      className={`overflow-hidden relative w-full bg-[#464F5D] h-25 ${className}`}
    >
         <svg className="absolute top-1/2 w-full h-5">
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
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-moveCar">
        <Image width={120} height={120} src={carImg} alt="Car" />
      </div>
    </div>
  );
}
