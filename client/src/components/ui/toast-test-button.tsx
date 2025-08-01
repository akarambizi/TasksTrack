import React from 'react';
import { Button } from './button';
import { ToastService } from '@/services/toastService';
import { useToast } from '@/hooks/use-toast';

export const ToastTestButton: React.FC = () => {
  const { toast } = useToast();

  const showDirectToasts = () => {
    // Show toasts directly without using the service
    toast({
      title: "Direct Toast",
      description: "This is a direct toast using the hook",
      variant: "default",
    });
  };

  const showServiceToasts = () => {
    ToastService.info('This is an info toast');

    setTimeout(() => {
      ToastService.success('Operation completed successfully');
    }, 1000);

    setTimeout(() => {
      ToastService.warning('This is a warning message');
    }, 2000);

    setTimeout(() => {
      ToastService.error('Something went wrong!');
    }, 3000);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={showDirectToasts} className="mb-2">
        Test Direct Toasts
      </Button>
      <Button onClick={showServiceToasts} variant="outline">
        Test Service Toasts
      </Button>
    </div>
  );
};
