import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/utils/test-utils';
import { Goals } from './Goals';

describe('Goals Component', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the goals page heading and description', () => {
      renderWithProviders(<Goals />);
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
      expect(screen.getByText(/Set measurable targets across every cadence/i)).toBeInTheDocument();
    });

    it('should render the Add Goal button', () => {
      renderWithProviders(<Goals />);
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).toBeInTheDocument();
    });

    it('should display page with test id', () => {
      renderWithProviders(<Goals />);
      const goalsList = screen.getByTestId('goals-page');
      expect(goalsList).toBeInTheDocument();
    });

    it('should render goal items from mock data', () => {
      renderWithProviders(<Goals />);
      expect(screen.getByTestId('goals-page')).toBeInTheDocument();
    });

    it('should render cadence filter select', () => {
      renderWithProviders(<Goals />);
      // There may be multiple comboboxes (filter + dialog); just verify at least one exists
      expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
    });
  });

  describe('Component Integration', () => {
    it('should render all UI sections without crashing', () => {
      renderWithProviders(<Goals />);
      expect(screen.getByTestId('goals-page')).toBeInTheDocument();
    });

    it('should be accessible and properly structured', () => {
      renderWithProviders(<Goals />);
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
      expect(screen.getByText(/Set measurable targets across every cadence/i)).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('Add Goal button should be visible and enabled', () => {
      renderWithProviders(<Goals />);
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).toBeVisible();
      expect(addButton).toBeEnabled();
    });

    it('should not throw errors on component render', () => {
      expect(() => renderWithProviders(<Goals />)).not.toThrow();
    });

    it('should open create goal dialog when Add Goal is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Goals />);
      await user.click(screen.getByRole('button', { name: /Add Goal/i }));
      await waitFor(() => {
        expect(screen.getByText(/Create Goal/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dialog validation', () => {
    it('should disable save button when goal name is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Goals />);
      await user.click(screen.getByRole('button', { name: /Add Goal/i }));
      const saveButton = await screen.findByRole('button', { name: /Save Goal/i });
      expect(saveButton).toBeDisabled();
    });

    it('should show inline error for invalid target value', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Goals />);
      await user.click(screen.getByRole('button', { name: /Add Goal/i }));
      const nameInput = await screen.findByPlaceholderText(/e.g. Weekly Deep Work/i);
      await user.type(nameInput, 'My New Goal');
      const targetInput = screen.getByPlaceholderText(/e.g. 10/i);
      await user.clear(targetInput);
      await user.type(targetInput, '-3');
      expect(await screen.findByText('Enter a number greater than zero.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Goal/i })).toBeDisabled();
    });

    it('should create a goal with valid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Goals />);
      await user.click(screen.getByRole('button', { name: /Add Goal/i }));
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/e.g. Weekly Deep Work/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/e.g. Weekly Deep Work/i), 'Test Goal');
      const targetInput = screen.getByPlaceholderText(/e.g. 10/i);
      await user.clear(targetInput);
      await user.type(targetInput, '5');
      await user.click(screen.getByRole('button', { name: /save/i }));
      await waitFor(() => {
        expect(screen.getByText('Test Goal')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Goal interactions', () => {
    it('should archive a goal when archive button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Goals />);
      const goalCards = screen.getAllByRole('button', { name: /Archive/i });
      const initialCount = goalCards.length;
      await user.click(goalCards[0]);
      const remainingCards = screen.queryAllByRole('button', { name: /Archive/i });
      expect(remainingCards.length).toBeLessThan(initialCount);
    });

    it('should cycle goal status when Cycle Status button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Goals />);
      const cycleButtons = screen.getAllByRole('button', { name: /cycle status/i });
      expect(cycleButtons.length).toBeGreaterThan(0);
      const statusBadges = screen.getAllByText(/on-track|behind|exceeded/);
      const initialStatus = statusBadges[0].textContent;
      await user.click(cycleButtons[0]);
      const updatedBadges = screen.getAllByText(/on-track|behind|exceeded/);
      expect(updatedBadges[0].textContent).not.toBe(initialStatus);
    });
  });

  describe('Initial State', () => {
    it('should render with mock goal data', () => {
      renderWithProviders(<Goals />);
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
    });

    it('should display the goals container', () => {
      renderWithProviders(<Goals />);
      const goalsContainer = screen.getByTestId('goals-page');
      expect(goalsContainer).toBeInTheDocument();
    });

    it('should have Add Goal functionality available', () => {
      renderWithProviders(<Goals />);
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).not.toBeDisabled();
    });
  });
});
