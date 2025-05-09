"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { UserFrontend } from "@/types/FrontendTypes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserFrontend;
  onConfirm: () => Promise<any>;
  isLoading: boolean;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Eliminar Empleado
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a {user.name}{" "}
            {user.lastname || ""}?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer. El empleado perderá acceso a la
            plataforma y todos sus datos asociados.
          </p>

          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm font-medium">Información del empleado:</p>
            <ul className="mt-2 text-sm space-y-1">
              <li>
                <span className="font-medium">Nombre:</span> {user.name}{" "}
                {user.lastname || ""}
              </li>
              <li>
                <span className="font-medium">Correo:</span> {user.email}
              </li>
              <li>
                <span className="font-medium">Estado:</span> {user.status}
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Eliminando..." : "Eliminar Empleado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
