"use client";

import { useState } from "react";
import {
  useAgencyUsers,
  useInviteUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/useAgency";
import { UserPlus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeesTable } from "@/components/agency/employees/employees-table";
import {
  InviteUserDialog,
  InviteUserFormValues,
} from "@/components/agency/employees/invite-user-dialog";
import { EditUserDialog } from "@/components/agency/employees/edit-user-dialog";
import { DeleteUserDialog } from "@/components/agency/employees/delete-user-dialog";
import { EmployeesTableSkeleton } from "@/components/agency/employees/employees-table-skeleton";
import type { UserFrontend } from "@/types/FrontendTypes";

export default function EPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFrontend | null>(null);

  // Estado para el filtro de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  // Hooks para operaciones CRUD
  const { data: users, isLoading, error } = useAgencyUsers();
  const inviteMutation = useInviteUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  // Función para abrir el modal de edición
  const handleEdit = (user: UserFrontend) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  // Función para abrir el modal de eliminación
  const handleDelete = (user: UserFrontend) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Función para manejar la invitación de usuario
  const handleInvite = async (data: InviteUserFormValues) => {
    return inviteMutation.mutateAsync(data);
  };

  // Función para manejar la actualización de usuario
  const handleUpdate = async (data: { email: string }) => {
    if (!selectedUser) return Promise.reject("No user selected");
    return updateMutation.mutateAsync({ id: selectedUser.id, ...data });
  };

  // Función para manejar la eliminación de usuario
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return Promise.reject("No user selected");
    return deleteMutation.mutateAsync(selectedUser.id);
  };

  // Filtrar usuarios según la búsqueda
  const filteredUsers = users?.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      (user.lastname || "").toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Empleados</CardTitle>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invitar Empleado
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar empleados..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <EmployeesTableSkeleton />
          ) : error ? (
            <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
              Error al cargar los empleados: {error.message}
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No se encontraron empleados con esa búsqueda"
                : "No hay empleados registrados"}
            </div>
          ) : (
            <EmployeesTable
              users={filteredUsers || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal para invitar usuario */}
      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInvite}
        isLoading={inviteMutation.isPending}
      />

      {/* Modal para editar usuario */}
      {selectedUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={selectedUser}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
        />
      )}

      {/* Modal para eliminar usuario */}
      {selectedUser && (
        <DeleteUserDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          user={selectedUser}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
