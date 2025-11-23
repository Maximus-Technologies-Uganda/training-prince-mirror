"use client";

import React, { useState, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export function AppQueryClientProvider({ children }: PropsWithChildren) {
  const [client] = useState(createClient);
  const enableDevtools = typeof window !== "undefined" && process.env.NODE_ENV !== "production";

  return (
    <QueryClientProvider client={client}>
      {children}
      {enableDevtools ? <ReactQueryDevtools buttonPosition="bottom-right" /> : null}
    </QueryClientProvider>
  );
}
