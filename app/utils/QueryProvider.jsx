"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export default function QueryProvider({children}) {
  const [queryClient] = useState(() => new QueryClient({}));
  useEffect(() => {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
