"use client";

import { Building2, MapPin, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { AgencyFrontend } from "@/types/FrontendTypes";

export default function EditableData({ agency }: { agency: AgencyFrontend }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
        Información Principal
      </h3>

      <div className="space-y-3">
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Nombre de la Agencia
          </Label>
          <p className="mt-1 text-lg font-semibold">{agency.name}</p>
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Dirección
          </Label>
          <p className="mt-1">{agency.address || "No especificada"}</p>
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Phone className="h-4 w-4" />
            Teléfono
          </Label>
          <p className="mt-1">{agency.phone || "No especificado"}</p>
        </div>
      </div>
    </div>
  );
}
