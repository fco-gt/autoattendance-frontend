"use client";

import { Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AgencyFrontend } from "@/types/FrontendTypes";
import { Globe } from "lucide-react";

export default function NoEditableFields({
  agency,
}: {
  agency: AgencyFrontend;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
        Información del Sistema
      </h3>

      <div className="space-y-3">
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            ID de Agencia
          </Label>
          <div className="mt-1 p-2 bg-muted/50 rounded-md">
            <code className="text-sm font-mono">{agency.id}</code>
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Globe className="h-4 w-4" />
            Dominio
          </Label>
          <div className="mt-1 p-2 bg-muted/50 rounded-md">
            <span className="text-sm font-medium">{agency.domain}</span>
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Shield className="h-4 w-4" />
            Estado
          </Label>
          <div className="mt-1">
            <Badge variant={agency.isActive ? "default" : "destructive"}>
              {agency.isActive ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
