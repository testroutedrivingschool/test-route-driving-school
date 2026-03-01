"use client"
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import SkeletonCard from "@/app/shared/Skeleton/SkeletonCard";
import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";





export default function Instructors() {
  const router = useRouter();
  const {data:instructors,isLoading} = useQuery({
    queryKey:["instructors"],
    queryFn:async()=>{
      const res = await axios.get("/api/instructors?status=approved");
      return res.data;
    }
  })

  
 if (isLoading) {
    return (
      <section>
        <PageHeroSection title="Our Instructors" subtitle="..." />
        <Container className="pb-16">
          <SectionHeader title="Our Instructors" />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Show Skeletons while loading */}
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} isInstructor={true} />
            ))}
          </div>
        </Container>
      </section>
    );
  }
  return (
  
     <section>
      <PageHeroSection title={`Our Instructors`} subtitle={`Our team of skilled and passionate instructors is dedicated to helping you achieve your goals. With years of experience and a commitment to personalized learning, they provide the guidance, support, and motivation you need to master every skill confidently. Whether you’re just starting out or looking to sharpen your abilities, our instructors are here to make your learning journey engaging, effective, and inspiring.`}/>
      <Container className={`pb-16`}>
        <SectionHeader title="Our Instructors" />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((inst) =>{
              const avatarSrc = inst?.photo
    ? inst.photo
    : inst?.photoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(inst.photoKey)}`
      : "/profile-avatar.png";
            return (
            <div
              key={inst._id}
              className="bg-white border border-border-color  shadow-lg rounded-lg overflow-hidden"
            >
              <Image
                width={800}
                height={800}
                className="md:w-full md:h-70 h-85 object-cover object-top md:object-center "
                src={avatarSrc}
                alt={inst.name}
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{inst.name}</h2>
                <p className="text-gray-700 mb-2">{inst.experience}</p>
                <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
                  <PrimaryBtn   onClick={() => router.push(`/bookings?instructorId=${inst._id}`)} className={`flex-1 text-center justify-center text-sm font-medium `}>Book Now</PrimaryBtn>
                  <OutlineBtn  className={`flex-1 text-center justify-center text-sm font-medium `} onClick={()=>router.push(`/instructors/${inst._id}`)}>View Profile</OutlineBtn>
             
                </div>
              </div>
            </div>
          )})}
        </div>
      </Container>
    </section> 
  
  );
}
