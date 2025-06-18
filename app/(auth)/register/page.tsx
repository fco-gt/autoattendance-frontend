"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";

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
import { toast } from "sonner";
import { registerAgency } from "@/lib/api/agencies";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Versión de prueba sin llamadas reales
  const handleRegisterStub = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", {
        description: "Por favor asegúrate de que las contraseñas coincidan.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await registerAgency({
        name,
        domain,
        password,
        address,
        phone,
      });

      setIsLoading(false);
      toast.success("Registro exitoso", {
        description: "Tu agencia ha sido registrada. Redireccionando...",
      });

      router.push("/agencia/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setIsLoading(false);
      toast.error(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[450px]">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear una Agencia
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa los detalles de tu agencia para crear una cuenta
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Registro de Agencia
            </CardTitle>
            <CardDescription>
              Completa el formulario para registrar tu agencia
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegisterStub} className="w-full">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Agencia</Label>
                <Input
                  id="name"
                  placeholder="Acme Inc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Correo del Administrador</Label>
                <Input
                  id="domain"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Este correo se utilizará para iniciar sesión y como tu dominio
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Calle Principal 123"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+56 9 1234 56789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="mt-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Agencia
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
