// ReviewsCarousel.tsx
"use client";

import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Autoplay} from "swiper/modules";
import {FaStar, FaQuoteLeft} from "react-icons/fa";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";

export default function ReviewsCarousel() {
  const {data: reviewsData = [], isLoading} = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axios.get("/api/reviews");
      return res.data;
    },
  });
  if (isLoading) return <LoadingSpinner />;
  if (!reviewsData.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No reviews available yet
      </p>
    );
  }
  return (
    <div className="relative">
      <Swiper
        className="pb-12 items-stretch!"
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
      >
        {reviewsData.map((item) => (
          <SwiperSlide key={item._id} className="h-auto">
            <div
              className="bg-base-300 rounded-xl shadow-lg border border-border-color 
    p-6 transition-all duration-300 flex flex-col h-full min-h-75"
            >
              {/* Quote Icon */}
              <div className="text-primary text-3xl mb-4">
                <FaQuoteLeft />
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 line-clamp-4">{item.message}</p>

              {/* Author Info */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {item.authorImage ? (
                      <Image
                        className="rounded-full w-14 h-14 ring-2 ring-offset-2 ring-primary object-top  object-cover"
                        src={item.authorImage}
                        width={50}
                        height={50}
                        alt={item.authorImage}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {item?.authorName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item?.authorName}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {Array.from({length: item.rating}).map((_, i) => (
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
