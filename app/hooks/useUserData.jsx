// hooks/useUserData.js
import { useQuery } from "@tanstack/react-query";
import { getUserByEmail } from "../utils/getUser";

export const useUserData = (email) => {
  return useQuery({
    queryKey: ["user", email],
    queryFn: () => getUserByEmail(email),
    enabled: !!email,             // only run if email exists
    staleTime: 1000 * 60 * 5,     // 5 minutes
    cacheTime: 1000 * 60 * 30,    // 30 minutes
  });
};
