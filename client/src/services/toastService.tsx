// Old implementation. This file is kept for backward compatibility
// The implementation has been moved to:
// - /src/services/toastService.ts (service)
// - /src/components/ui/toast-container.tsx (component)

// Re-export from the new files
export { ToastService } from './toastService';
export type { ToastProps } from './toastService';
export { ToastContainer } from '@/components/ui/toast-container';
