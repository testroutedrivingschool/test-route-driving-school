"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../shared/ui/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return children;
}
