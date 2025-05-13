"use client";

import { UserTable } from "@/components/agency/data-table";
import { SectionCards } from "@/components/agency/section-cards";
import { useAgencyUsers } from "@/hooks/useAgency";
import { SectionCardsSkeleton } from "@/components/agency/section-cards-skeleton";
import { DataTableSkeleton } from "@/components/agency/data-table-skeleton";
import { useAuthStore } from "@/stores/useAuth";

export default function Page() {
  const { data: users, error: usersError, isLoading } = useAgencyUsers();
  const subject = useAuthStore((s) => s.subject);
  const data = subject?.data;

  if (usersError) {
    console.error("Error fetching agency users:", usersError);
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-6">
        <p className="text-red-600">
          Error al cargar los datos de los usuarios.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <SectionCardsSkeleton />
            </div>

            <div className="px-4 lg:px-6">
              <DataTableSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter((u) => u.status === "ACTIVE").length ?? 0;
  const pendingUsers = users?.filter((u) => u.status === "PENDING").length ?? 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="px-4 lg:px-6 text-2xl font-bold">
            Panel de control de {data?.name}
          </h1>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <SectionCards title="Empleados" value={totalUsers.toString()} />
            <SectionCards title="Activos" value={activeUsers.toString()} />
            <SectionCards title="Pendientes" value={pendingUsers.toString()} />
          </div>
          <div className="px-4 lg:px-6">
            <UserTable users={users ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
