import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAgencyUsers, inviteUser } from "@/lib/api/agencies";
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (id: string) => {
    setIsPending(true);
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPending(false);
      alert(`Usuario eliminado correctamente.`);
      return { success: true, id };
    } catch (err: unknown) {
      setError(err as Error);
      setIsPending(false);
      alert(`Error al eliminar el usuario: ${err}`);
      throw err;
    }
  };

  return { mutateAsync, isPending, error };
};
