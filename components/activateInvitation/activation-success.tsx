"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ActivationSuccess() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            ¡Cuenta activada!
          </CardTitle>
          <CardDescription className="text-center">
            Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <div>
            Ahora podrás acceder a todas las funcionalidades de la plataforma
            utilizando tu correo electrónico y la contraseña que acabas de
            establecer.
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/login")} className="w-full">
            Ir a iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
