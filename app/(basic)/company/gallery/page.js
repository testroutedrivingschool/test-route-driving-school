import galleryImg1 from "@/app/assets/service-lesson-test-route-driving-school.png";
import galleryImg2 from "@/app/assets/test-lesson-test-route-driving-school.png";
import galleryImg3 from "@/app/assets/highway-package-test-route-driving-school.jpg";
import galleryImg4 from "@/app/assets/about-img2.png";
import Image from "next/image";
import galleryImg5 from "@/app/assets/test-route-driving-school-cover.png";
import galleryImg6 from "@/app/assets/car-hire.jpg";
import galleryImg7 from "@/app/assets/test-packageimg2.png";
import galleryImg8 from "@/app/assets/whychooseus-test-route-driving-school.jpg";

import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import MovingCar from "@/app/shared/MovingCar";
import WhyChooseUs from "../../components/Home/WhyChooseUs";
import Faq from "@/app/shared/FaqSection";
const galleryImages = [
  {
    id: 1,
    src: galleryImg1,
  },
  {
    id: 2,
    src: galleryImg2,
  },
  {
    id: 3,
    src: galleryImg3,
  },
  {
    id: 4,
    src: galleryImg4,
  },
  {
    id: 5,
    src: galleryImg5,
  },
  {
    id: 6,
    src: galleryImg6,
  },
  {
    id: 7,
    src: galleryImg7,
  },
  {
    id: 8,
    src: galleryImg8,
  },
];
export default function Gallery() {
  return (
    <>
      <PageHeroSection
        title={`Our Gallery`}
        subtitle={`Explore moments from our driving lessons, training sessions, and successful journeys with our students`}
      />
      <section className="py-16">
        <Container>
          <SectionHeader
            className={`mt-0!`}
            title={`Our Gallery`}
            subtitle={`Explore moments from our driving lessons, training sessions, and successful journeys with our students`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {galleryImages.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg">
                <Image
                  className="w-full h-50 object-cover hover:scale-110 transition border border-border-color"
                  src={img.src}
                  width={300}
                  height={300}
                  alt="Gallery Img Test Route Driving School"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <MovingCar />
      <WhyChooseUs />
      <Faq />
    </>
  );
}
