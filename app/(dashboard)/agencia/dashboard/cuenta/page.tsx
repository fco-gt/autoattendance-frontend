"use client";

import { useAuthStore } from "@/stores/useAuth";
import { useUpdateAgency } from "@/hooks/useAgency";
import AgencyDashboardPage from "@/components/agency/information/agency-page";
import { AgencyDashboardSkeleton } from "@/components/agency/information/agency-skeleton";

export default function AgencyDashboardWrapper() {
  const { subject } = useAuthStore();
  const agency = subject?.type === "agency" ? subject.data : null;

  const { mutateAsync: updateAgencyMutation } = useUpdateAgency();

  const handleUpdateAgency = async (data: {
    name: string;
    address?: string;
    phone?: string;
    password?: string;
  }): Promise<void> => {
    await updateAgencyMutation(data);
  };

  if (!agency) {
    return <AgencyDashboardSkeleton />;
  }

  return (
    <AgencyDashboardPage agency={agency} onUpdateAgency={handleUpdateAgency} />
  );
}
