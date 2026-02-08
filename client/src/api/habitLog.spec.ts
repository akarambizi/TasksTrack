import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createHabitLog,
    updateHabitLog,
    deleteHabitLog,
    getHabitLogsByHabitId,
    getHabitLogsByDate
} from './habitLog';
import { apiPost, apiPut, apiDelete, apiGet } from './apiClient';
import { ToastService } from '../services/toastService';

// Mock dependencies
vi.mock('./apiClient');
vi.mock('../services/toastService');

const mockApiPost = vi.mocked(apiPost);
const mockApiPut = vi.mocked(apiPut);
const mockApiDelete = vi.mocked(apiDelete);
const mockApiGet = vi.mocked(apiGet);

describe('habitLog API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createHabitLog', () => {
        it('should create a habit log successfully', async () => {
            const mockRequest = {
                habitId: 1,
                value: 30.5,
                date: '2024-01-15',
                notes: 'Great session today!',
                createdBy: 'test-user-id'
            };
            const mockResponse = { id: 1, ...mockRequest };

            mockApiPost.mockResolvedValueOnce(mockResponse);

            const result = await createHabitLog(mockRequest);

            // The API function adds createdDate, so we expect that in the call
            expect(mockApiPost).toHaveBeenCalledWith('/api/habit-logs', expect.objectContaining({
                habitId: 1,
                value: 30.5,
                date: '2024-01-15',
                notes: 'Great session today!',
                createdBy: 'test-user-id',
                createdDate: expect.any(String)
            }));
            expect(ToastService.success).toHaveBeenCalledWith('Habit log created successfully');
            expect(result).toEqual(mockResponse);
        });

        it('should handle create errors with toast', async () => {
            const mockRequest = {
                habitId: 1,
                value: 30.5,
                date: '2024-01-15',
                notes: 'Test',
                createdBy: 'test-user-id'
            };
            const errorMessage = 'Failed to create log';

            mockApiPost.mockRejectedValueOnce(new Error(errorMessage));

            await expect(createHabitLog(mockRequest)).rejects.toThrow(errorMessage);
            expect(ToastService.error).toHaveBeenCalledWith('Failed to create habit log');
        });
    });

    describe('updateHabitLog', () => {
        it('should update a habit log successfully', async () => {
            const logId = 1;
            const mockRequest = {
                id: logId,
                habitId: 1,
                value: 45,
                date: '2024-01-15',
                notes: 'Updated notes',
                createdBy: 'test-user'
            };


            mockApiPut.mockResolvedValueOnce(undefined);

            await updateHabitLog(mockRequest);

            expect(mockApiPut).toHaveBeenCalledWith(`/api/habit-logs/${logId}`, mockRequest);
            expect(ToastService.success).toHaveBeenCalledWith('Habit log updated successfully');
        });

        it('should handle update errors with toast', async () => {
            const logId = 1;
            const errorMessage = 'Failed to update';
            const mockRequest = {
                habitId: 1,
                value: 45,
                date: '2024-01-15',
                createdBy: 'test-user'
            };

            mockApiPut.mockRejectedValueOnce(new Error(errorMessage));

            await expect(updateHabitLog({ id: logId, ...mockRequest })).rejects.toThrow(errorMessage);
            expect(ToastService.error).toHaveBeenCalledWith('Failed to update habit log');
        });
    });

    describe('deleteHabitLog', () => {
        it('should delete a habit log successfully', async () => {
            const logId = 1;

            mockApiDelete.mockResolvedValueOnce(undefined);

            await deleteHabitLog(logId);

            expect(mockApiDelete).toHaveBeenCalledWith(`/api/habit-logs/${logId}`);
            expect(ToastService.success).toHaveBeenCalledWith('Habit log deleted successfully');
        });

        it('should handle delete errors with toast', async () => {
            const logId = 1;
            const errorMessage = 'Failed to delete';

            mockApiDelete.mockRejectedValueOnce(new Error(errorMessage));

            await expect(deleteHabitLog(logId)).rejects.toThrow(errorMessage);
            expect(ToastService.error).toHaveBeenCalledWith('Failed to delete habit log');
        });
    });

    describe('getHabitLogsByHabitId', () => {
        it('should fetch habit logs by habit ID', async () => {
            const habitId = 1;
            const mockLogs = [
                { id: 1, habitId: 1, value: 30, date: '2024-01-15', notes: 'Test' }
            ];

            mockApiGet.mockResolvedValueOnce(mockLogs);

            const result = await getHabitLogsByHabitId(habitId);

            expect(mockApiGet).toHaveBeenCalledWith(`/api/habit-logs/habit/${habitId}`);
            expect(result).toEqual(mockLogs);
        });

        it('should fetch habit logs with limit', async () => {
            const habitId = 1;
            const limit = 5;
            const mockLogs = [
                { id: 1, habitId: 1, value: 30, date: '2024-01-15', notes: 'Test' }
            ];

            mockApiGet.mockResolvedValueOnce(mockLogs);

            const result = await getHabitLogsByHabitId(habitId, limit);

            expect(mockApiGet).toHaveBeenCalledWith(`/api/habit-logs/habit/${habitId}?limit=${limit}`);
            expect(result).toEqual(mockLogs);
        });

        it('should handle fetch errors', async () => {
            const habitId = 1;
            const errorMessage = 'Failed to fetch logs';

            mockApiGet.mockRejectedValueOnce(new Error(errorMessage));

            await expect(getHabitLogsByHabitId(habitId)).rejects.toThrow(errorMessage);
        });
    });

    describe('getHabitLogsByDate', () => {
        it('should fetch habit logs by date', async () => {
            const date = '2024-01-15';
            const mockLogs = [
                { id: 1, habitId: 1, value: 30, date: '2024-01-15', notes: 'Test' }
            ];

            mockApiGet.mockResolvedValueOnce(mockLogs);

            const result = await getHabitLogsByDate(date);

            expect(mockApiGet).toHaveBeenCalledWith(`/api/habit-logs/date/${date}`);
            expect(result).toEqual(mockLogs);
        });

        it('should handle fetch by date errors', async () => {
            const date = '2024-01-15';
            const errorMessage = 'Failed to fetch logs by date';

            mockApiGet.mockRejectedValueOnce(new Error(errorMessage));

            await expect(getHabitLogsByDate(date)).rejects.toThrow(errorMessage);
        });
    });
});