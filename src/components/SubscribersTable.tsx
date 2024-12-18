import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Pencil} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubscriberForm } from "./SubscriberForm";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { SortableTableHeader } from "./table/SortableTableHeader";
import { sortData } from "@/utils/sorting";
import { SortConfig } from "@/types/sorting";

interface SubscribersTableProps {
  subscribers: any[];
  onEdit: (subscriber: any) => void;
  onView: (subscriber: any) => void;
}

export function SubscribersTable({ 
  subscribers, 
  onEdit, 
  onView,
}: SubscribersTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current?.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedSubscribers = sortData(subscribers, sortConfig);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center"></TableHead>
              <SortableTableHeader
                field="fullName"
                label="Name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHead className="text-center">Student Number</TableHead>
              <TableHead className="text-center">Course</TableHead>
              <TableHead className="text-center">Package</TableHead>
              <TableHead className="text-center">Payment Status</TableHead>
              <SortableTableHeader
                field="claimDate"
                label="Claim Status"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="text-center">
                  <Avatar>
                    <AvatarImage
                      src={subscriber.pictureUrl}
                      alt={subscriber.fullName}
                    />
                    <AvatarFallback>{subscriber.fullName[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-center">{subscriber.fullName}</TableCell>
                <TableCell className="text-center">{subscriber.studentNumber}</TableCell>
                <TableCell className="text-center">{subscriber.degreeProgram}</TableCell>
                <TableCell className="text-center">{subscriber.package}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      subscriber.hasPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscriber.hasPaid ? "Paid" : "Unpaid"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {subscriber.claimDate ? (
                    <div className="text-sm">
                      <div>Claimed on: {subscriber.claimDate}</div>
                      <div>By: {subscriber.claimedBy}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Not claimed</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <Dialog>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Subscriber</DialogTitle>
                              <DialogDescription>
                                Update the subscriber's information below.
                              </DialogDescription>
                            </DialogHeader>
                            <SubscriberForm
                              onSubmit={(formData) => {
                                // Add the subscriber ID to the form data
                                if (formData instanceof FormData) {
                                  formData.append('id', subscriber.id);
                                }
                                onEdit(formData);
                              }}
                              initialData={subscriber}
                              mode="edit"
                            />
                          </DialogContent>
                        </Dialog>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => onView(subscriber)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
