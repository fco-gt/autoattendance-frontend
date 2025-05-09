// src/hooks/useAgency.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAgencyUsers, inviteUser } from "@/lib/api/agencies";
import type { UserFrontend } from "@/types/FrontendTypes";
import { useState } from "react";

type InviteUserVariables = Parameters<typeof inviteUser>[0];

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
    },
  });
}

// Hook para actualizar un usuario existente
export const useUpdateUser = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (data: { id: string; email: string }) => {
    setIsPending(true);
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPending(false);
      alert(`Correo electrónico actualizado correctamente a ${data.email}.`);
      return data;
    } catch (err: any) {
      setError(err);
      setIsPending(false);
      alert(`Error al actualizar el correo electrónico: ${err.message}`);
      throw err;
    }
  };

  return { mutateAsync, isPending, error };
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
    } catch (err: any) {
      setError(err);
      setIsPending(false);
      alert(`Error al eliminar el usuario: ${err.message}`);
      throw err;
    }
  };

  return { mutateAsync, isPending, error };
};
