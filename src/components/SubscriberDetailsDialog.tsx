import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPackagePrice } from "@/types/packages";

interface SubscriberDetailsDialogProps {
  subscriber: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriberDetailsDialog({
  subscriber,
  open,
  onOpenChange,
}: SubscriberDetailsDialogProps) {
  if (!subscriber) return null;

  const packagePrice = getPackagePrice(subscriber.package);
  const formatDateTime = (dateString: string) => {
    if (!dateString) return null;
    return format(new Date(dateString), "hh:mm a, MMM dd yyyy");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscriber Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={subscriber.pictureUrl}
              alt={subscriber.fullName}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="grid gap-2">
            <div>
              <span className="font-semibold">Name:</span> {subscriber.fullName}
            </div>
            <div>
              <span className="font-semibold">Facebook Account:</span>{" "}
              {subscriber.facebookAccount || "Not provided"}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {subscriber.email || "Not provided"}
            </div>
            <div>
              <span className="font-semibold">Student Number:</span>{" "}
              {subscriber.studentNumber}
            </div>
            <div>
              <span className="font-semibold">Program:</span>{" "}
              {subscriber.degreeProgram}
            </div>
            <div>
              <span className="font-semibold">Package:</span>{" "}
              {subscriber.package} (₱{packagePrice})
            </div>
            <div>
              <span className="font-semibold">Payment Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  subscriber.hasPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {subscriber.hasPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
            {subscriber.claimDate && (
              <>
                <div>
                  <span className="font-semibold">Claim Date:</span>{" "}
                  {formatDateTime(subscriber.claimDate)}
                </div>
                <div>
                  <span className="font-semibold">Claimed By:</span>{" "}
                  {subscriber.claimedBy}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
