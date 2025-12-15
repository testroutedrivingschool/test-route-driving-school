// ReviewsCarousel.tsx
"use client";

import Image from "next/image";
import reviewerImg from "@/app/assets/reviewers/john.jpg";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Autoplay} from "swiper/modules";
import {FaStar, FaQuoteLeft} from "react-icons/fa";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const reviewsData = [
  {
    id: 1,
    authorName: "Harry Thompson",
    rating: 5,
    authorImage: reviewerImg,
    review:
      "Amazing driving instructors! Very patient and friendly. I passed my test on the first try thanks to their expert guidance.",
    date: "2 weeks ago",
    lesson: "10-Hour Package",
  },
  {
    id: 2,
    authorName: "Michael Roberts",
    rating: 5,
    authorImage: reviewerImg,
    review:
      "Highly professional and helpful. Explained everything clearly and helped me gain confidence on the road.",
    date: "1 month ago",
    lesson: "Test Preparation",
  },
  {
    id: 3,
    authorName: "Emily Nguyen",
    rating: 5,
    authorImage: reviewerImg,
    review:
      "The best driving school in the area. The lessons were easy to follow, and the instructor was very supportive.",
    date: "3 weeks ago",
    lesson: "Beginner Course",
  },
  {
    id: 4,
    authorName: "David Patel",
    rating: 5,
    authorImage: reviewerImg,
    review:
      "Excellent experience! I loved the structured lessons and positive approach by the instructor.",
    date: "2 months ago",
    lesson: "Advanced Driving",
  },
  {
    id: 5,
    authorName: "Martin Gaptil",
    rating: 5,
    authorImage: reviewerImg,
    review:
      "Highly recommended! I learned a lot and felt confident before my driving test.",
    date: "1 week ago",
    lesson: "Crash Course",
  },
];

export default function ReviewsCarousel() {
  return (
    <div className="relative">
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".reviews-next",
          prevEl: ".reviews-prev",
        }}
     
        autoplay={{delay: 4000, disableOnInteraction: false}}
        breakpoints={{
          640: {slidesPerView: 1},
          768: {slidesPerView: 2},
          1024: {slidesPerView: 3},
        }}
        className="pb-12"
      >
        {reviewsData.map((item) => (
         <SwiperSlide key={item.id}>
  <div className="bg-base-300 rounded-xl cursor-pointer shadow-lg border border-border-color 
                  p-6 transition-all duration-300  
                  flex flex-col h-full"> 
              {/* Quote Icon */}
              <div className="text-primary text-3xl mb-4">
                <FaQuoteLeft />
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 line-clamp-4">{item.review}</p>

              {/* Author Info */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {item.authorImage ? (
                      <Image className="rounded-full w-14 h-14 ring-2 ring-offset-2 ring-primary  object-cover" src={item.authorImage} width={50} height={50} alt={item.authorImage}/>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {item.authorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.authorName}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(item.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-500 text-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button className="reviews-prev p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <FiChevronLeft className="text-gray-600 text-xl" />
        </button>
        <button className="reviews-next p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <FiChevronRight className="text-gray-600 text-xl" />
        </button>
      </div>
    </div>
  );
}
