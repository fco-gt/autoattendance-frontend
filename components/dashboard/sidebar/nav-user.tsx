"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { UserFrontend, AgencyFrontend } from "@/types/FrontendTypes";

interface NavUserProps {
  user?: UserFrontend | AgencyFrontend;
  type?: "user" | "agency";
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
  // Nueva prop para configurar rutas personalizadas
  accountRoute?: string;
}

type MenuOption = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

export function NavUser({
  user,
  type,
  onLogout,
  onNavigate,
  accountRoute,
}: NavUserProps) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  if (!user) return null;

  // Decidir qué texto mostrar arriba
  const subtitle =
    type === "user"
      ? (user as UserFrontend).email
      : (user as AgencyFrontend).domain;

  // Función de navegación mejorada con fallbacks
  const handleNavigation = (path: string) => {
    console.log(`Attempting to navigate to: ${path}`);

    try {
      // Prioridad 1: Usar onNavigate prop si está disponible
      if (onNavigate) {
        console.log("Using onNavigate prop");
        onNavigate(path);
        return;
      }

      // Prioridad 2: Usar Next.js router
      console.log("Using Next.js router");
      router.push(path);
    } catch (error) {
      console.error("Navigation error:", error);

      // Fallback: Navegación nativa del navegador
      console.log("Falling back to window.location");
      window.location.href = path;
    }
  };

  // Determinar la ruta de cuenta
  const getAccountRoute = (): string => {
    // Prioridad 1: Ruta personalizada
    if (accountRoute) {
      return accountRoute;
    }

    // Prioridad 3: Rutas específicas por tipo
    return type === "user"
      ? "/usuario/dashboard/cuenta"
      : "/agencia/dashboard/cuenta";
  };

  // Items dinámicos
  const menuOptions: MenuOption[] = [
    {
      label: "Cuenta",
      icon: <IconUserCircle size={16} />,
      action: () => {
        const route = getAccountRoute();
        console.log(`Account route determined: ${route}`);
        handleNavigation(route);
      },
    },
  ];

  // Opciones de tema
  const themeOptions = [
    {
      label: "Claro",
      value: "light",
      icon: <IconSun size={16} />,
    },
    {
      label: "Oscuro",
      value: "dark",
      icon: <IconMoon size={16} />,
    },
    {
      label: "Sistema",
      value: "system",
      icon: <IconDeviceDesktop size={16} />,
    },
  ];

  // Obtener el icono del tema actual
  const getCurrentThemeIcon = () => {
    switch (theme) {
      case "light":
        return <IconSun size={16} />;
      case "dark":
        return <IconMoon size={16} />;
      case "system":
        return <IconDeviceDesktop size={16} />;
      default:
        return <IconDeviceDesktop size={16} />;
    }
  };

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
                  onSelect={(e) => {
                    e.preventDefault();
                    opt.action();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                >
                  {opt.icon}
                  {opt.label}
                </DropdownMenuItem>
              ))}

              {/* Selector de Tema */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 text-sm">
                  {getCurrentThemeIcon()}
                  Tema
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-[140px] mb-5">
                  {themeOptions.map((themeOption) => (
                    <DropdownMenuItem
                      key={themeOption.value}
                      onSelect={() => setTheme(themeOption.value)}
                      className="flex items-center gap-2 px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {themeOption.icon}
                        {themeOption.label}
                      </div>
                      {theme === themeOption.value && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onLogout?.();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive cursor-pointer"
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
