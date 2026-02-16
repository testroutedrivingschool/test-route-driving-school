import blogImg1 from "@/app/assets/car-hire.jpg";
import blogImg2 from "@/app/assets/blog2.jpg";
import blogImg3 from "@/app/assets/blog3.jpg";
import Link from "next/link";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Image from "next/image";
const blogsData = [
  {
    id: 1,
    title: "5 Essential Driving Tips for Beginners",
    slug: "5-essential-driving-tips-for-beginners",
    excerpt:
      "Learn the most important driving habits that will keep you safe and confident on the road.",
    image: blogImg1,
    link: "#",
  },
  {
    id: 2,
    title: "How to Master Parallel Parking",
    slug: "how-to-master-parallel-parking",
    excerpt:
      "Step-by-step guide to improve your parking skills and avoid common mistakes.",
    image: blogImg2,
    link: "#",
  },
  {
    id: 3,
    title: "Manual vs Automatic Cars: Which to Choose?",
    slug: "manual-vs-automatic-cars-which-to-choose",
    excerpt:
      "Pros and cons of manual and automatic cars to help you make the right decision.",
    image: blogImg3,
    link: "#",
  },
];
export default function BlogSection() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          className={`mt-0!`}
          title={`Our Blog`}
          subtitle={`Stay updated with the latest tips and insights from the world of driving. Visit our blog for helpful guides and the latest updates.`}
        />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsData.map((blog) => (
            <div
              key={blog.id}
              className="border border-border-color rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <Image
                src={blog.image}
                alt={blog.title}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-neutral mb-4">{blog.excerpt}</p>
                <Link
                  href={`/blogs/${blog.slug}`}
                  aria-label={` Read the full article: ${blog.title}`}
                  className="text-primary font-semibold hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
