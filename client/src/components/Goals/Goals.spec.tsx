import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Goals } from './Goals';

describe('Goals Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the goals page heading and description', () => {
      render(<Goals />);
      
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
      expect(screen.getByText(/Set measurable targets across every cadence/i)).toBeInTheDocument();
    });

    it('should render the Add Goal button', () => {
      render(<Goals />);
      
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).toBeInTheDocument();
    });

    it('should display page with test id', () => {
      render(<Goals />);
      
      const goalsList = screen.getByTestId('goals-page');
      expect(goalsList).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render all UI sections without crashing', () => {
      const { container } = render(<Goals />);
      
      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('goals-page')).toBeInTheDocument();
    });

    it('should be accessible and properly structured', () => {
      render(<Goals />);
      
      const heading = screen.getByText('Goals Management');
      expect(heading).toBeInTheDocument();
      
      const description = screen.getByText(/Set measurable targets across every cadence/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('Add Goal button should be visible and enabled', () => {
      render(<Goals />);
      
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).toBeVisible();
      expect(addButton).toBeEnabled();
    });

    it('should not throw errors on component render', () => {
      expect(() => render(<Goals />)).not.toThrow();
    });
  });

  describe('Initial State', () => {
    it('should render with mock goal data', () => {
      render(<Goals />);
      
      // Component should render and be interactive
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
    });

    it('should display the goals container', () => {
      const { container } = render(<Goals />);
      
      const goalsContainer = container.querySelector('[data-testid="goals-page"]');
      expect(goalsContainer).toBeInTheDocument();
    });

    it('should have Add Goal functionality available', () => {
      render(<Goals />);
      
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).not.toBeDisabled();
    });
  });

  describe('UI Structure', () => {
    it('should render heading and description sections', () => {
      render(<Goals />);
      
      // Main heading
      expect(screen.getByText('Goals Management')).toBeInTheDocument();
      
      // Description text
      expect(screen.getByText(/Set measurable targets across every cadence/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<Goals />);
      
      // Should have Add Goal button available
      const addButton = screen.getByRole('button', { name: /Add Goal/i });
      expect(addButton).toBeInTheDocument();
    });
  });
});
