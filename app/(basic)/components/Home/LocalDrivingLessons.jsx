import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import localDrivingImg from "@/app/assets/local-driving-lesson-test-route-driving-school.png";
import Image from "next/image";

export default function LocalDrivingLessons() {
  const location = "Kogarah NSW";

  return (
    <section className="py-20 bg-primary/10">
      <Container>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Left Text Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              Professional Driving Lessons in{" "}
              <span className="text-primary">{location}</span>
            </h2>

            <p className="text-neutral text-lg leading-relaxed">
              Looking for reliable and professional driving lessons in {location}? At Test Route Driving School, we offer both automatic and manual driving lessons designed to suit beginners, learners, and those preparing for their driving test. Our certified instructors focus on building confidence, road safety, and practical driving skills to ensure a smooth learning experience.
            </p>

            <p className="text-neutral text-lg leading-relaxed">
              Whether you want to master city streets, highway driving, or parking techniques, our structured driving programs in {location} provide everything you need to become a safe and confident driver.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <PrimaryBtn>Book a Lesson</PrimaryBtn>
              <OutlineBtn>Learn More</OutlineBtn>
            </div>
          </div>

          {/* Right Image */}
          <div className="rounded-xl flex-1 flex justify-center">
            <Image
              src={localDrivingImg}
              width={500}
              height={500}
              alt="Local Driving Lesson Test Route Driving School"
              className="object-cover w-full h-full rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Enhanced SEO Section */}
<div className="mt-16 p-12 rounded-xl shadow-2xl  space-y-8" 
     style={{ background: 'linear-gradient(135deg, #301b92 0%, #4623c2 100%)', color: '#ffffff' }}>
  
  <h3 className="text-2xl md:text-4xl font-extrabold text-center">
    Benefits of Local Driving Lessons in Sydney Suburbs New South Wales
  </h3>

  <p className="text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
    Learning to drive in Sydney New South Wales with Test Route Driving School comes with many advantages. Our lessons are designed to make you a confident, safe, and skilled driver for all types of roads.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl shadow-md hover:shadow-xl transition">
      <span className="text-3xl font-bold text-accent">✔</span>
      <p className="text-white text-base">
        Learn local traffic rules and road conditions specific to Sydney, New South Wales.
      </p>
    </div>

    <div className="flex items-start gap-4 bg-white/10 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <span className="text-3xl font-bold text-accent">✔</span>
      <p className="text-white text-base">
        Personalized lessons tailored to your skill level and learning pace.
      </p>
    </div>

    <div className="flex items-start gap-4 bg-white/10 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <span className="text-3xl font-bold text-accent">✔</span>
      <p className="text-white text-base">
        Gain experience in city streets, highways, parking, and night driving.
      </p>
    </div>

    <div className="flex items-start gap-4 bg-white/10 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <span className="text-3xl font-bold text-accent">✔</span>
      <p className="text-white text-base">
        Flexible schedules with professional instructors who guide you step by step.
      </p>
    </div>
  </div>

  <p className="text-lg md:text-xl leading-relaxed text-center mt-8 max-w-2xl mx-auto">
    Hundreds of learners in Sydney have successfully passed their driving tests with our structured local lessons. Start your journey today!
  </p>
</div>


      </Container>
    </section>
  );
}
