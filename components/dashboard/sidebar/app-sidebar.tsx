"use client";

import React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconBuilding,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { NavMain } from "@/components/dashboard/sidebar/nav-main";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuth";
import { useRouter } from "next/navigation";

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
};

const agencyNavData = [
  { title: "Dashboard", url: "/agencia/dashboard", icon: IconDashboard },
  {
    title: "Horarios",
    url: "/agencia/dashboard/horarios",
    icon: IconListDetails,
  },
  {
    title: "Asistencia",
    url: "/agencia/dashboard/asistencia",
    icon: IconChartBar,
  },
  { title: "Usuarios", url: "/agencia/dashboard/usuarios", icon: IconUsers },
];

const userNavData = [
  { title: "Dashboard", url: "/usuario/dashboard", icon: IconDashboard },
  { title: "Historial de Asistencias", url: "/usuario/dashboard/historial", icon: IconChartBar },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const subject = useAuthStore((s) => s.subject);
  const logout = useAuthStore((s) => s.logout);
  const user = subject?.type === "user" ? subject.data : undefined;
  const agency = subject?.type === "agency" ? subject.data : undefined;
  let navData: NavItem[] = [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (user) {
    navData = userNavData;
  } else if (agency) {
    navData = agencyNavData;
  }

  const renderSidebarContent = () => {
    if (!subject) {
      return <div>Cargando...</div>;
    }

    return <NavMain items={navData} />;
  };

  const renderSidebarFooter = () => {
    if (!subject) {
      return <div>Cargando...</div>;
    }

    return (
      <NavUser
        user={user || agency}
        type={subject?.type}
        onLogout={handleLogout}
      />
    );
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-2">
              <a
                href={
                  subject?.type === "agency"
                    ? "/agencia/dashboard"
                    : "/usuario/dashboard"
                }
              >
                <IconBuilding className="size-5" />
                <span className="ml-2 text-base font-semibold">
                  AutoAttendance
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{renderSidebarContent()}</SidebarContent>
      <SidebarFooter>{renderSidebarFooter()}</SidebarFooter>
    </Sidebar>
  );
}
