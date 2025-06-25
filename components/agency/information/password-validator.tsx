"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function PasswordValidator() {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">Recomendaciones de seguridad:</p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• Cambia tu contraseña regularmente (cada 3-6 meses)</li>
            <li>• Usa una contraseña única que no uses en otros sitios</li>
            <li>• Considera usar un gestor de contraseñas</li>
            <li>• No compartas tu contraseña con nadie</li>
            <li>• Cierra sesión en dispositivos compartidos</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
