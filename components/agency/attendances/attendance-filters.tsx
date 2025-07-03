"use client";

import {
  Search,
  X,
  Filter,
  QrCode,
  Settings,
  MapPinHouse,
  SmartphoneNfc,
} from "lucide-react";
import {
  AttendanceStatus,
  AttendanceMethod,
  type UserFrontend,
} from "@/types/FrontendTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "./date-range-picker";
import type { DateRange } from "react-day-picker";
import type { FilterState } from "@/app//(dashboard)/agencia/dashboard/asistencia/page";

interface AttendanceFiltersProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  filteredUsers: UserFrontend[];
  getUserFullName: (userId: string) => string;
}

export function AttendanceFilters({
  filters,
  updateFilter,
  clearAllFilters,
  activeFiltersCount,
  dateRange,
  setDateRange,
  filteredUsers,
  getUserFullName,
}: AttendanceFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center text-slate-900 dark:text-slate-100">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Date Range Filter */}
        <div className="xl:col-span-2">
          <Label
            htmlFor="date-range"
            className="text-sm font-medium mb-2 block"
          >
            Rango de Fechas
          </Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        {/* User Search Filter */}
        <div>
          <Label
            htmlFor="user-search"
            className="text-sm font-medium mb-2 block"
          >
            Buscar Usuario
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="user-search"
              placeholder="ID, email o nombre..."
              value={filters.userSearch}
              onChange={(e) => updateFilter("userSearch", e.target.value)}
              className="pl-8"
            />
            {filters.userSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={() => updateFilter("userSearch", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* User Dropdown Filter */}
        <div>
          <Label
            htmlFor="user-select"
            className="text-sm font-medium mb-2 block"
          >
            Seleccionar Usuario
          </Label>
          <Select
            value={filters.selectedUserId}
            onValueChange={(value) =>
              updateFilter("selectedUserId", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los usuarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios</SelectItem>
              {filteredUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.name} {user.lastname || ""}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <Label
            htmlFor="status-filter"
            className="text-sm font-medium mb-2 block"
          >
            Estado
          </Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              updateFilter("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value={AttendanceStatus.ON_TIME}>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />A
                  Tiempo
                </div>
              </SelectItem>
              <SelectItem value={AttendanceStatus.LATE}>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  Tarde
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entry Method Filter */}
        <div>
          <Label
            htmlFor="entry-method"
            className="text-sm font-medium mb-2 block"
          >
            Método Entrada
          </Label>
          <Select
            value={filters.entryMethod}
            onValueChange={(value) =>
              updateFilter("entryMethod", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los métodos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los métodos</SelectItem>
              <SelectItem value={AttendanceMethod.MANUAL}>
                <div className="flex items-center">
                  <Settings className="w-3 h-3 mr-2" />
                  Manual
                </div>
              </SelectItem>
              <SelectItem value={AttendanceMethod.QR}>
                <div className="flex items-center">
                  <QrCode className="w-3 h-3 mr-2" />
                  QR
                </div>
              </SelectItem>
              <SelectItem value={AttendanceMethod.TELEWORK}>
                <div className="flex items-center">
                  <MapPinHouse className="w-3 h-3 mr-2" />
                  Teletrabajo
                </div>
              </SelectItem>
              <SelectItem value={AttendanceMethod.NFC}>
                <div className="flex items-center">
                  <SmartphoneNfc className="w-3 h-3 mr-2" />
                  NFC
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Exit Method Filter */}
        <div>
          <Label
            htmlFor="exit-method"
            className="text-sm font-medium mb-2 block"
          >
            Método Salida
          </Label>
          <Select
            value={filters.exitMethod}
            onValueChange={(value) =>
              updateFilter("exitMethod", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los métodos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los métodos</SelectItem>
              <SelectItem value={AttendanceMethod.MANUAL}>
                <div className="flex items-center">
                  <Settings className="w-3 h-3 mr-2" />
                  Manual
                </div>
              </SelectItem>
              <SelectItem value={AttendanceMethod.QR}>
                <div className="flex items-center">
                  <QrCode className="w-3 h-3 mr-2" />
                  QR
                </div>
              </SelectItem>
              <SelectItem value={AttendanceMethod.TELEWORK}>
                <div className="flex items-center">
                  <MapPinHouse className="w-3 h-3 mr-2" />
                  Teletrabajo
                </div>
              </SelectItem>
              <SelectItem value={AttendanceMethod.NFC}>
                <div className="flex items-center">
                  <SmartphoneNfc className="w-3 h-3 mr-2" />
                  NFC
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Filtros activos:
            </span>
            {filters.userSearch && (
              <Badge variant="secondary" className="gap-1">
                Búsqueda: {filters.userSearch}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilter("userSearch", "")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.selectedUserId && (
              <Badge variant="secondary" className="gap-1">
                Usuario: {getUserFullName(filters.selectedUserId)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilter("selectedUserId", "")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Estado:{" "}
                {filters.status === AttendanceStatus.ON_TIME
                  ? "A Tiempo"
                  : "Tarde"}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilter("status", "")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.entryMethod && (
              <Badge variant="secondary" className="gap-1">
                Entrada: {filters.entryMethod}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilter("entryMethod", "")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.exitMethod && (
              <Badge variant="secondary" className="gap-1">
                Salida: {filters.exitMethod}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilter("exitMethod", "")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
