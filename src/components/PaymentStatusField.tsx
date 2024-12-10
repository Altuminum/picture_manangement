import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface PaymentStatusFieldProps {
  form: UseFormReturn<any>;
}

export function PaymentStatusField({ form }: PaymentStatusFieldProps) {
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "paymentStatus") {
        // Clear partial amount if not partial payment
        if (value.paymentStatus !== "partial") {
          form.setValue("partialAmount", "");
        }

        // Set or clear payment date based on status
        if (value.paymentStatus === "full") {
          const now = new Date().toISOString().slice(0, 16);
          form.setValue("paymentDate", now);
        } else if (value.paymentStatus === "not_paid") {
          form.setValue("paymentDate", "");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="paymentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Status</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_paid" id="not_paid" />
                  <Label htmlFor="not_paid">Not Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial">Partial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Full</Label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("paymentStatus") === "partial" && (
        <FormField
          control={form.control}
          name="partialAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partial Payment Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : "");
                    
                    // Set payment date when partial amount is entered
                    if (value) {
                      const now = new Date().toISOString().slice(0, 16);
                      form.setValue("paymentDate", now);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="paymentDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Date & Time</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={form.watch("paymentStatus") === "not_paid"}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}