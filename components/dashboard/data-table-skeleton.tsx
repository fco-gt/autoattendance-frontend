import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          {/* Header de la tabla */}
          <div className="flex border-b pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1">
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Filas de la tabla */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex py-4 border-b">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1">
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          ))}

          {/* Paginación */}
          <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
