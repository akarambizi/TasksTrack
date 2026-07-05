import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/utils/test-utils';
import { Goals } from './Goals';

describe('Goals Component', () => {
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
  });

  describe('Component Integration', () => {
    it('should render all UI sections without crashing', () => {
      renderWithProviders(<Goals />);
      
      expect(screen.getByTestId('goals-page')).toBeInTheDocument();
    });

    it('should be accessible and properly structured', () => {
      renderWithProviders(<Goals />);
      
      const heading = screen.getByText('Goals Management');
      expect(heading).toBeInTheDocument();
      
      const description = screen.getByText(/Set measurable targets across every cadence/i);
      expect(description).toBeInTheDocument();
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
  });

  describe('Initial State', () => {
    it('should render with mock goal data', () => {
      renderWithProviders(<Goals />);
      
      // Component should render and be interactive
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

  describe('UI Structure', () => {
    it('should render heading and description sections', () => {
      renderWithProviders(<Goals />);
      
      // Main heading
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
      
      // Description text
      expect(screen.getByText(/Set measurable targets across every cadence/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      renderWithProviders(<Goals />);
      
      // Should have Add Goal button available
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).toBeInTheDocument();
    });
  });
});
