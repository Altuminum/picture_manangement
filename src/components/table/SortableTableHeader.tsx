import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortConfig } from "@/types/sorting";

interface SortableTableHeaderProps {
  field: string;
  label: string;
  currentSort: SortConfig | null;
  onSort: (field: string) => void;
}

export function SortableTableHeader({
  field,
  label,
  currentSort,
  onSort,
}: SortableTableHeaderProps) {
  return (
    <TableHead className="text-center">
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-8 w-full flex items-center justify-center"
      >
        {label}
        {currentSort?.field === field && (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </TableHead>
  );
}