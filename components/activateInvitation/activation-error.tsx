"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActivationErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function ActivationError({
  message,
  onRetry,
}: ActivationErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Error de activación
          </CardTitle>
          <CardDescription className="text-center">
            No pudimos activar tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-destructive">{message}</div>
          <div className="mt-4 text-muted-foreground">
            El enlace de invitación puede haber expirado o ya ha sido utilizado.
            Por favor, contacta al administrador para obtener un nuevo enlace.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="w-full">
              Intentar nuevamente
            </Button>
          )}
          <Button onClick={() => router.push("/")} className="w-full">
            Volver al inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
