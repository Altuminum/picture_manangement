import { SortConfig } from "@/types/sorting";

export function sortData<T>(data: T[], sortConfig: SortConfig | null): T[] {
  if (!sortConfig) return data;

  return [...data].sort((a: any, b: any) => {
    if (sortConfig.field === 'claimDate') {
      const dateA = a.claimDate ? new Date(a.claimDate).getTime() : 0;
      const dateB = b.claimDate ? new Date(b.claimDate).getTime() : 0;
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (a[sortConfig.field] < b[sortConfig.field]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.field] > b[sortConfig.field]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}