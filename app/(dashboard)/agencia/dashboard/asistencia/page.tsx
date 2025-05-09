"use client";

import { useState } from "react";
import {
  useAttendanceHistory,
  useManualAttendance,
} from "@/hooks/useAttendance";

export default function Page() {
  // Rango de fechas para el historial
  const [range, setRange] = useState({
    startDate: "2025-05-01",
    endDate: "2025-05-09",
  });

  // Hook para obtener historial; isLoading existe en useQuery v5 :contentReference[oaicite:2]{index=2}
  const { data: history, isLoading, error } = useAttendanceHistory(range);

  // Hook para marcaje manual; isPending existe en useMutation v5 :contentReference[oaicite:3]{index=3}
  const manual = useManualAttendance();

  // Estado de carga del historial
  if (isLoading) {
    return <p className="text-center py-8">Cargando historial…</p>;
  }

  // Error al cargar
  if (error) {
    return (
      <p className="text-center py-8 text-destructive">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <button
        onClick={() =>
          manual.mutate({
            userId: "b70200f0-64ae-4a86-bec8-6c440dda95d3",
            type: "check-in",
            notes: "Llegada",
          })
        }
        disabled={manual.isPending} // disable while pending :contentReference[oaicite:4]{index=4}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {manual.isPending ? "Marcando…" : "Marcar entrada"}
      </button>

      <ul className="space-y-2">
        {history?.map((att) => (
          <li key={att.id} className="border px-3 py-2 rounded">
            <span className="font-medium">{att.userId}</span> –{" "}
            <span className="capitalize">
              {att.methodIn} || {att.methodOut}
            </span>{" "}
            a las{" "}
            <span className="font-mono">
              {att.scheduleEntryTime} a las {att.scheduleExitTime}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
