"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const createClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
      mutations: {
        retry: 0,
      },
    },
  });

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(createClient);
  const showDevtools =
    typeof window !== "undefined" && process.env.NODE_ENV !== "production";

  return (
    <QueryClientProvider client={client}>
      {children}
      {showDevtools ? <ReactQueryDevtools buttonPosition="bottom-right" /> : null}
    </QueryClientProvider>
  );
}
