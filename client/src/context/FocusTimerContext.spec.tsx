import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FocusTimerProvider } from './FocusTimerContext';
import { useFocusTimerContext } from '@/hooks/useFocusTimerContext';
import { FocusSessionStatus } from '@/api';

// Mock dependencies
vi.mock('react-timer-hook', () => ({
    useTimer: vi.fn(() => ({
        totalSeconds: 1500,
        isRunning: false,
        restart: vi.fn()
    }))
}));

vi.mock('@/queries', () => ({
    useActiveFocusSession: vi.fn()
}));

vi.mock('@/utils/focusTimer', () => ({
    getSessionState: vi.fn()
}));

const { useTimer } = await import('react-timer-hook');
const { useActiveFocusSession } = await import('@/queries');
const { getSessionState } = await import('@/utils/focusTimer');

describe('FocusTimerContext', () => {
    let queryClient: QueryClient;
    const mockTimer = {
        totalSeconds: 1500,
        isRunning: false,
        restart: vi.fn()
    };

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        });
        vi.clearAllMocks();
        (useTimer as ReturnType<typeof vi.fn>).mockReturnValue(mockTimer);
        (useActiveFocusSession as ReturnType<typeof vi.fn>).mockReturnValue({
            data: null,
            isLoading: false
        });
        (getSessionState as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1500,
            progress: 0,
            isRunning: false
        });
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <FocusTimerProvider plannedDurationMinutes={25}>
                {children}
            </FocusTimerProvider>
        </QueryClientProvider>
    );

    const TestComponent = () => {
        const context = useFocusTimerContext();
        return (
            <div data-testid="timer-context">
                <div data-testid="time-left">{context.timeLeft}</div>
                <div data-testid="is-running">{context.isRunning.toString()}</div>
                <div data-testid="progress">{context.progress}</div>
                <div data-testid="has-active-session">{context.hasActiveSession.toString()}</div>
                <div data-testid="show-celebration">{context.showCompletionCelebration.toString()}</div>
                <button
                    data-testid="set-celebration"
                    onClick={() => context.setCompletionCelebration(true)}
                >
                    Set Celebration
                </button>
            </div>
        );
    };

    it('should provide default timer state when no active session', () => {
        const { getByTestId } = render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        expect(getByTestId('time-left')).toHaveTextContent('1500');
        expect(getByTestId('is-running')).toHaveTextContent('false');
        expect(getByTestId('has-active-session')).toHaveTextContent('false');
        expect(getByTestId('show-celebration')).toHaveTextContent('false');
    });

    it('should sync timer state with active session', () => {
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            status: FocusSessionStatus.Active,
            plannedDurationMinutes: 25,
            startTime: '2026-01-31T10:00:00Z',
            createdBy: 'user1',
            createdDate: '2026-01-31T10:00:00Z'
        };

        (useActiveFocusSession as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockActiveSession,
            isLoading: false
        });

        (getSessionState as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 900,
            progress: 40,
            isRunning: true
        });

        const { getByTestId } = render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        expect(getByTestId('has-active-session')).toHaveTextContent('true');
        expect(mockTimer.restart).toHaveBeenCalled();
    });

    it('should handle completion celebration state', () => {
        const { getByTestId } = render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        const setCelebrationButton = getByTestId('set-celebration');
        act(() => {
            setCelebrationButton.click();
        });

        expect(getByTestId('show-celebration')).toHaveTextContent('true');
    });

    it('should auto-hide celebration after 3 seconds', async () => {
        vi.useFakeTimers();

        const { getByTestId } = render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        const setCelebrationButton = getByTestId('set-celebration');
        act(() => {
            setCelebrationButton.click();
        });

        expect(getByTestId('show-celebration')).toHaveTextContent('true');

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(getByTestId('show-celebration')).toHaveTextContent('false');

        vi.useRealTimers();
    });

    it('should calculate progress correctly for active session', () => {
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            status: FocusSessionStatus.Active,
            plannedDurationMinutes: 25,
            startTime: '2026-01-31T10:00:00Z',
            createdBy: 'user1',
            createdDate: '2026-01-31T10:00:00Z'
        };

        (useActiveFocusSession as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockActiveSession,
            isLoading: false
        });

        (getSessionState as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 750,
            progress: 50,
            isRunning: true
        });

        const { getByTestId } = render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        expect(getByTestId('progress')).toHaveTextContent('50');
    });

    it('should handle loading state', () => {
        (useActiveFocusSession as ReturnType<typeof vi.fn>).mockReturnValue({
            data: null,
            isLoading: true
        });

        const TestLoadingComponent = () => {
            const context = useFocusTimerContext();
            return <div data-testid="is-loading">{context.isLoadingSession.toString()}</div>;
        };

        const { getByTestId } = render(
            <TestWrapper>
                <TestLoadingComponent />
            </TestWrapper>
        );

        expect(getByTestId('is-loading')).toHaveTextContent('true');
    });

    it('should call timer restart with correct parameters when syncing', () => {
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            status: FocusSessionStatus.Paused,
            plannedDurationMinutes: 30,
            startTime: '2026-01-31T10:00:00Z',
            createdBy: 'user1',
            createdDate: '2026-01-31T10:00:00Z'
        };

        (useActiveFocusSession as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockActiveSession,
            isLoading: false
        });

        (getSessionState as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1200,
            progress: 33,
            isRunning: false
        });

        render(
            <TestWrapper>
                <TestComponent />
            </TestWrapper>
        );

        expect(mockTimer.restart).toHaveBeenCalledWith(
            expect.any(Date),
            false
        );
    });
});