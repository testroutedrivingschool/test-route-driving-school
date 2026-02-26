
"use client";
import React, { Suspense } from "react";
import Skeleton from "./Skelton";

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Skeleton/>}>{children}</Suspense>
);

export default SuspenseWrapper;