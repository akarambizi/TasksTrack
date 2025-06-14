import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodoTaskData,
  getTodoTaskKey,
  createTask,
  updateTask,
  updateTaskCompletion,
  updateTaskPriority,
  deleteTask,
  getTaskById
} from '../api/toDoTask';
import { IToDoTask } from '../api/toDoTask.types';
import { ToastService } from '../services/toastService';

/**
 * Hook for fetching all tasks
 */
export const useTasks = (query = '') => {
  return useQuery({
    queryKey: getTodoTaskKey(query),
    queryFn: () => getTodoTaskData(query)
  });
};

/**
 * Hook for fetching a single task
 */
export const useTask = (id: number) => {
  return useQuery({
    queryKey: [...getTodoTaskKey(''), id],
    queryFn: () => getTaskById(id),
    enabled: !!id
  });
};

/**
 * Hook for creating a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Omit<IToDoTask, 'id' | 'createdDate' | 'createBy'>) =>
      createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoTaskKey('') });
    }
  });
};

/**
 * Hook for updating a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IToDoTask> }) =>
      updateTask(id, data),
    onSuccess: (updatedTask) => {
      // Update the task in the cache for optimistic UI updates
      queryClient.setQueryData<IToDoTask[] | undefined>(
        getTodoTaskKey(''),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );
      // Invalidate queries to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: getTodoTaskKey('') });
    }
  });
};

/**
 * Hook for toggling task completion
 */
export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      updateTaskCompletion(id, completed),
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: getTodoTaskKey('') });

      // Save previous data
      const previousData = queryClient.getQueryData<IToDoTask[]>(getTodoTaskKey(''));

      // Optimistically update the cache
      queryClient.setQueryData<IToDoTask[] | undefined>(
        getTodoTaskKey(''),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(task =>
            task.id === id ? { ...task, completed } : task
          );
        }
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // If there's an error, rollback to the previous state
      if (context?.previousData) {
        queryClient.setQueryData(getTodoTaskKey(''), context.previousData);
      }
      ToastService.error('Failed to update task');
    },
    onSuccess: () => {
      ToastService.success('Task updated successfully');
    },
    onSettled: () => {
      // Invalidate queries to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: getTodoTaskKey('') });
    }
  });
};

/**
 * Hook for updating task priority
 */
export const useUpdateTaskPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, priority }: { id: number; priority: 'low' | 'medium' | 'high' }) =>
      updateTaskPriority(id, priority),
    onMutate: async ({ id, priority }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: getTodoTaskKey('') });

      // Save previous data
      const previousData = queryClient.getQueryData<IToDoTask[]>(getTodoTaskKey(''));

      // Optimistically update the cache
      queryClient.setQueryData<IToDoTask[] | undefined>(
        getTodoTaskKey(''),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(task =>
            task.id === id ? { ...task, priority } : task
          );
        }
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // If there's an error, rollback to the previous state
      if (context?.previousData) {
        queryClient.setQueryData(getTodoTaskKey(''), context.previousData);
      }
      ToastService.error('Failed to update task priority');
    },
    onSuccess: () => {
      ToastService.success('Task priority updated successfully');
    },
    onSettled: () => {
      // Invalidate queries to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: getTodoTaskKey('') });
    }
  });
};

/**
 * Hook for deleting a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: getTodoTaskKey('') });

      // Save previous data
      const previousData = queryClient.getQueryData<IToDoTask[]>(getTodoTaskKey(''));

      // Optimistically update the cache
      queryClient.setQueryData<IToDoTask[] | undefined>(
        getTodoTaskKey(''),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(task => task.id !== id);
        }
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // If there's an error, rollback to the previous state
      if (context?.previousData) {
        queryClient.setQueryData(getTodoTaskKey(''), context.previousData);
      }
      ToastService.error('Failed to delete task');
    },
    onSuccess: () => {
      ToastService.success('Task deleted successfully');
    },
    onSettled: () => {
      // Invalidate queries to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: getTodoTaskKey('') });
    }
  });
};
