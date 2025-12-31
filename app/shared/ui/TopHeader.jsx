"use client";
import React from "react";
import Container from "./Container";
import Link from "next/link";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";

export default function TopHeader() {
  const {data: userData, isLoading} = useUserData();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="bg-primary text-white py-2 w-full">
      <Container className="flex items-center justify-between">
        <a className="hover:text-underline" href="tel:61412018593">
          <span className="font-bold">Phone:</span> +61 412 018 593
        </a>
        {userData && userData.role === "instructor" ? (
          <Link href={`/contact`} className="hover:underline font-semibold">Help</Link>
        ) : (
          <Link href="/book-now" className="hover:underline font-semibold">
            Book Now
          </Link>
        )}
      </Container>
    </div>
  );
}
