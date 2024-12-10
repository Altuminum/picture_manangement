import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DEGREE_PROGRAMS } from "@/data/degreePrograms";

interface SubscriberFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  courseFilter: string;
  setCourseFilter: (value: string) => void;
  packageFilter: string;
  setPackageFilter: (value: string) => void;
  paymentFilter: string;
  setPaymentFilter: (value: string) => void;
  claimFilter: string;
  setClaimFilter: (value: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
}

export function SubscriberFilters({
  searchTerm,
  setSearchTerm,
  courseFilter,
  setCourseFilter,
  packageFilter,
  setPackageFilter,
  paymentFilter,
  setPaymentFilter,
  claimFilter,
  setClaimFilter,
  dateFilter,
  setDateFilter,
}: SubscriberFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1">
        <Input
          placeholder="Search subscribers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={courseFilter} onValueChange={setCourseFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Courses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Courses</SelectItem>
          {DEGREE_PROGRAMS.map((program) => (
            <SelectItem key={program.name} value={program.name}>
              {program.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={packageFilter} onValueChange={setPackageFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Packages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Packages</SelectItem>
          <SelectItem value="Basic Package">Basic Package</SelectItem>
          <SelectItem value="With Frame">With Frame</SelectItem>
          <SelectItem value="Extra Pictures">Extra Pictures</SelectItem>
          <SelectItem value="Complete Package">Complete Package</SelectItem>
        </SelectContent>
      </Select>
      <Select value={paymentFilter} onValueChange={setPaymentFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>
      <Select value={claimFilter} onValueChange={setClaimFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Claim Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Claims</SelectItem>
          <SelectItem value="claimed">Claimed</SelectItem>
          <SelectItem value="unclaimed">Unclaimed</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[180px] justify-start text-left font-normal ${
              !dateFilter && "text-muted-foreground"
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFilter}
            onSelect={setDateFilter}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
