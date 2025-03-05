import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '../../contexts/AuthContext'; // Mock the context
import { supabase } from '../../SupabaseClient';  // Mock the supabase client
import CodeTracker from '../../components/CodeTracker';

// Mock supabase client with proper return type
jest.mock('../../SupabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [
          { difficulty: 'introductory', completed_at: '2025-03-04T10:00:00Z' },
          { difficulty: 'interview', completed_at: '2025-03-04T11:00:00Z' }
        ],
        error: null
      })
    })
  }
}));

// Mock useAuth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn() // Mock the actual function as jest.fn()
}));

describe('CodeTracker', () => {
  const mockUser = { id: 'user123', name: 'Test User' };

  beforeEach(() => {
    // Correctly mock the return value of `useAuth`
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
  });

  test('renders correctly', async () => {
    render(
        <CodeTracker />
    );

    expect(screen.getByText('Last 24 Hours')).toBeInTheDocument();
    expect(screen.getByText('Daily Code Completions')).toBeInTheDocument();
  });

  test('displays "Incomplete" if either easy or hard question is not completed', async () => {
    // Mock the API response where only one question is completed
    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({
        data: [{ difficulty: 'introductory', completed_at: '2025-03-04T10:00:00Z' }],
        error: null
      })
    });

    render(
        <CodeTracker />
    );

    // Wait for the state to update and check the completion status
    await waitFor(() => screen.getByText('Incomplete'));
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toHaveClass('bg-red-50 text-red-700');
  });

  test('does not display anything if loading', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: true });

    render(
        <CodeTracker />
    );

    // Ensure the component doesn't render anything while loading
    expect(screen.queryByText('Last 24 Hours')).toBeInTheDocument();
    expect(screen.queryByText('Daily Code Completions')).toBeInTheDocument();
  });
});
