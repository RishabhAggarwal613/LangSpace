import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

export default function QueryProvider({ children }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
