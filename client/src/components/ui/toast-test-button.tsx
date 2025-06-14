import React from 'react';
import { Button } from './button';
import { ToastService } from '@/services/toastService';

export const ToastTestButton: React.FC = () => {
  const showToasts = () => {
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
    <Button onClick={showToasts}>
      Test Toasts
    </Button>
  );
};
