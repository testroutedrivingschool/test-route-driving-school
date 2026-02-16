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
import getAvatarSrc from "@/app/utils/getAvatarSrc";

const reviewsData = [
  {
    _id: 1,
    authorName: "Adrita's World",
    rating: 5,
    email: "adritaworld@gmail.com",
    createdAt: "2025-12-15T17:27:34.865+00:00",
    authorImage:
      "https://lh3.googleusercontent.com/a-/ALV-UjW26frzIQ5lA9UMjQ-ZpRw59YlM8JbrIJl0CEHavI454p-UHxk=w90-h90-p-rp-mo-br100",
    message:
      "Best driving instructor I could ask for ,As a student learner, I was very scared at first, but Test Route Driving School made everything easy. The lessons were well-structured and focused on test routes around the Sydney suburbs. The instructor corrected my mistakes calmly and helped me build confidence. I’m very happy with the result!",
    targetType: "website",
  },
  {
    _id: 2,
    authorName: "porteboishobai",
    rating: 5,
    email: "porteboishobai@gmail.com",
    createdAt: "2025-11-21T17:27:34.865+00:00",
    authorImage: "",
    message:
      "My experience has been great ! Instructors were really patient with me and easygoing enough for me to communicate with them about my problems properly. Because of these lessons I am more confident than ever!",
    targetType: "website",
  },
  {
    _id: 3,
    authorName: "Najeeb Zahid",
    rating: 5,
    email: "najeebzahid@gmail.com",
    createdAt: "2025-11-16T17:27:34.865+00:00",
    authorImage:
      "https://lh3.googleusercontent.com/a-/ALV-UjVUTSfKBeBmU8-EX643CsUTkR7DK9XDwzIuhclZWYk3EizTsSrT=w45-h45-p-rp-mo-ba2-br100",
    message:
      "my nephew passed driving test on the first attempt thanks to Test Route Driving School. Instructor Firoj is extremely patient and explains everything clearly. Practicing real test routes made a huge difference.",
    targetType: "website",
  },
  {
    _id: "694c2595b8e4af68da593ef8",
    authorName: "Iqbal Hossain",
    rating: 5,
    email: "iqbalhossain@gmail.com",
    createdAt: "2025-08-22T17:27:34.865+00:00",
    authorImage:
      "https://lh3.googleusercontent.com/a-/ALV-UjXhO69RTzv5OI19axrcy0KROhPprqnmivMjY7NnOsu0SS_yhMc=w90-h90-p-rp-mo-br100",
    message: "Nice Service",
    targetType: "website",
  },
];

export default function ReviewsCarousel() {
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
        {reviewsData.map((item) => {
          return (
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
                <p className="text-gray-700 mb-6 line-clamp-4">
                  {item.message}
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        className="rounded-full w-14 h-14 ring-2 ring-offset-2 ring-primary object-top  object-cover"
                        src={getAvatarSrc(item)}
                        width={550}
                        height={550}
                        alt={item.authorName}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item?.authorName}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({length: item.rating}).map((_, i) => (
                            <FaStar
                              key={i}
                              className="text-yellow-500 text-sm"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Custom Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          aria-label="Left Arrow"
          className="reviews-prev p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <FiChevronLeft className="text-neutral text-xl" />
        </button>
        <button
          aria-label="Right Arrow"
          className="reviews-next p-3 rounded-full bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <FiChevronRight className="text-neutral text-xl" />
        </button>
      </div>
    </div>
  );
}
