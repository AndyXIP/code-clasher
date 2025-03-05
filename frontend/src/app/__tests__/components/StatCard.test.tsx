import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../SupabaseClient';
import StatCard from '../../components/StatCard';
import '@testing-library/jest-dom';

// Mock useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock Supabase client
jest.mock('../../SupabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({ select: jest.fn() })),
  },
}));

describe('StatCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });
    render(<StatCard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders stats when no questions have been completed', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user123' }, loading: false });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });

    render(<StatCard />);

    await waitFor(() => expect(screen.getByText('Last 7 days')).toBeInTheDocument());
    expect(screen.getAllByText(/0\s*\/\s*7/i)[0]).toBeInTheDocument(); // Easy Questions Completed
    expect(screen.getAllByText(/0\s*\/\s*7/i)[1]).toBeInTheDocument(); // Hard Questions Completed
    expect(screen.getAllByText(/0\s*\/\s*14/i)[0]).toBeInTheDocument(); // Total Questions Completed
  });

  test('handles error from Supabase', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user123' }, loading: false });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ data: null, error: new Error('Fetch failed') }),
        }),
      }),
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<StatCard />);

    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});