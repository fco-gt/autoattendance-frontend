import useSWR from "swr";
import { fetchAgencyUsers } from "@/lib/api/agencies";

export function useAgencyUsers() {
  return useSWR("agencyUsers", fetchAgencyUsers);
}
