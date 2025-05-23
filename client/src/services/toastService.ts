
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

type ShowToastFunction = (props: ToastProps) => void;

// Default implementation that will be replaced by the initializer
const defaultShowToast: ShowToastFunction = ({ title, description, type }) => {
  console.warn(`Toast not initialized yet: ${type} - ${title} - ${description}`);
};

/**
 * ToastService - A service for displaying toast notifications
 */
export const ToastService = {
  // Show method will be replaced at runtime
  show: defaultShowToast as ShowToastFunction,

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
