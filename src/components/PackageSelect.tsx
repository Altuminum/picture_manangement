import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PACKAGE_OPTIONS } from "@/types/packages";
import { UseFormReturn } from "react-hook-form";

interface PackageSelectProps {
  form: UseFormReturn<any>;
}

export function PackageSelect({ form }: PackageSelectProps) {
  return (
    <FormField
      control={form.control}
      name="package"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Package</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {PACKAGE_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label} - ₱{option.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}