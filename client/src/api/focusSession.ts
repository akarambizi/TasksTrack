import type {
    IFocusSession,
    IFocusSessionCreateRequest,
    IFocusSessionUpdateRequest,
    IFocusSessionAnalytics
} from './focusSession.types';
import { apiGet, apiPost } from './apiClient';
import { ToastService } from '../services/toastService';

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
 * Gets focus sessions using a pre-built OData query string.
 * @param {string} queryString - Pre-built OData query string (e.g., from ODataQueryBuilder)
 * @returns {Promise<IFocusSession[]>} Array of focus sessions.
 */
export const getFocusSessions = async (queryString?: string): Promise<IFocusSession[]> => {
    try {
        const endpoint = `/api/focus/sessions${queryString || ''}`;

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
        return null;
    }
};

/**
 * Gets focus session analytics using a pre-built OData query string.
 * @param {string} queryString - Pre-built OData query string (e.g., from ODataQueryBuilder)
 * @returns {Promise<IFocusSessionAnalytics>} Focus session analytics object.
 */
export const getFocusSessionAnalytics = async (queryString?: string): Promise<IFocusSessionAnalytics> => {
    try {
        const endpoint = `/api/focus/analytics${queryString || ''}`;

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