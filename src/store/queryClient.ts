import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const isUnreachable = (error: unknown) => {
  if (axios.isAxiosError(error)) return !error.response;
  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status: unknown }).status == null;
  }
  return false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60000, // n * 1 minute
      retry: (failureCount, error) => {
        if (isUnreachable(error)) return false;
        return failureCount < 2;
      },
    },
  },
});
