import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import ReviewsCarousel from "../../components/Home/Reviews/ReviewsCarousel";
import MovingCar from "@/app/shared/MovingCar";
import Faq from "@/app/shared/Faq";


export default function Testimonials() {
  return (
    <>
      <PageHeroSection
        title="What Our Students Say"
        subtitle="Real experiences from learners who built confidence, mastered driving skills, and passed their tests with Test Route Driving School."
      />
      <section className="py-16">
        <Container>
          <SectionHeader
          className={`mt-0!`}
            title="Customer Reviews"
            subtitle="Honest feedback from our students sharing their learning experience, progress, and driving test success with Test Route Driving School."
          />
           <ReviewsCarousel />
        </Container>
      </section>
      <MovingCar />

      <Faq />
    </>
  );
}
