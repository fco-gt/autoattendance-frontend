"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Edit3,
  Save,
  X,
  Phone,
  MapPin,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Key,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { AgencyFrontend } from "@/types/FrontendTypes";
import PasswordValidator from "./password-validator";
import TimestampCard from "./timestamp-card";
import {
  AgencyUpdateFormValues,
  agencyUpdateSchema,
  calculatePasswordStrength,
} from "@/validators/agencyUpdate";
import NoEditableData from "./no-editable-data";
import EditableData from "./editable-data";
import NoEditableFields from "./no-editable-fields";

interface AgencyDashboardPageProps {
  agency: AgencyFrontend;
  onUpdateAgency?: (data: AgencyUpdateFormValues) => Promise<void>;
}

const getPasswordStrengthLabel = (
  score: number
): { label: string; color: string } => {
  if (score < 40) return { label: "Muy débil", color: "text-red-600" };
  if (score < 60) return { label: "Débil", color: "text-orange-600" };
  if (score < 80) return { label: "Buena", color: "text-yellow-600" };
  return { label: "Muy fuerte", color: "text-green-600" };
};

export default function AgencyDashboardPage({
  agency,
  onUpdateAgency,
}: AgencyDashboardPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<AgencyUpdateFormValues>({
    resolver: zodResolver(agencyUpdateSchema),
    defaultValues: {
      name: agency.name,
      address: agency.address || "",
      phone: agency.phone || "",
      confirmPassword: "",
      newPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");
  const passwordStrength = calculatePasswordStrength(newPassword || "");
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const handleEdit = () => {
    setIsEditing(true);
    form.reset({
      name: agency.name,
      address: agency.address || "",
      phone: agency.phone || "",
      confirmPassword: "",
      newPassword: "",
    });
    setShowPasswordSection(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordSection(false);
    form.reset({
      name: agency.name,
      address: agency.address || "",
      phone: agency.phone || "",
      confirmPassword: "",
      newPassword: "",
    });
  };

  const handleSubmit = async (data: AgencyUpdateFormValues) => {
    if (!onUpdateAgency) {
      toast.error("Error", {
        description: "No se puede actualizar la información en este momento",
      });
      return;
    }

    // Preparar datos para enviar al backend
    const dataToSend: AgencyUpdateFormValues = {
      name: data.name,
      address: data.address,
      phone: data.phone,
    };

    // Solo incluir campos de contraseña si se está cambiando
    if (showPasswordSection && data.newPassword && data.confirmPassword) {
      dataToSend.newPassword = data.newPassword;
      dataToSend.confirmPassword = data.confirmPassword;
    }

    setIsSubmitting(true);
    try {
      await onUpdateAgency(dataToSend);
      setIsEditing(false);
      setShowPasswordSection(false);

      const message =
        showPasswordSection && data.newPassword
          ? "La información de la agencia y contraseña han sido actualizadas correctamente"
          : "La información de la agencia ha sido actualizada correctamente";

      toast.success("Éxito", {
        description: message,
        duration: 5000,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage =
          error.message ||
          "No se pudo actualizar la información. Inténtalo de nuevo.";
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Panel de Agencia
          </h1>
          <p className="text-muted-foreground">
            Gestiona la información de tu agencia y configuración de seguridad
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editar Información
          </Button>
        )}
      </div>

      {/* Main Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Información General</CardTitle>
              <CardDescription>
                Detalles principales de la agencia
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Editable Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                      Campos Editables
                    </h3>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Nombre de la Agencia
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre de la agencia"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Dirección
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dirección de la agencia (opcional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Teléfono
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Número de teléfono (opcional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Non-Editable Fields */}
                  <NoEditableData agency={agency} />
                </div>

                <Separator />

                {/* Password Change Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">
                        Cambio de Contraseña
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowPasswordSection(!showPasswordSection);
                        if (!showPasswordSection) {
                          form.setValue("confirmPassword", "");
                          form.setValue("newPassword", "");
                        }
                      }}
                    >
                      {showPasswordSection
                        ? "Cancelar cambio"
                        : "Cambiar contraseña"}
                    </Button>
                  </div>

                  {showPasswordSection && (
                    <div className="space-y-4 p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      {/* Current Password */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Contraseña Actual
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Ingresa tu contraseña actual"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* New Password */}
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Nueva Contraseña
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Ingresa tu nueva contraseña"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            {field.value && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Fortaleza de la contraseña:</span>
                                  <span
                                    className={`font-medium ${strengthInfo.color}`}
                                  >
                                    {strengthInfo.label}
                                  </span>
                                </div>
                                <Progress
                                  value={passwordStrength}
                                  className="h-2"
                                />
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password Requirements */}
                      {newPassword && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-1">
                              <p className="font-medium">
                                Requisitos de contraseña:
                              </p>
                              <ul className="text-sm space-y-1 ml-4">
                                <li className="flex items-center gap-2">
                                  {newPassword.length >= 8 ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  Al menos 8 caracteres
                                </li>
                                <li className="flex items-center gap-2">
                                  {/[a-z]/.test(newPassword) ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  Una letra minúscula
                                </li>
                                <li className="flex items-center gap-2">
                                  {/[A-Z]/.test(newPassword) ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  Una letra mayúscula
                                </li>
                                <li className="flex items-center gap-2">
                                  {/[0-9]/.test(newPassword) ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  Un número
                                </li>
                                <li className="flex items-center gap-2">
                                  {/[^a-zA-Z0-9]/.test(newPassword) ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  Un carácter especial
                                </li>
                              </ul>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      (showPasswordSection &&
                        !!newPassword &&
                        passwordStrength < 60)
                    }
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Mode - Editable Fields */}
              <EditableData agency={agency} />

              {/* Display Mode - Non-Editable Fields */}
              <NoEditableFields agency={agency} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timestamps Card */}
      <TimestampCard agency={agency} />

      {/* Security Information Alert */}
      <PasswordValidator />
    </div>
  );
}
