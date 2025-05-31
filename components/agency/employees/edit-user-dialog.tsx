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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { MapLocationPicker } from "./map-location-picker";

// Esquema de validación con zod
const editUserSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  name: z.string().min(1, "El nombre es requerido"),
  lastname: z.string().nullable().optional(),
  homeLatitude: z.number().nullable().optional(),
  homeLongitude: z.number().nullable().optional(),
  homeRadiusMeters: z
    .number()
    .min(10, "El radio mínimo es 10 metros")
    .max(1000, "El radio máximo es 1000 metros")
    .nullable()
    .optional(),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserFrontend;
  onSubmit: (data: EditUserFormValues) => Promise<UserFrontend | undefined>;
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
  const [activeTab, setActiveTab] = useState("personal");

  // Valores por defecto para el formulario
  const defaultValues: EditUserFormValues = {
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    homeLatitude: user.homeLatitude,
    homeLongitude: user.homeLongitude,
    homeRadiusMeters: user.homeRadiusMeters ?? 100,
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
    } catch (error: unknown) {
      console.error("Error al actualizar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle location change from map
  const handleLocationChange = (lat: number | null, lng: number | null) => {
    form.setValue("homeLatitude", lat);
    form.setValue("homeLongitude", lng);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
          <DialogDescription>
            Actualiza la información de {user.name} {user.lastname || ""}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Información Personal</TabsTrigger>
                <TabsTrigger value="location">Ubicación</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 pt-4">
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
              </TabsContent>

              <TabsContent value="location" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Ubicación del empleado
                  </h3>

                  <MapLocationPicker
                    latitude={form.watch("homeLatitude") as number}
                    longitude={form.watch("homeLongitude") as number}
                    onChange={handleLocationChange}
                  />

                  <FormField
                    control={form.control}
                    name="homeRadiusMeters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Radio de ubicación: {field.value || 100} metros
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={10}
                            max={1000}
                            step={10}
                            defaultValue={[field.value || 100]}
                            onValueChange={(values) =>
                              field.onChange(values[0])
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Radio en metros para determinar la zona de ubicación
                          del empleado (10-1000m)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

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
