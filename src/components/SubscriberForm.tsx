import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { PackageSelect } from "./PackageSelect";
import { PaymentStatusField } from "./PaymentStatusField";
import { ClaimStatusField } from "./ClaimStatusField";
import { DegreeSelect } from "./DegreeSelect";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  studentNumber: z.string().min(4, "Student number must be at least 4 characters"),
  degreeProgram: z.string().min(1, "Please select a degree program"),
  package: z.string().min(1, "Please select a package"),
  paymentStatus: z.enum(["not_paid", "partial", "full"]).default("not_paid"),
  partialAmount: z.union([z.number(), z.string()]).optional().transform(val => val === "" ? null : Number(val)),
  paymentDate: z.string().optional().nullable().transform(val => val || ""),
  isClaimed: z.boolean().default(false),
  claimDate: z.string().optional().nullable().transform(val => val || ""),
  claimedBy: z.string().optional().nullable().transform(val => val || ""),
  facebookAccount: z.string().optional().default(""),
  email: z.string().email("Invalid email address").optional().default(""),
  picture: z.any().optional().nullable(),
});

interface SubscriberFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function SubscriberForm({ onSubmit, initialData, mode = "create" }: SubscriberFormProps) {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.pictureUrl || "/placeholder.svg");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      studentNumber: initialData?.studentNumber || "",
      degreeProgram: initialData?.degreeProgram || "",
      package: initialData?.package || "",
      paymentStatus: initialData?.paymentStatus || "not_paid",
      partialAmount: initialData?.partialAmount || "",
      paymentDate: initialData?.paymentDate || "",
      isClaimed: initialData?.isClaimed || false,
      claimDate: initialData?.claimDate || "",
      claimedBy: initialData?.claimedBy || "",
      facebookAccount: initialData?.facebookAccount || "",
      email: initialData?.email || "",
      picture: null,
    },
  });

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      form.setValue("picture", file);
    } else {
      setPreviewUrl("/placeholder.svg");
      form.setValue("picture", null);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(values).forEach(key => {
      if (key !== 'picture') {
        // Only append if the value is not null/undefined
        if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key].toString());
        }
      }
    });

    // Add the picture if it exists
    if (values.picture) {
      formData.append('picture', values.picture);
    }

    onSubmit(formData);
    
    if (mode === "create") {
      form.reset();
      setPreviewUrl("/placeholder.svg");
    }
    toast({
      title: "Success",
      description: `Subscriber ${mode === "create" ? "added" : "updated"} successfully`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={previewUrl} alt="Preview" />
            <AvatarFallback>Upload</AvatarFallback>
          </Avatar>
        </div>

        <FormField
          control={form.control}
          name="picture"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Picture (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handlePictureChange(e);
                    onChange(e.target.files?.[0] || "");
                  }}
                  value=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Account</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Facebook profile URL or username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DegreeSelect form={form} />
        <PackageSelect form={form} />
        <PaymentStatusField form={form} />
        <ClaimStatusField form={form} />

        <Button type="submit">
          {mode === "create" ? "Add Subscriber" : "Update Subscriber"}
        </Button>
      </form>
    </Form>
  );
}