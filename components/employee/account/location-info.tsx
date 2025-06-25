"use client";

import { InfoField } from "./info-field";
import { MapPin, Navigation, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationInfoProps {
  latitude?: number | null;
  longitude?: number | null;
  radiusMeters?: number | null;
}

export function LocationInfo({
  latitude,
  longitude,
  radiusMeters,
}: LocationInfoProps) {
  const formatCoordinate = (lat?: number | null, lng?: number | null) => {
    if (
      lat === null ||
      lat === undefined ||
      lng === null ||
      lng === undefined
    ) {
      return undefined;
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatRadius = (meters?: number | null) => {
    if (meters === null || meters === undefined) {
      return undefined;
    }
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} metros`;
  };

  const openInMaps = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
    }
  };

  const hasLocation = latitude !== null && longitude !== null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Ubicación de Trabajo
      </h4>

      <div className="space-y-3">
        <InfoField
          label="Coordenadas"
          value={formatCoordinate(latitude, longitude)}
          icon={<Navigation className="h-4 w-4" />}
          copyable
          placeholder="No configurada"
        />

        <InfoField
          label="Radio de trabajo"
          value={formatRadius(radiusMeters)}
          icon={<Target className="h-4 w-4" />}
          placeholder="No especificado"
        />

        {hasLocation && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openInMaps}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Ver en Google Maps
            </Button>
          </div>
        )}
      </div>

      {!hasLocation && (
        <div className="p-3 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground text-center">
            No se ha configurado una ubicación de trabajo para este usuario.
          </p>
        </div>
      )}
    </div>
  );
}
