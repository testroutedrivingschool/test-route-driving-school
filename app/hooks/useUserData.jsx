"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserByEmail } from "../utils/getUser";
import useAuth from "./useAuth";

export const useUserData = () => {
  const { user, loading } = useAuth();

  const q = useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => getUserByEmail(user?.email),
    enabled: !!user?.email && !loading,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    ...q,
    isLoading: loading || q.isLoading,
    authUser: user,
    authLoading: loading,
  };
};
