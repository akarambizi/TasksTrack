import * as React from "react";
import { Toaster } from "../components/ui/toaster";
// import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "../components/ui/toast";
import { useToast } from "@/hooks/use-toast";

/**
 * Props for the Toast component
 */
export interface ToastProps {
  title?: string;
  description: string;
  type?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
  action?: React.ReactNode;
}

/**
 * ToastService - A service for displaying toast notifications
 */
export const ToastService = {
  /**
   * Show a toast notification with the given options
   * @param options - Toast options
   */
  show: ({ title, description, type = "default", duration = 5000, action }: ToastProps) => {
    // This will be replaced by the actual implementation in the hook
  },

  /**
   * Show a success toast
   * @param message - Message to display
   * @param title - Optional title
   */
  success: (message: string, title = "Success") => {
    ToastService.show({ title, description: message, type: "success" });
  },

  /**
   * Show an error toast
   * @param message - Message to display
   * @param title - Optional title
   */
  error: (message: string, title = "Error") => {
    ToastService.show({ title, description: message, type: "error" });
  },

  /**
   * Show a warning toast
   * @param message - Message to display
   * @param title - Optional title
   */
  warning: (message: string, title = "Warning") => {
    ToastService.show({ title, description: message, type: "warning" });
  },

  /**
   * Show an info toast
   * @param message - Message to display
   * @param title - Optional title
   */
  info: (message: string, title = "Info") => {
    ToastService.show({ title, description: message, type: "info" });
  }
};

/**
 * ToastContainer - Component that provides the toast context
 * This should be used at the root of the application
 */
export const ToastContainer: React.FC = () => {
  return <Toaster />;
};

/**
 * useToastService - Hook for using the toast service
 * This makes it easier to use toast notifications in components
 */
export const useToastService = () => {
  const { toast } = useToast();

  // Override the show method to use the useToast hook
  React.useEffect(() => {
    const originalShow = ToastService.show;

    ToastService.show = ({ title, description, type = "default", duration = 5000, action }: ToastProps) => {
      toast({
        title,
        description,
        variant: type === "error" ? "destructive" : "default",
        duration,
        action: React.isValidElement(action) ? action as any : undefined,
      });
    };

    // Restore original method on unmount
    return () => {
      ToastService.show = originalShow;
    };
  }, [toast]);

  return ToastService;
};
