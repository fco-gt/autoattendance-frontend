"use client";

import { useState } from "react";

export default function Page() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setLoading(false);
      },
      (err) => {
        setError("Error al obtener la ubicación: " + err.message);
        setLoading(false);
      }
    );
  };

  const guardarUbicacion = async () => {
    if (!location) return;
    const response = await fetch("/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "4c118501-929c-4ea1-a7c0-5c152c03997c", // ID del usuario
        homeLatitude: location.lat,
        homeLongitude: location.lng,
        homeRadiusMeters: 100,
      }),
    });

    const data = await response.json();
    console.log("✅ Respuesta del backend:", data);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">
        Establecer ubicación del usuario
      </h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
        onClick={getLocation}
        disabled={loading}
      >
        {loading ? "Obteniendo ubicación..." : "Obtener ubicación"}
      </button>

      {location && (
        <div className="mb-2">
          <p>📍 Latitud: {location.lat}</p>
          <p>📍 Longitud: {location.lng}</p>
          <button
            onClick={guardarUbicacion}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Guardar ubicación
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
