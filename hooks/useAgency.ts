import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAgencyUsers,
  inviteUser,
  deleteAgencyUser,
} from "@/lib/api/agencies";
import { updateUser } from "@/lib/api/users";
import type { UserFrontend } from "@/types/FrontendTypes";
import { toast } from "sonner";
import { useState } from "react";

type InviteUserVariables = Parameters<typeof inviteUser>[0];
type UpdateUserVariables = {
  id: string;
  data: Partial<UserFrontend>;
};

export function useAgencyUsers() {
  return useQuery<UserFrontend[], Error>({
    queryKey: ["agencyUsers"],
    queryFn: fetchAgencyUsers,
  });
}

export function useInviteUser() {
  const qc = useQueryClient();

  return useMutation<UserFrontend, Error, InviteUserVariables>({
    mutationFn: (variables) => inviteUser(variables),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencyUsers"] });
      toast.success("Usuario invitado correctamente.", {
        description: "Empleado invitado correctamente.",
        duration: 5000,
      });
    },
    onError: (err) => {
      toast.error("Error al invitar usuario.", {
        description: `Error al invitar el usuario: ${err.message}`,
        duration: 3000,
      });
    },
  });
}

// Hook para actualizar un usuario existente
export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation<UserFrontend, Error, UpdateUserVariables>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      qc.invalidateQueries({ queryKey: ["agencyUsers"] });
      toast.success("Usuario actualizado correctamente.", {
        description: `El usuario ${updatedUser.name} ${
          updatedUser.lastname || ""
        } ha sido actualizado correctamente.`,
        duration: 5000,
      });
    },
    onError: (err) => {
      toast.error("Error al actualizar el usuario.", {
        description: `Error al actualizar el usuario: ${err.message}`,
        duration: 3000,
      });
    },
  });
};

// Hook para eliminar un usuario
export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation<UserFrontend, Error, string>({
    mutationFn: async (id) => {
      // deleteAgencyUser retorna el usuario eliminado
      return await deleteAgencyUser(id);
    },
    onSuccess: (user) => {
      // Invalida la lista para refetch
      qc.invalidateQueries({ queryKey: ["agencyUsers"] });
      toast.success("Usuario eliminado correctamente.", {
        description: `El usuario ${user.name} ${
          user.lastname || ""
        } ha sido eliminado correctamente.`,
        duration: 5000,
      });
    },
    onError: (err) => {
      toast.error("Error al eliminar el usuario.", {
        description: `Error al eliminar el usuario: ${err.message}`,
        duration: 3000,
      });
    },
  });
};
