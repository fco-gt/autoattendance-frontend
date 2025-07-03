"use client";

import { useMemo } from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserFrontendStatus, type UserFrontend } from "@/types/FrontendTypes";

interface UserOverviewProps {
  users: UserFrontend[];
}

export function UserOverview({ users }: UserOverviewProps) {
  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(
      (user) => user.status === UserFrontendStatus.ACTIVE
    ).length;
    const pending = users.filter(
      (user) => user.status === UserFrontendStatus.PENDING
    ).length;
    const inactive = users.filter(
      (user) => user.status === UserFrontendStatus.INACTIVE
    ).length;

    return {
      total,
      active,
      pending,
      inactive,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
      pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0,
    };
  }, [users]);

  const recentUsers = useMemo(() => {
    return users
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [users]);

  const getStatusIcon = (status: UserFrontendStatus) => {
    switch (status) {
      case UserFrontendStatus.ACTIVE:
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case UserFrontendStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case UserFrontendStatus.INACTIVE:
        return <UserX className="h-4 w-4 text-red-600" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: UserFrontendStatus) => {
    switch (status) {
      case UserFrontendStatus.ACTIVE:
        return <Badge variant="default">Activo</Badge>;
      case UserFrontendStatus.PENDING:
        return <Badge variant="secondary">Pendiente</Badge>;
      case UserFrontendStatus.INACTIVE:
        return <Badge variant="outline">Inactivo</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Resumen de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Statistics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Usuarios Activos</span>
            <span className="text-sm text-muted-foreground">
              {userStats.active}/{userStats.total}
            </span>
          </div>
          <Progress value={userStats.activePercentage} className="h-2" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Usuarios Pendientes</span>
            <span className="text-sm text-muted-foreground">
              {userStats.pending}/{userStats.total}
            </span>
          </div>
          <Progress
            value={userStats.pendingPercentage}
            className="h-2 bg-yellow-100"
          />
        </div>

        {/* Recent Users */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Usuarios Recientes</h4>
          <div className="space-y-2">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <div>
                      <p className="text-sm font-medium">
                        {user.name} {user.lastname || ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(user.status)}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay usuarios</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
