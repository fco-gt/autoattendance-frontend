"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ScheduleListPageSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <Card>
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" /> {/* "Horarios" title */}
          </div>
          <Skeleton className="h-10 w-36" /> {/* "Nuevo Horario" button */}
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-16" /> {/* "Nombre" */}
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" /> {/* "Días" */}
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" /> {/* "Entrada" */}
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-14" /> {/* "Salida" */}
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" /> {/* "Tolerancia" */}
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" /> {/* "Acciones" */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {/* Nombre Column */}
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" /> {/* Schedule name */}
                      {index === 0 && <Skeleton className="h-4 w-24" />}{" "}
                      {/* "Predeterminado" badge for first row */}
                    </div>
                  </TableCell>

                  {/* Días Column */}
                  <TableCell>
                    <Skeleton className="h-4 w-28" /> {/* Days of week */}
                  </TableCell>

                  {/* Entrada Column */}
                  <TableCell>
                    <Skeleton className="h-4 w-12" /> {/* Entry time */}
                  </TableCell>

                  {/* Salida Column */}
                  <TableCell>
                    <Skeleton className="h-4 w-12" /> {/* Exit time */}
                  </TableCell>

                  {/* Tolerancia Column */}
                  <TableCell>
                    <Skeleton className="h-4 w-16" /> {/* Grace period */}
                  </TableCell>

                  {/* Acciones Column */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-20" /> {/* Edit button */}
                      <Skeleton className="h-8 w-24" /> {/* Delete button */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
