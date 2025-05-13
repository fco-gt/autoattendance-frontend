"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus } from "lucide-react";

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
const inviteUserSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  name: z.string().min(1, "El nombre es requerido"),
  lastname: z.string().optional(),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: InviteUserFormValues
  ) => Promise<{ email: string; name: string; lastname?: string | null }>;
  isLoading: boolean;
}

export function InviteUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: InviteUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores por defecto para el formulario
  const defaultValues: Partial<InviteUserFormValues> = {
    email: "",
    name: "",
    lastname: "",
  };

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues,
  });

  const handleSubmit = async (data: InviteUserFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error al invitar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invitar Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Envía una invitación a un nuevo empleado para unirse a la agencia.
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
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Se enviará un correo de invitación a esta dirección
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apellido"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  "Enviando invitación..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invitar Empleado
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
