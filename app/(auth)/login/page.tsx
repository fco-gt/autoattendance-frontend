"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Loader2, User, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [agencyPassword, setAgencyPassword] = useState("");
  const [isOperating, setIsOperating] = useState(false);

  const handleLoginStub = (actor: "user" | "agency", e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsOperating(true);
    // Simulación de llamada a API de prueba
    setTimeout(() => {
      setIsOperating(false);
      toast(`Inicio de sesión de prueba (${actor})`, {
        description: "Esta es una respuesta simulada.",
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto w-full sm:w-[350px] space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-muted-foreground">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{errorMessage}</p>
          </Alert>
        )}

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="user"
              className="flex items-center gap-2 justify-center"
            >
              <User className="h-4 w-4" /> Usuario
            </TabsTrigger>
            <TabsTrigger
              value="agency"
              className="flex items-center gap-2 justify-center"
            >
              <Building2 className="h-4 w-4" /> Agencia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>Inicio de Sesión de Usuario</CardTitle>
                <CardDescription>
                  Ingresa tu correo y contraseña para acceder a tu cuenta
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleLoginStub("user", e)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Correo electrónico</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="user-password">Contraseña</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="user-password"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isOperating}
                  >
                    {isOperating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Iniciar Sesión
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="agency">
            <Card>
              <CardHeader>
                <CardTitle>Inicio de Sesión de Agencia</CardTitle>
                <CardDescription>
                  Ingresa el correo y contraseña de tu agencia para acceder
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleLoginStub("agency", e)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency-email">Correo electrónico</Label>
                    <Input
                      id="agency-email"
                      type="email"
                      placeholder="agencia@ejemplo.com"
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="agency-password">Contraseña</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="agency-password"
                      type="password"
                      value={agencyPassword}
                      onChange={(e) => setAgencyPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isOperating}
                  >
                    {isOperating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Iniciar Sesión
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
