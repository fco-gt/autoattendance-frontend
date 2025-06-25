import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { UserFrontendStatus } from "@/types/FrontendTypes";

interface UserAvatarProps {
  name: string;
  lastname?: string | null;
  email: string;
  status: UserFrontendStatus;
  avatar?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({
  name,
  lastname,
  email,
  status,
  avatar,
  size = "md",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const getInitials = (name: string, lastname?: string | null) => {
    const firstInitial = name.charAt(0).toUpperCase();
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const getStatusBadge = (status: UserFrontendStatus) => {
    switch (status) {
      case UserFrontendStatus.ACTIVE:
        return { text: "Activo", variant: "default" as const };
      case UserFrontendStatus.PENDING:
        return { text: "Pendiente", variant: "secondary" as const };
      case UserFrontendStatus.INACTIVE:
        return { text: "Inactivo", variant: "destructive" as const };
      default:
        return { text: "Desconocido", variant: "outline" as const };
    }
  };

  const statusBadge = getStatusBadge(status);
  const fullName = lastname ? `${name} ${lastname}` : name;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage
            src={avatar || "/placeholder.svg"}
            alt={`Avatar de ${fullName}`}
          />
          <AvatarFallback className="bg-primary/10">
            {avatar ? (
              <User className="h-4 w-4" />
            ) : (
              getInitials(name, lastname)
            )}
          </AvatarFallback>
        </Avatar>
        {/* Indicador de estado activo */}
        {status === UserFrontendStatus.ACTIVE && (
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{fullName}</h3>
          <Badge variant={statusBadge.variant} className="text-xs">
            {statusBadge.text}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
