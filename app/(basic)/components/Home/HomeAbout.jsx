import Container from "@/app/shared/ui/Container";
import Image from "next/image";
import aboutImg from "@/app/assets/test-route-driving-school-cover.png"; // replace with your image path

export default function HomeAbout() {
  return (
    <section className="py-20 bg-base-300">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Text Content */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">
              About Test Route{" "}
              <span className="text-primary">Driving School</span>
            </h2>

            <p className="text-neutral text-lg leading-relaxed">
              Test Route Driving School has been providing professional driving
              lessons in {/** You can dynamically add location here **/} for
              years. Our certified instructors offer personalized training in
              both automatic and manual cars, focusing on building confidence,
              road safety, and driving test preparation. Whether you are a
              beginner or looking to improve your skills, our driving school
              offers structured lessons to help you succeed on the road.
            </p>

            <h3 className="text-2xl font-bold mt-6">
              Our Mission
            </h3>
            <p className=" text-neutral text-lg">
              Our mission is to create confident, safe, and skilled drivers. We
              believe in combining practical driving skills with road safety
              knowledge, so every learner is fully prepared for real-world
              driving situations and the driving test.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <Image
              src={aboutImg}
              alt="Test Route Driving School"
              className="rounded-xl shadow-lg object-cover w-full h-full"
              width={600}
              height={400}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
