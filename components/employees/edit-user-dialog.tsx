"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";
import type { UserFrontend } from "@/types/FrontendTypes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Esquema de validación con zod
const editUserSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserFrontend;
  onSubmit: (data: EditUserFormValues) => Promise<{ email: string }>;
  isLoading: boolean;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores por defecto para el formulario
  const defaultValues: EditUserFormValues = {
    email: user.email,
  };

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues,
  });

  const handleSubmit = async (data: EditUserFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Correo Electrónico</DialogTitle>
          <DialogDescription>
            Actualiza el correo electrónico de {user.name} {user.lastname || ""}
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    El usuario recibirá una notificación del cambio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
