import { Card, CardContent } from "@/components/ui/card";
import { SubscriberDetailsDialog } from "@/components/SubscriberDetailsDialog";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { SubscriberFilters } from "@/components/SubscriberFilters";
import { format } from "date-fns";
import { SubscribersTable } from "@/components/SubscribersTable";

const Dashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [claimFilter, setClaimFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch subscribers from API
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/profiles');
        if (!response.ok) {
          throw new Error('Failed to fetch subscribers');
        }
        const data = await response.json();
        setSubscribers(data);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        toast({
          title: "Error",
          description: "Failed to load subscribers",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, [toast]);

  const handleAddSubscriber = async (formData: FormData) => {
    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:3001/api/profiles', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to add subscriber');
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      setSubscribers(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Subscriber added successfully",
      });
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add subscriber",
        variant: "destructive",
      });
    }
  };

  const handleEditSubscriber = async (formData: FormData) => {
    try {
      // Get the subscriber ID from the form data
      const subscriberId = formData.get('id');
      if (!subscriberId) {
        throw new Error('No subscriber ID found');
      }

      console.log('Editing subscriber:', subscriberId);
      console.log('Form data entries:', Array.from(formData.entries()));

      const response = await fetch(`http://localhost:3001/api/profiles/${subscriberId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to update subscriber');
      }

      const updated = await response.json();
      console.log('Server response:', updated);

      // Update the local state with the new data
      setSubscribers(prevSubscribers => {
        const newSubscribers = prevSubscribers.map(sub => 
          sub.id === subscriberId ? { ...sub, ...updated } : sub
        );
        console.log('Updated subscribers:', newSubscribers);
        return newSubscribers;
      });

      // Refresh the subscribers list
      const refreshResponse = await fetch('http://localhost:3001/api/profiles');
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setSubscribers(refreshedData);
      }

      // Close any open dialogs
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) {
        const closeButton = dialog.querySelector('button[aria-label="Close"]');
        if (closeButton instanceof HTMLButtonElement) {
          closeButton.click();
        }
      }

      toast({
        title: "Success",
        description: "Subscriber updated successfully",
      });
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update subscriber",
        variant: "destructive"
      });
    }
  };

  const handleViewSubscriber = (subscriber: any) => {
    setSelectedSubscriber(subscriber);
    setIsDetailsOpen(true);
  };

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || subscriber.degreeProgram === courseFilter;
    const matchesPackage =
      packageFilter === "all" || subscriber.package === packageFilter;
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid"
        ? subscriber.hasPaid
        : paymentFilter === "unpaid"
        ? !subscriber.hasPaid
        : true);
    const matchesClaim =
      claimFilter === "all" ||
      (claimFilter === "claimed"
        ? subscriber.claimDate
        : claimFilter === "unclaimed"
        ? !subscriber.claimDate
        : true);
    const matchesDate =
      !dateFilter ||
      (subscriber.claimDate &&
        format(new Date(subscriber.claimDate), "yyyy-MM-dd") ===
          format(dateFilter, "yyyy-MM-dd"));

    return (
      matchesSearch &&
      matchesCourse &&
      matchesPackage &&
      matchesPayment &&
      matchesClaim &&
      matchesDate
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddSubscriber={handleAddSubscriber} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Subscriber Management
              </h2>
              <p className="text-muted-foreground">
                Manage and track your subscribers
              </p>
            </div>

            <SubscriberFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              courseFilter={courseFilter}
              setCourseFilter={setCourseFilter}
              packageFilter={packageFilter}
              setPackageFilter={setPackageFilter}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              claimFilter={claimFilter}
              setClaimFilter={setClaimFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />

            <SubscribersTable
              subscribers={filteredSubscribers}
              onView={handleViewSubscriber}
              onEdit={handleEditSubscriber}
            />
          </CardContent>
        </Card>
      </main>
      
      <SubscriberDetailsDialog
        subscriber={selectedSubscriber}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default Dashboard;