"use client"
// hooks/useUserData.js
import { useQuery } from "@tanstack/react-query";
import { getUserByEmail } from "../utils/getUser";
import useAuth from "./useAuth";

export const useUserData = () => {
  const {user} = useAuth()
  return useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => getUserByEmail(user?.email),
    enabled: !!user?.email,             // only run if email exists
    staleTime: 1000 * 60 * 5,     // 5 minutes
    cacheTime: 1000 * 60 * 30,    // 30 minutes
  });
};
