"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ActivationForm } from "@/components/activateInvitation/activation-form";
import { ActivationSuccess } from "@/components/activateInvitation/activation-success";
import ActivationError from "@/components/activateInvitation/activation-error";
import { useVerifyToken, useActivateUser } from "@/hooks/useActivateInvitation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState<"loading" | "form" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const verifyToken = useVerifyToken();
  const activateUser = useActivateUser();

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    (async () => {
      try {
        await verifyToken.mutateAsync({ activationCode: token });
        setStep("form");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Error al validar el token de invitación");
        }
        setStep("error");
      }
    })();
  }, [token, router]);

  const handleRetry = () => {
    if (token) {
      setStep("loading");
      verifyToken
        .mutateAsync({ activationCode: token })
        .then(() => setStep("form"))
        .catch((error) => {
          setErrorMessage(
            error.message || "Token de invitación inválido o expirado"
          );
          setStep("error");
        });
    }
  };

  const handleActivate = async (password: string) => {
    if (!token) return;

    try {
      await activateUser.mutateAsync({ activationCode: token, password });
      setStep("success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error al activar la cuenta");
      }
    }
  };

  // Renderizar según el paso actual
  if (step === "loading" || verifyToken.isPending || activateUser.isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Activando invitación</h1>
            <p className="text-muted-foreground">
              Verificando tu token de invitación...
            </p>
          </div>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "form") {
    return (
      <ActivationForm
        onActivate={handleActivate}
        isLoading={activateUser.isPending}
      />
    );
  }

  if (step === "success") {
    return <ActivationSuccess />;
  }

  if (step === "error") {
    return <ActivationError message={errorMessage} onRetry={handleRetry} />;
  }

  return null;
}
