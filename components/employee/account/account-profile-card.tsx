import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "./user-avatar";
import { InfoField } from "./info-field";
import { LocationInfo } from "./location-info";
import { User, Mail, Building2, Hash } from "lucide-react";
import type { UserFrontend } from "@/types/FrontendTypes";

interface AccountProfileCardProps {
  user: UserFrontend;
}

export function AccountProfileCard({ user }: AccountProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl">Información Personal</CardTitle>
            <CardDescription>Detalles de tu perfil de usuario</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar y información principal */}
        <UserAvatar
          name={user.name}
          lastname={user.lastname}
          email={user.email}
          status={user.status}
          size="lg"
        />

        {/* Grid de información */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoField
              label="Nombre"
              value={user.name}
              icon={<User className="h-4 w-4" />}
            />

            <InfoField
              label="Apellido"
              value={user.lastname}
              icon={<User className="h-4 w-4" />}
              placeholder="No especificado"
            />

            <InfoField
              label="Correo electrónico"
              value={user.email}
              icon={<Mail className="h-4 w-4" />}
              copyable
            />

            <InfoField
              label="ID de Agencia"
              value={user.agencyId}
              icon={<Building2 className="h-4 w-4" />}
              copyable
              placeholder="Sin asignar"
            />

            <InfoField
              label="ID de Usuario"
              value={user.id}
              icon={<Hash className="h-4 w-4" />}
              copyable
            />
          </div>

          <div className="space-y-4">
            <LocationInfo
              latitude={user.homeLatitude}
              longitude={user.homeLongitude}
              radiusMeters={user.homeRadiusMeters}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
