"use client";
import React from "react";
import Container from "./Container";
import Link from "next/link";

export default function TopHeader() {
  return (
    <div className="bg-primary text-white py-2 w-full">
      <Container className="flex items-center justify-between">
        <a className="hover:text-underline" href="">
          <span className="font-bold">Phone:</span> +61 100 200 200
        </a>
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      </Container>
    </div>
  );
}