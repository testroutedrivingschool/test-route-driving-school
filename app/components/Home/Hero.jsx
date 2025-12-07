import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">

      {/* Background Video with Zoom Animation */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover scale-105 animate-slowZoom"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 animate-fadeUp">

        {/* Main Heading */}
        <h1
          className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
        >
          Master Your Driving Skills
        </h1>

        {/* Subtitle */}
        <p className="text-gray-200 mt-5 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          Join our expert instructors and gain confidence behind the wheel with
          safe, friendly, and structured driving lessons.
        </p>

        {/* CTA Button */}
        <PrimaryBtn className="mt-8 text-lg px-10 py-4 shadow-xl shadow-black/20">
          Book Your First Lesson
        </PrimaryBtn>
      </div>
    </section>
  );
}
