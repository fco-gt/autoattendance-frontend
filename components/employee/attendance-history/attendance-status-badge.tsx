"use client";

import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AttendanceStatus } from "@/types/FrontendTypes";
import { getStatusText, getStatusColor } from "@/utils/attendance";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

export function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case AttendanceStatus.ON_TIME:
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case AttendanceStatus.LATE:
        return <XCircle className="w-3 h-3 mr-1" />;
      default:
        return <AlertTriangle className="w-3 h-3 mr-1" />;
    }
  };

  const getVariant = () => {
    const color = getStatusColor(status);
    switch (color) {
      case "success":
        return "default" as const;
      case "destructive":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const getClassName = () => {
    switch (status) {
      case AttendanceStatus.ON_TIME:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case AttendanceStatus.LATE:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  return (
    <Badge variant={getVariant()} className={getClassName()}>
      {getIcon()}
      {getStatusText(status)}
    </Badge>
  );
}
