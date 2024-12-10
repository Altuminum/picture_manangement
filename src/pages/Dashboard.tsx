import { Card, CardContent } from "@/components/ui/card";
import { SubscriberDetailsDialog } from "@/components/SubscriberDetailsDialog";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { SubscriberFilters } from "@/components/SubscriberFilters";
import { format } from "date-fns";
import { SubscribersTable } from "@/components/SubscribersTable";
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

const Dashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [claimFilter, setClaimFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleConfirmDelete = async (selectedIds?: string[]) => {
    try {
      if (selectedIds && selectedIds.length > 0) {
        // Bulk delete
        const response = await fetch('http://localhost:3001/api/profiles/bulk', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete subscribers');
        }

        setSubscribers(prev =>
          prev.filter(sub => !selectedIds.includes(sub.id))
        );
      } else if (selectedSubscriber) {
        // Single delete
        const response = await fetch(`http://localhost:3001/api/profiles/${selectedSubscriber.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete subscriber');
        }

        setSubscribers(prev =>
          prev.filter(sub => sub.id !== selectedSubscriber.id)
        );
      }

      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Subscriber(s) deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subscriber(s):', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete subscriber(s)",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    try {
      const deletePromises = ids.map(id =>
        fetch(`http://localhost:3001/api/profiles/${id}`, {
          method: 'DELETE'
        })
      );

      await Promise.all(deletePromises);

      setSubscribers(prev => prev.filter(sub => !ids.includes(sub.id)));

      toast({
        title: "Success",
        description: `${ids.length} subscriber(s) deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscribers",
        variant: "destructive"
      });
    }
  };

  const handleViewSubscriber = (subscriber: any) => {
    setSelectedSubscriber(subscriber);
    setIsDetailsOpen(true);
  };

  const handleDeleteSubscriber = (subscriber: any) => {
    setSelectedSubscriber(subscriber);
    setIsDeleteDialogOpen(true);
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
              onDelete={handleDeleteSubscriber}
              onMultiDelete={handleDeleteMultiple}
            />
          </CardContent>
        </Card>
      </main>

      <SubscriberDetailsDialog
        subscriber={selectedSubscriber}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIds && selectedIds.length > 0
                ? `This will permanently delete ${selectedIds.length} selected subscribers.`
                : "This will permanently delete this subscriber."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedIds([]);
              setSelectedSubscriber(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmDelete(selectedIds)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;