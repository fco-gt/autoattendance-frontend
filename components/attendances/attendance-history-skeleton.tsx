import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AttendanceHistorySkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-5 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-24" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16" />
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
