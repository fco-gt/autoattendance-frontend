"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Schedule } from "@/types/FrontendTypes";
import { Clock, Save, Users, X } from "lucide-react";
import { useAgencyUsers } from "@/hooks/useAgency";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Días de la semana para mostrar en el formulario
const weekDays = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

// Esquema de validación con zod
const scheduleFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  daysOfWeek: z
    .array(z.number())
    .min(1, "Selecciona al menos un día de la semana"),
  entryTime: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    ),
  exitTime: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    ),
  gracePeriodMinutes: z.coerce
    .number()
    .min(0, "La tolerancia no puede ser negativa")
    .max(60, "La tolerancia no puede ser mayor a 60 minutos"),
  isDefault: z.boolean(),
  assignedUsersIds: z.array(z.string()).optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: Schedule;
  onSubmit: (data: ScheduleFormValues) => Promise<Schedule>;
  title: string;
  description: string;
}

export function ScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
  onSubmit,
  title,
  description,
}: ScheduleFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSelectorOpen, setUserSelectorOpen] = useState(false);

  // Fetch users from the agency
  const { data: users, isLoading: usersLoading } = useAgencyUsers();

  // Valores por defecto para el formulario
  const defaultValues: Partial<ScheduleFormValues> = {
    name: schedule?.name || "",
    daysOfWeek: schedule?.daysOfWeek || [],
    entryTime: schedule?.entryTime || "08:00",
    exitTime: schedule?.exitTime || "17:00",
    gracePeriodMinutes: schedule?.gracePeriodMinutes || 5,
    isDefault: schedule?.isDefault || false,
    assignedUsersIds: schedule?.assignedUsersIds || [],
  };

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues,
  });

  // Reset form when schedule changes
  useEffect(() => {
    if (schedule) {
      form.reset({
        name: schedule.name,
        daysOfWeek: schedule.daysOfWeek,
        entryTime: schedule.entryTime,
        exitTime: schedule.exitTime,
        gracePeriodMinutes: schedule.gracePeriodMinutes,
        isDefault: schedule.isDefault,
        assignedUsersIds: schedule.assignedUsersIds,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [schedule, form]);

  const handleSubmit = async (data: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error al guardar el horario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserFullName = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    if (!user) return "Usuario desconocido";
    return `${user.name} ${user.lastname || ""}`.trim();
  };

  const selectedUserIds = form.watch("assignedUsersIds") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del horario</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Turno mañana" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daysOfWeek"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Días de la semana</FormLabel>
                    <FormDescription>
                      Selecciona los días que aplica este horario
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <FormField
                        key={day.value}
                        control={form.control}
                        name="daysOfWeek"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          day.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de entrada</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="time" {...field} />
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de salida</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="time" {...field} />
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gracePeriodMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tolerancia (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={60}
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minutos de tolerancia permitidos para la entrada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Assignment Section */}
            <FormField
              control={form.control}
              name="assignedUsersIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuarios asignados</FormLabel>
                  <FormDescription>
                    Selecciona los usuarios que tendrán este horario
                  </FormDescription>

                  {usersLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ) : (
                    <>
                      <Popover
                        open={userSelectorOpen}
                        onOpenChange={setUserSelectorOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                              aria-expanded={userSelectorOpen}
                            >
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {selectedUserIds.length === 0
                                  ? "Seleccionar usuarios..."
                                  : `${selectedUserIds.length} usuario(s) seleccionado(s)`}
                              </div>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar usuarios..." />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron usuarios.
                              </CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-48">
                                  {users?.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      onSelect={() => {
                                        const currentIds = field.value || [];
                                        const isSelected = currentIds.includes(
                                          user.id
                                        );

                                        if (isSelected) {
                                          field.onChange(
                                            currentIds.filter(
                                              (id) => id !== user.id
                                            )
                                          );
                                        } else {
                                          field.onChange([
                                            ...currentIds,
                                            user.id,
                                          ]);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center space-x-2 w-full">
                                        <Checkbox
                                          checked={selectedUserIds.includes(
                                            user.id
                                          )}
                                        />
                                        <div className="flex-1">
                                          <p className="font-medium">
                                            {user.name} {user.lastname}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {user.email}
                                          </p>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Selected Users Display */}
                      {selectedUserIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedUserIds.map((userId) => (
                            <Badge
                              key={userId}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {getUserFullName(userId)}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-1"
                                onClick={() => {
                                  const currentIds = field.value || [];
                                  field.onChange(
                                    currentIds.filter((id) => id !== userId)
                                  );
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Horario predeterminado</FormLabel>
                    <FormDescription>
                      Este horario se asignará automáticamente a nuevos usuarios
                    </FormDescription>
                  </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
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
