import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface SubscriberMultiSelectToolbarProps {
  selectedIds: string[];
  onSelectAll: () => void;
  onDelete: (ids: string[]) => void;
  totalCount: number;
}

export function SubscriberMultiSelectToolbar({
  selectedIds,
  onSelectAll,
  onDelete,
  totalCount,
}: SubscriberMultiSelectToolbarProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 p-2 bg-accent rounded-lg animate-fade-in">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} of {totalCount} selected
      </span>

      <Button variant="outline" size="sm" onClick={onSelectAll}>
        Select All
      </Button>

      <div className="flex-1" />

      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Selected
      </Button>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length} selected subscriber(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onDelete(selectedIds);
              setIsDeleteDialogOpen(false);
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}