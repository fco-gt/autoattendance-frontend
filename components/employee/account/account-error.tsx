"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AccountErrorProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function AccountError({
  error,
  onRetry,
  isRetrying = false,
}: AccountErrorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Mi Cuenta</h1>
        <p className="text-muted-foreground">
          Información de tu cuenta de usuario
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error al cargar la información</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">{error}</p>
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                variant="outline"
                size="sm"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reintentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reintentar
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
