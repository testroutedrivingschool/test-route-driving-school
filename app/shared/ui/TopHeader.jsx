
"use client";
import React, {useEffect, useState} from "react";
import Container from "./Container";
import Link from "next/link";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";

export default function TopHeader() {
  const {data: userData, isLoading} = useUserData();
  const [hasCartItem, setHasCartItem] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setHasCartItem(cart.length > 0); // ✅ updates correctly when empty
    };

    checkCart(); // initial check

    window.addEventListener("cartUpdated", checkCart); // reacts to add/remove
    window.addEventListener("storage", checkCart);     // reacts to other tabs

    return () => {
      window.removeEventListener("cartUpdated", checkCart);
      window.removeEventListener("storage", checkCart);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="bg-primary text-white py-2 w-full">
      <Container className="flex items-center justify-between">
        <a className="hover:text-underline" href="tel:61412018593">
          <span className="font-bold">Phone:</span> +61 412 018 593
        </a>
        <div className="space-x-5">
          {hasCartItem && (
            <Link href="/cart" className="hover:underline font-semibold">
              View Cart
            </Link>
          )}
          {userData && userData.role === "instructor" ? (
            <Link href={`/company/contact`} className="hover:underline font-semibold">
              Help
            </Link>
          ) : (
            <Link href="/bookings" className="hover:underline font-semibold">
              Book Now
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}
