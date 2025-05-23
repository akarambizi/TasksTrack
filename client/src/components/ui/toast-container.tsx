import * as React from "react";
import { Toaster } from "./toaster";
import { useToast } from "@/hooks/use-toast";
import { ToastProps, ToastService } from "@/services/toastService";

/**
 * ToastInitializer - Internal component to initialize the toast service
 */
const ToastInitializer: React.FC = () => {
  const { toast } = useToast();

  // Initialize the toast service on mount
  React.useEffect(() => {
    const originalShow = ToastService.show;

    ToastService.show = ({ title, description, type = "default", duration = 5000, action }: ToastProps) => {
      toast({
        title,
        description,
        variant: type === "error" ? "destructive" : "default",
        duration,
        // Handle the action properly
        action
      });
    };

    // Restore original method on unmount
    return () => {
      ToastService.show = originalShow;
    };
  }, [toast]);

  return null;
};

/**
 * ToastContainer - Component that provides the toast context
 * This should be used at the root of the application
 */
export const ToastContainer: React.FC = () => {
  return (
    <>
      <Toaster />
      <ToastInitializer />
    </>
  );
};
