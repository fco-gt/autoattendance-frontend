import { useQuery } from "@tanstack/react-query";
import { verifyMe } from "@/lib/api/auth";
import type { AuthenticatedSubject } from "@/types/FrontendTypes";

export function useCurrentUser() {
  return useQuery<AuthenticatedSubject | null, Error>({
    queryKey: ["currentUser"],
    queryFn: () => verifyMe(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
