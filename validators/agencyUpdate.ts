import { z } from "zod";

const passwordStrengthSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña no puede exceder 128 caracteres")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial");

export const agencyUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    address: z
      .string()
      .max(200, "La dirección no puede exceder 200 caracteres")
      .optional(),
    phone: z
      .string()
      .regex(/^[+]?[0-9\s\-()]{0,20}$/, "Formato de teléfono inválido")
      .optional(),
    // Campos para cambio de contraseña (opcionales)
    confirmPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si se proporciona newPassword, confirmPassword es requerido
      if (data.newPassword && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "La contraseña actual es requerida para cambiar la contraseña",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona newPassword, debe cumplir con los requisitos
      if (data.newPassword) {
        return passwordStrengthSchema.safeParse(data.newPassword).success;
      }
      return true;
    },
    {
      message: "La nueva contraseña no cumple con los requisitos de seguridad",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // La nueva contraseña debe ser diferente a la actual
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword !== data.confirmPassword;
      }
      return true;
    },
    {
      message: "La nueva contraseña debe ser diferente a la actual",
      path: ["newPassword"],
    }
  );

export type AgencyUpdateFormValues = z.infer<typeof agencyUpdateSchema>;

export const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  return Math.min(score, 100);
};
