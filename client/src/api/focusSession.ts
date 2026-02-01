import type {
    IFocusSession,
    IFocusSessionCreateRequest,
    IFocusSessionUpdateRequest,
    IFocusSessionAnalytics
} from './focusSession.types';
import { apiGet, apiPost } from './apiClient';
import { ToastService } from '../services/toastService';
import buildQuery from 'odata-query';

/**
 * Starts a new focus session.
 * @param {IFocusSessionCreateRequest} sessionData - The session data for creation.
 * @returns {Promise<IFocusSession>} The created focus session.
 */
export const startFocusSession = async (sessionData: IFocusSessionCreateRequest): Promise<IFocusSession> => {
    try {
        const endpoint = '/api/focus/start';
        const response = await apiPost<IFocusSession>(endpoint, sessionData);
        ToastService.success('Focus session started successfully');
        return response;
    } catch (error) {
        console.error('Failed to start focus session:', error);
        ToastService.error('Failed to start focus session');
        throw error;
    }
};

/**
 * Pauses the active focus session for the current user.
 * @returns {Promise<IFocusSession>} The paused focus session.
 */
export const pauseFocusSession = async (): Promise<IFocusSession> => {
    try {
        const endpoint = '/api/focus/pause';
        const response = await apiPost<IFocusSession>(endpoint, {});
        ToastService.success('Focus session paused');
        return response;
    } catch (error) {
        console.error('Failed to pause focus session:', error);
        ToastService.error('Failed to pause focus session');
        throw error;
    }
};

/**
 * Resumes the paused focus session for the current user.
 * @returns {Promise<IFocusSession>} The resumed focus session.
 */
export const resumeFocusSession = async (): Promise<IFocusSession> => {
    try {
        const endpoint = '/api/focus/resume';
        const response = await apiPost<IFocusSession>(endpoint, {});
        ToastService.success('Focus session resumed');
        return response;
    } catch (error) {
        console.error('Failed to resume focus session:', error);
        ToastService.error('Failed to resume focus session');
        throw error;
    }
};

/**
 * Completes the active focus session for the current user.
 * @param {IFocusSessionUpdateRequest} updateData - Optional data to update the session.
 * @returns {Promise<IFocusSession>} The completed focus session.
 */
export const completeFocusSession = async (updateData?: IFocusSessionUpdateRequest): Promise<IFocusSession> => {
    try {
        const endpoint = '/api/focus/complete';
        const response = await apiPost<IFocusSession>(endpoint, updateData || {});
        ToastService.success('Focus session completed!');
        return response;
    } catch (error) {
        console.error('Failed to complete focus session:', error);
        ToastService.error('Failed to complete focus session');
        throw error;
    }
};

/**
 * Gets focus sessions with optional filtering and pagination using OData.
 * @param {object} params - Query parameters for filtering sessions.
 * @returns {Promise<IFocusSession[]>} Array of focus sessions.
 */
export const getFocusSessions = async (params?: {
    habitId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}): Promise<IFocusSession[]> => {
    try {
        // Build OData query from parameters
        const odataQuery = buildQuery({
            filter: {
                ...(params?.habitId && { habitId: params.habitId }),
                ...(params?.status && { status: params.status }),
                ...(params?.startDate && { startTime: { ge: params.startDate } }),
                ...(params?.endDate && { startTime: { le: params.endDate } })
            },
            orderBy: 'startTime desc',
            ...(params?.pageSize && { top: params.pageSize }),
            ...(params?.page && params?.pageSize && { skip: (params.page - 1) * params.pageSize })
        });

        const endpoint = `/api/focus/sessions${odataQuery}`;
        return await apiGet<IFocusSession[]>(endpoint);
    } catch (error) {
        console.error('Failed to fetch focus sessions:', error);
        ToastService.error('Failed to fetch focus sessions');
        return [];
    }
};

/**
 * Gets the active focus session for the current user.
 * @returns {Promise<IFocusSession | null>} The active focus session or null if none exists.
 */
export const getActiveFocusSession = async (): Promise<IFocusSession | null> => {
    try {
        const endpoint = '/api/focus/active';
        return await apiGet<IFocusSession>(endpoint);
    } catch (error) {
        // Don't show toast for this call as it's expected to fail when no active session
        console.log('No active focus session found');
        return null;
    }
};

/**
 * Gets focus session analytics for the current user.
 * @param {object} params - Optional parameters for analytics filtering.
 * @returns {Promise<IFocusSessionAnalytics>} The focus session analytics data.
 */
export const getFocusSessionAnalytics = async (params?: {
    habitId?: number;
    startDate?: string;
    endDate?: string;
}): Promise<IFocusSessionAnalytics> => {
    try {
        // Build simple query parameters for analytics endpoint
        const searchParams = new URLSearchParams();
        
        if (params?.startDate) {
            searchParams.append('startDate', params.startDate);
        }
        if (params?.endDate) {
            searchParams.append('endDate', params.endDate);
        }
        
        const queryString = searchParams.toString();
        const endpoint = `/api/focus/analytics${queryString ? `?${queryString}` : ''}`;
        
        return await apiGet<IFocusSessionAnalytics>(endpoint);
    } catch (error) {
        console.error('Failed to fetch focus session analytics:', error);
        ToastService.error('Failed to fetch analytics');
        throw error;
    }
};

/**
 * Cancels/interrupts the active focus session for the current user.
 * @param {IFocusSessionUpdateRequest} updateData - Optional data to update the session.
 * @returns {Promise<IFocusSession>} The cancelled focus session.
 */
export const cancelFocusSession = async (updateData?: IFocusSessionUpdateRequest): Promise<IFocusSession> => {
    try {
        const endpoint = '/api/focus/cancel';
        const response = await apiPost<IFocusSession>(endpoint, updateData || {});
        ToastService.success('Focus session cancelled');
        return response;
    } catch (error) {
        console.error('Failed to cancel focus session:', error);
        ToastService.error('Failed to cancel focus session');
        throw error;
    }
};