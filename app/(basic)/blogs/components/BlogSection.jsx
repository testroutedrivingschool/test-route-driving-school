"use client";

import Link from "next/link";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Image from "next/image";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {usePathname, useRouter} from "next/navigation";
import { blogsData } from "../blogsData";

export default function BlogSection({sectionTitle, sectionSubTitle}) {
  const router = useRouter();
  const pathname = usePathname();
  const blogs = blogsData??[];
  return (
    <section className="py-10 md:py-16">
      <Container>
        <SectionHeader
          className={`mt-0!`}
          title={sectionTitle ? sectionTitle : `Our Driving School Blogs`}
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
            ? blogs.slice(0, 3).map((blog) => (
                <div
                  key={blog.id}
                  className="border border-border-color rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={1000}
                    height={1000}
                    className="w-full  object-cover object-center"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{blog.title}</h3>

                    <p className="text-neutral mb-4 flex-1 ">
                      {blog.excerpt.length > 60
                        ? blog.excerpt.slice(0, 60) + "..."
                        : blog.excerpt || ""}
                    </p>

                    <Link
                      href={`/${blog.slug}`}
                    
                      className="text-primary font-semibold hover:underline mt-auto"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            : blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="border border-border-color rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={1000}
                    height={1000}
                    className="w-full max-h-[220px]   object-cover object-center"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{blog.title}</h3>

                    <p className="text-neutral mb-2 flex-1 ">
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
