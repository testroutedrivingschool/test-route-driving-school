"use client";

import {useMemo, useState} from "react";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {FaArrowLeft} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Link from "next/link";

export default function InstructorDetails() {
  const router = useRouter();
  const {id} = useParams();
  const [search, setSearch] = useState("");
  console.log(id);
  const {
    data: instructor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructor", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axios.get(`/api/instructors/${id}`);
      return res.data;
    },
  });
  console.log(instructor);
  const avatarSrc = useMemo(() => {
    if (!instructor) return "/profile-avatar.png";
    if (instructor.photo) return instructor.photo;
    if (instructor.photoKey)
      return `/api/storage/proxy?key=${encodeURIComponent(instructor.photoKey)}`;
    return "/profile-avatar.png";
  }, [instructor]);

  const suburbsList = useMemo(() => {
    const arr = Array.isArray(instructor?.suburbs) ? instructor.suburbs : [];
    return arr
      .map((s) => (typeof s === "string" ? s : s?.name))
      .filter(Boolean);
  }, [instructor]);

  const filteredSuburbs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suburbsList;
    return suburbsList.filter((name) => name.toLowerCase().includes(q));
  }, [search, suburbsList]);

  const qualificationChips = useMemo(() => {
    const raw = String(instructor?.qualifications || "").trim();
    if (!raw) return [];
    // supports: "A, B, C" or "A\nB\nC"
    return raw
      .split(/\n|,/g)
      .map((x) => x.trim())
      .filter(Boolean);
  }, [instructor]);

  if (isLoading) return <LoadingSpinner />;

  if (isError || !instructor) {
    return (
      <>
        <PageHeroSection
          title="Meet With Our Instructor"
          subtitle="Not Found"
        />
        <section className="py-10">
          <Container>
            <button
              onClick={() => router.back()}
              className="inline-flex rounded-xl items-center gap-2 bg-primary px-4 py-2 text-white"
            >
              <FaArrowLeft /> Go Back
            </button>
            <p className="mt-6 text-primary font-semibold">
              Instructor not found.
            </p>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeroSection
        title="Meet With Our Instructor"
        subtitle={instructor?.name || ""}
      />

      <section className="py-10">
        <Container>
          <button
            onClick={() => router.back()}
            className="inline-flex rounded-xl items-center gap-2 bg-primary px-4 py-2 text-white"
          >
            <FaArrowLeft /> Go Back
          </button>

          {/* Top layout like screenshot: left profile + right car card */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Profile */}
            <div className="lg:col-span-8  rounded-md p-5 bg-white">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-[220px]">
                  <Image
                    width={1000}
                    height={1000}
                    src={avatarSrc}
                    alt={instructor?.name || "Instructor"}
                    className="w-full object-cover rounded"
                  />
                  <PrimaryBtn
                    onClick={() => router.push("/bookings")}
                    className={`mt-4 w-full! text-center! justify-center!  text-xl!`}
                  >
                    Book Now
                  </PrimaryBtn>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {instructor?.name}
                  </h1>

                  <p className="mt-3 text-neutral leading-relaxed">
                    With over 15 years of hands-on experience in driver
                    education, Firoj is a dedicated and highly skilled driving
                    instructor committed to promoting road safety and
                    responsible driving habits. Known for a patient, calm, and
                    encouraging teaching style, he has successfully trained
                    hundreds of new drivers-from nervous beginners to confident,
                    competent motorists. <br /> <br />
                    Firoj&apos;s passion lies in not just helping learners pass
                    their driving test, but in equipping them with the
                    knowledge, skills, and mindset to drive safely for life. He
                    takes pride in creating a supportive learning environment
                    where students feel comfortable, confident, and empowered
                    behind the wheel.
                    <br /> <br />
                    Whether teaching basic driving techniques, highway skills,
                    or defensive driving strategies, Firoj tailors each lesson
                    to suit the individual needs of the learner. With a deep
                    understanding of road rules, traffic laws, and safety
                    protocols, he ensures every student leaves with a strong
                    foundation for a lifetime of safe driving.
                    <br />
                    <br />
                    My goal is to help every learner become a safe, confident,
                    and responsible driver. I believe that safe driving is not
                    just a skill, but a lifelong responsibility—and I’m proud to
                    play a role in shaping safer roads for everyone.
                  </p>

                  {/* Spoken languages */}
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Spoken Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(instructor?.languages || ["English"]).map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 rounded border border-border-color text-sm bg-gray-50"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Qualification
                    </h3>

                    {qualificationChips.length ? (
                      <div className="flex flex-wrap gap-2">
                        {qualificationChips.map((q, i) => (
                          <span
                            key={`${q}-${i}`}
                            className="px-3 py-1 rounded border border-border-color text-sm bg-gray-50"
                          >
                            {q}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral text-sm">
                        No qualification added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Car / partner card */}
            <div className="lg:col-span-4  rounded-md p-5 bg-white">
              <h3 className="font-bold text-2xl text-gray-900">
                {instructor?.name?.split(" ")?.[1] || "Instructor"}’s Driving
                partner
              </h3>

              <div className="mt-4 rounded-md overflow-hidden border border-border-color">
                <div className="relative w-full  bg-gray-100">
                  <Image
                    src="/car-placeholder.png"
                    alt="Car"
                    width={800}
                    height={800}
                    className="object-cover w-50 mx-auto h-full"
                  />
                </div>
                <div className="py-4 space-y-2 text-sm bg-gray-100 px-4 text-center">
                  <h2 className="font-bold text-lg ">Vehicle information:</h2>
                  <span className="text-gray-900 font-medium ">
                    {instructor?.vehicleModel?.trim() || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Suburbs Covered */}
          <div className="mt-4 border-t border-border-color pt-6 col-span-full w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Suburbs Covered
              </h2>

              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {filteredSuburbs.length === 0 ? (
              <p className="text-neutral text-sm">No suburbs found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
                {filteredSuburbs.map((suburb, index) => (
                  <Link key={index} href={`/bookings`}>
                    <p
                      className="text-primary hover:underline cursor-pointer text-sm"
                      title="Covered suburb"
                    >
                      {suburb}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
