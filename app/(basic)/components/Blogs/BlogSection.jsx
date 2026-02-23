"use client";
import blogImg1 from "@/app/assets/car-hire.jpg";
import blogImg2 from "@/app/assets/blog2.jpg";
import blogImg3 from "@/app/assets/blog3.jpg";
import Link from "next/link";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Image from "next/image";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {usePathname, useRouter} from "next/navigation";
const blogsData = [
  {
    id: 1,
    title: "5 Essential Driving Tips for Beginners",
    slug: "blogs/5-essential-driving-tips-for-beginners",
    excerpt:
      "Learn the most important driving habits that will keep you safe and confident on the road.",
    image: blogImg1,
    link: "#",
  },
  {
    id: 2,
    title: "How to Master Parallel Parking",
    slug: "blogs/how-to-master-parallel-parking",
    excerpt:
      "Step-by-step guide to improve your parking skills and avoid common mistakes.",
    image: blogImg2,
    link: "#",
  },
  {
    id: 3,
    title: "Manual vs Automatic Cars: Which to Choose?",
    slug: "blogs/manual-vs-automatic-cars-which-to-choose",
    excerpt:
      "Pros and cons of manual and automatic cars to help you make the right decision.",
    image: blogImg3,
    link: "#",
  },
];
export default function BlogSection({sectionTitle, sectionSubTitle}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          className={`mt-0!`}
          title={sectionTitle ? sectionTitle : `Our Driving School Blog`}
          subtitle={
            sectionSubTitle ? (
              sectionSubTitle
            ) : (
              <>
                Stay updated with fresh driving tips,{" "}
                <Link href="/instructors" className="location-link">
                  instructor
                </Link>{" "}
                insights, and learner-focused guidance. Our blog shares
                practical lessons from real test routes, common mistakes, and
                proven success methods. Each post helps you prepare better,
                reduce anxiety, and progress faster toward your licence. Visit
                regularly to sharpen your skills and stay ahead in your
                <a
                  className="location-link"
                  href={"https://en.wikipedia.org/wiki/Driving_Lessons"}
                  target="_blank"
                >
                  learning
                </a>
                journey.
              </>
            )
          }
        />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathname !== "/blogs"
            ? blogsData.slice(0, 3).map((blog) => (
                <div
                  key={blog.id}
                  className="border border-border-color rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>

                    <p className="text-neutral mb-4 flex-1 ">
                      {blog.excerpt.length > 60
                        ? blog.excerpt.slice(0, 60) + "..."
                        : blog.excerpt || ""}
                    </p>

                    <Link
                      href={`/${blog.slug}`}
                      aria-label={` Read the full article: ${blog.title}`}
                      className="text-primary font-semibold hover:underline mt-auto"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            : blogsData.map((blog) => (
                <div
                  key={blog.id}
                  className="border border-border-color rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>

                    <p className="text-neutral mb-4 flex-1 ">
                      {blog.excerpt.length > 60
                        ? blog.excerpt.slice(0, 60) + "..."
                        : blog.excerpt || ""}
                    </p>

                    <Link
                      href={`/${blog.slug}`}
                      aria-label={` Read the full article: ${blog.title}`}
                      className="text-primary font-semibold hover:underline mt-auto"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
          {}
        </div>
        {pathname !== "/blogs" && (
          <div className="mt-6 flex justify-center">
            <PrimaryBtn onClick={() => router.push("/blogs")}>
              View All
            </PrimaryBtn>
          </div>
        )}
      </Container>
    </section>
  );
}
