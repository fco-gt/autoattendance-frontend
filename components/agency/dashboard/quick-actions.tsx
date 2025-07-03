"use client";

import { useState } from "react";
import {
  Plus,
  QrCode,
  UserPlus,
  Calendar,
  Settings,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGenerateQr } from "@/hooks/useAttendance";
import { QRCodeModal } from "@/components/agency/attendances/qr-code-modal";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const [qrType, setQrType] = useState<"check-in" | "check-out">("check-in");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [showQrTypeSelector, setShowQrTypeSelector] = useState(false);
  const qrMutation = useGenerateQr();
  const router = useRouter();

  // Muestra mini-selector antes de generar QR
  const handleClickQr = () => {
    setShowQrTypeSelector(true);
  };

  // Cuando eliges el tipo, genera el QR y muestra el modal
  const handleGenerateQR = (type: "check-in" | "check-out") => {
    setQrType(type);
    setShowQrTypeSelector(false); // Cierra el selector
    qrMutation.mutate(
      { type },
      {
        onSuccess: (data) => {
          setQrCodeValue(data.url);
          setIsQrModalOpen(true);
        },
        onError: (err) => {
          setQrCodeValue("");
          setIsQrModalOpen(false);
          console.error("Error generando QR:", err);
        },
      }
    );
  };

  const actions = [
    {
      title: "Generar QR",
      description: "Código QR para asistencia",
      icon: QrCode,
      action: handleClickQr,
      loading: qrMutation.isPending,
      variant: "outline" as const,
    },
    {
      title: "Invitar Usuario",
      description: "Agregar nuevo empleado",
      icon: UserPlus,
      action: () => {
        // Navigate to invite user
        router.push("/agencia/dashboard/usuarios");
      },
      variant: "outline" as const,
    },
    {
      title: "Nuevo Horario",
      description: "Crear horario de trabajo",
      icon: Calendar,
      action: () => {
        // Navigate to create schedule
        router.push("/agencia/dashboard/horarios");
      },
      variant: "outline" as const,
    },
    {
      title: "Configuración",
      description: "Ajustes de la agencia",
      icon: Settings,
      action: () => {
        // Navigate to settings
        router.push("/agencia/dashboard/cuenta");
      },
      variant: "ghost" as const,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="w-full justify-start h-auto p-4"
                onClick={action.action}
                disabled={action.loading}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-muted">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  {action.loading && (
                    <Badge variant="secondary">Generando...</Badge>
                  )}
                </div>
              </Button>
            );
          })}

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Reportes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mini selector de tipo QR, podría ser un modal, popover, o div flotante */}
      {showQrTypeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-black/90 p-6 rounded-xl shadow-xl w-full max-w-xs text-center space-y-4">
            <div className="font-bold text-lg mb-2">Selecciona tipo de QR</div>
            <Button
              className="w-full mb-2"
              onClick={() => handleGenerateQR("check-in")}
              disabled={qrMutation.isPending}
            >
              <QrCode className="mr-2 h-4 w-4" /> QR de Entrada
            </Button>
            <Button
              className="w-full"
              onClick={() => handleGenerateQR("check-out")}
              disabled={qrMutation.isPending}
              variant="outline"
            >
              <QrCode className="mr-2 h-4 w-4" /> QR de Salida
            </Button>
            <Button
              className="w-full mt-4"
              variant="ghost"
              onClick={() => setShowQrTypeSelector(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Modal real solo con el QR */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setQrCodeValue("");
        }}
        value={qrCodeValue}
        title={
          qrType === "check-in" ? "Código QR de Entrada" : "Código QR de Salida"
        }
        size={250}
      />
    </>
  );
}
