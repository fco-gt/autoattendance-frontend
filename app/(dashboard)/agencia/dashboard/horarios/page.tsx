"use client";

import { useSchedules, useDeleteSchedule } from "@/hooks/useSchedules";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleList from "@/components/schedules/schedule-list-table";

export default function ScheduleListPage() {
  const { data: schedules, isLoading } = useSchedules();
  const deleteMutation = useDeleteSchedule();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <ScheduleList
        schedules={schedules}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
