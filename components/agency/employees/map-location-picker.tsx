"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon, Map as LeafletMap } from "leaflet";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MapLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number | null, lng: number | null) => void;
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to handle map events
function MapEventHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapLocationPicker({
  latitude,
  longitude,
  onChange,
}: MapLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const mapRef = useRef<LeafletMap | null>(null);

  // Default position (Santiago, Chile) if no position is set
  const defaultPosition: [number, number] = [-33.4489, -70.6693];

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Handle location change from map click
  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange(lat, lng);
    fetchAddressFromCoordinates(lat, lng);
  };

  // Search for address and update map
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = Number.parseFloat(lat);
        const longitude = Number.parseFloat(lon);

        setPosition([latitude, longitude]);
        onChange(latitude, longitude);

        // Center map on the new location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
        }
      } else {
        setSearchError("No se encontraron resultados para esta dirección");
      }
    } catch (error) {
      setSearchError("Error al buscar la dirección");
      console.error("Error searching for address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Get address from coordinates for display
  const [address, setAddress] = useState<string | null>(null);

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch address when position changes
  useEffect(() => {
    if (position) {
      fetchAddressFromCoordinates(position[0], position[1]);
    }
  }, [position]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar dirección..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>

      {searchError && (
        <Alert variant="destructive">
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="h-[300px] w-full rounded-md overflow-hidden">
            <MapContainer
              center={position || defaultPosition}
              zoom={position ? 16 : 13}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEventHandler onLocationChange={handleLocationChange} />
              {position && <Marker position={position} icon={customIcon} />}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {address && (
        <div className="text-sm text-muted-foreground">
          <strong>Dirección:</strong> {address}
        </div>
      )}

      {position && (
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <strong>Latitud:</strong> {position[0].toFixed(6)}
          </div>
          <div>
            <strong>Longitud:</strong> {position[1].toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
}
