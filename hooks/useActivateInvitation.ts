import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser, validateActivationToken } from "@/lib/api/users";
import type { AuthUserResponse } from "@/types/FrontendTypes";

export type UseVerifyTokenReturn = {
  message: string;
  isValid?: boolean;
};

export function useVerifyToken() {
  return useMutation<UseVerifyTokenReturn, Error, { activationCode: string }>({
    mutationFn: ({ activationCode }) => validateActivationToken(activationCode),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();

  return useMutation<
    AuthUserResponse,
    Error,
    { activationCode: string; password: string }
  >({
    mutationFn: ({ activationCode, password }) =>
      activateUser(activationCode, password),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
