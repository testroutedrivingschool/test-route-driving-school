import Container from "@/app/shared/ui/Container";
import Image from "next/image";
import aboutImg from "@/app/assets/test-route-driving-school-cover.png"; 

export default function HomeAbout() {
  return (
    <section className="py-20 bg-base-300">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Text Content */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">
              About Test Route Driving School
              <span className="text-primary"> in Sydney suburbs</span>
            </h2>

            <p className="text-neutral text-lg leading-relaxed">
              Test Route Driving School has been providing professional driving lessons in Sydney suburbs for years. Our certified instructors focus on building your confidence, road safety, and test readiness. We provide personalized training in manual and automatic vehicles, ensuring you gain practical skills for all driving situations. From high school students to adults seeking a license, we design every lesson to ensure success. Learn more about our <a href="https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/driver-licence-tests/driving-test" className="location-link" target="_blank">instructors</a> and their expertise to find the perfect match for your learning style.
            </p>

            <h3 className="text-2xl font-bold mt-6">
              Our Mission at Your Sydney suburbs Driving School
            </h3>
            <p className=" text-neutral text-lg">
              Our mission is to create confident, safe, and skilled drivers. We
              combine practical driving skills with road safety knowledge, so
              you are fully prepared for real-world driving scenarios and your
              driving test. With a focus on driving lessons in Sydney suburbs, we
              ensure every student gets expert guidance and a supportive
              learning environment. Your journey to becoming a safe driver
              starts here.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-auto md:flex-1">
            <Image
              src={aboutImg}
              alt="Test Route Driving School Cover"
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
