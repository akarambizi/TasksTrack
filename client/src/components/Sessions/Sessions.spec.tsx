import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { Sessions } from './Sessions';
import { renderWithProviders, mockFocusSessions, mockCompletedFocusSession, createMockQuery } from '../../utils/test-utils';
import { FocusSessionStatus } from '@/types';

vi.mock('@/queries/focusSessions', () => ({
    useFocusSessions: vi.fn(),
}));

import * as focusSessionQueries from '@/queries/focusSessions';

const mockUseFocusSessions = focusSessionQueries.useFocusSessions as ReturnType<typeof vi.fn>;

describe('Sessions', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        mockUseFocusSessions.mockReturnValue(createMockQuery([], { isLoading: true, data: undefined }));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Session History')).toBeInTheDocument();
        expect(document.querySelector('.animate-spin')).not.toBeNull();
    });

    it('renders error state', () => {
        mockUseFocusSessions.mockReturnValue(
            createMockQuery([], { isLoading: false, isError: true, error: new Error('Failed') })
        );
        renderWithProviders(<Sessions />);
        expect(screen.getByText(/unable to load session history/i)).toBeInTheDocument();
    });

    it('renders empty state when no sessions', () => {
        mockUseFocusSessions.mockReturnValue(createMockQuery([]));
        renderWithProviders(<Sessions />);
        expect(screen.getByText(/no sessions yet/i)).toBeInTheDocument();
    });

    it('renders sessions list with data', () => {
        mockUseFocusSessions.mockReturnValue(createMockQuery(mockFocusSessions));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Session History')).toBeInTheDocument();
    });

    it('renders completed status badge', () => {
        const sessions = [mockCompletedFocusSession];
        mockUseFocusSessions.mockReturnValue(createMockQuery(sessions));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('renders interrupted status badge', () => {
        const interrupted = { ...mockCompletedFocusSession, id: 2, status: FocusSessionStatus.Interrupted };
        mockUseFocusSessions.mockReturnValue(createMockQuery([interrupted]));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Interrupted')).toBeInTheDocument();
    });

    it('renders paused status badge', () => {
        const paused = { ...mockCompletedFocusSession, id: 3, status: FocusSessionStatus.Paused, actualDurationSeconds: null };
        mockUseFocusSessions.mockReturnValue(createMockQuery([paused]));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Paused')).toBeInTheDocument();
    });

    it('renders active status badge', () => {
        const active = { ...mockCompletedFocusSession, id: 4, status: FocusSessionStatus.Active, actualDurationSeconds: null };
        mockUseFocusSessions.mockReturnValue(createMockQuery([active]));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('displays session with no actual duration using planned duration', () => {
        const session = {
            ...mockCompletedFocusSession,
            id: 5,
            status: FocusSessionStatus.Completed,
            actualDurationSeconds: null,
        };
        mockUseFocusSessions.mockReturnValue(createMockQuery([session]));
        renderWithProviders(<Sessions />);
        expect(screen.getByText(/planned/i)).toBeInTheDocument();
    });

    it('shows page title and description', () => {
        mockUseFocusSessions.mockReturnValue(createMockQuery(mockFocusSessions));
        renderWithProviders(<Sessions />);
        expect(screen.getByText('Session History')).toBeInTheDocument();
        expect(screen.getByText(/review your completed focus sessions/i)).toBeInTheDocument();
    });
});
