"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clock, Save } from "lucide-react";
import type { Attendance, UserFrontend } from "@/types/FrontendTypes";

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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Esquema de validación con zod
const attendanceFormSchema = z.object({
  userId: z.string({
    required_error: "Por favor selecciona un usuario",
  }),
  notes: z.string().optional(),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

interface AttendanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AttendanceFormValues) => Promise<Attendance>;
  title: string;
  description: string;
  type: "check-in" | "check-out";
  users: UserFrontend[];
  isLoading: boolean;
}

export function AttendanceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  type,
  users,
  isLoading,
}: AttendanceFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Valores por defecto para el formulario
  const defaultValues: Partial<AttendanceFormValues> = {
    notes: type === "check-in" ? "Entrada manual" : "Salida manual",
  };

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: AttendanceFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(
        `Error al registrar ${type === "check-in" ? "entrada" : "salida"}:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} {user.lastname || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecciona el usuario para registrar la{" "}
                    {type === "check-in" ? "entrada" : "salida"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Hora actual: {currentTime}</span>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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
                    Registrar {type === "check-in" ? "Entrada" : "Salida"}
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
