import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface ClaimStatusFieldProps {
  form: UseFormReturn<any>;
}

export function ClaimStatusField({ form }: ClaimStatusFieldProps) {
  // Set initial claim status based on existing data
  useEffect(() => {
    const values = form.getValues();
    const claimDate = values.claimDate;
    const claimedBy = values.claimedBy;
    const hasValidClaim = claimDate && claimDate !== 'Invalid date' && claimedBy && claimedBy !== '';
    
    if (hasValidClaim !== values.isClaimed) {
      form.setValue("isClaimed", hasValidClaim);
    }
  }, []);

  const handleClaimToggle = (checked: boolean) => {
    form.setValue("isClaimed", checked, { shouldDirty: true });
    
    if (!checked) {
      // When unclaiming, clear all claim-related data
      form.setValue("claimDate", "Invalid date", { shouldDirty: true });
      form.setValue("claimedBy", "", { shouldDirty: true });
    } else {
      // When claiming, set current date
      const now = new Date().toISOString();
      form.setValue("claimDate", now, { shouldDirty: true });
    }
  };

  const getClaimStatusDisplay = () => {
    const isClaimed = form.getValues("isClaimed");
    const claimDate = form.getValues("claimDate");
    const claimedBy = form.getValues("claimedBy");

    if (isClaimed && claimDate && claimDate !== 'Invalid date' && claimedBy && claimedBy !== '') {
      return (
        <div className="text-sm">
          <div>Claimed on: {claimDate}</div>
          <div>By: {claimedBy}</div>
        </div>
      );
    }
    return <div className="text-sm">Not claimed</div>;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isClaimed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Claim Status</FormLabel>
              {getClaimStatusDisplay()}
            </div>
            <FormControl>
              <Switch
                checked={field.value === true}
                onCheckedChange={handleClaimToggle}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.getValues("isClaimed") && (
        <>
          <FormField
            control={form.control}
            name="claimDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claim Date & Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!form.getValues("isClaimed")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="claimedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claimed By</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!form.getValues("isClaimed")}
                    placeholder="Enter name of claimer"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}