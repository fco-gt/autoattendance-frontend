"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserFrontend, AgencyFrontend } from "@/types/FrontendTypes";

interface NavUserProps {
  user?: UserFrontend | AgencyFrontend;
  type?: "user" | "agency";
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
}

type MenuOption = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

export function NavUser({ user, type, onLogout, onNavigate }: NavUserProps) {
  const { isMobile } = useSidebar();
  if (!user) return null;

  // Decidir qué texto mostrar arriba
  const subtitle =
    type === "user"
      ? (user as UserFrontend).email
      : (user as AgencyFrontend).domain;

  // Items dinámicos
  const menuOptions: MenuOption[] = [
    {
      label: "Cuenta",
      icon: <IconUserCircle size={16} />,
      action: () =>
        onNavigate?.(type === "user" ? "/usuario/profile" : "/agencia/profile"),
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              aria-label="Menú de usuario"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center space-x-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={""} alt={user.name} />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-sm">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {subtitle}
                </p>
              </div>
              <IconDotsVertical size={20} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="min-w-[200px] rounded-lg"
          >
            {/* Header con avatar y datos */}
            <DropdownMenuLabel className="flex items-center gap-2 p-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={""} alt={user.name} />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-sm">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {menuOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.label}
                  onSelect={opt.action}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  {opt.icon}
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive"
            >
              <IconLogout size={16} />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
