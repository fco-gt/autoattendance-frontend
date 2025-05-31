"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Trash2, Mail, Edit } from "lucide-react";
import { UserFrontendStatus, type UserFrontend } from "@/types/FrontendTypes";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmployeesTableProps {
  users: UserFrontend[];
  onEdit: (user: UserFrontend) => void;
  onDelete: (user: UserFrontend) => void;
}

// Función para obtener el texto del estado
const STATUS_CONFIG = {
  [UserFrontendStatus.ACTIVE]: {
    label: "Activo",
    variant: "default" as const,
    className: "bg-green-500 hover:bg-green-600",
  },
  [UserFrontendStatus.PENDING]: {
    label: "Pendiente",
    variant: "secondary" as const,
    className: "bg-amber-500 text-white hover:bg-amber-600",
  },
  [UserFrontendStatus.INACTIVE]: {
    label: "Inactivo",
    variant: "outline" as const,
    className: "",
  },
};

// Función para obtener las iniciales del nombre
const getInitials = (name: string, lastname?: string | null) => {
  const firstInitial = name.charAt(0);
  const lastInitial = lastname ? lastname.charAt(0) : "";
  return (firstInitial + lastInitial).toUpperCase();
};

export function EmployeesTable({
  users,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empleado</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de registro</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(user.name, user.lastname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.name} {user.lastname || ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {user.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={STATUS_CONFIG[user.status].variant}
                className={STATUS_CONFIG[user.status].className}
              >
                {STATUS_CONFIG[user.status].label}
              </Badge>
            </TableCell>
            <TableCell>
              {format(parseISO(user.createdAt), "dd MMM yyyy", { locale: es })}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      (window.location.href = `mailto:${user.email}`)
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar correo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
