import Container from "@/app/shared/ui/Container";
import ReviewsCarousel from "./ReviewsCarousel";
import SectionHeader from "@/app/shared/ui/SectionHeader";

export default function Reviews() {
  return (
    <section className="py-10 bg-white">
      <Container>
        <SectionHeader
          title="What Our Students Say"
          subtitle="See why hundreds of learners trust our driving instructors for safe,
            supportive, and confidence–building driving lessons across the area."
        />

        {/* Carousel */}
        <ReviewsCarousel />
      </Container>
    </section>
  );
}
