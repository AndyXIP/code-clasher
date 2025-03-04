import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from '../../components/StatCard'; // Adjust the import path
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../SupabaseClient';
import { subDays } from 'date-fns';

// Mock useAuth to return a test user
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock Supabase client
jest.mock('../../SupabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('StatCard Component', () => {
  const mockUser = { id: '12345' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state when user is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });

    render(<StatCard />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders statistics correctly when user has completed questions', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

    const sevenDaysAgo = subDays(new Date(), 7).toISOString();

    // Mock Supabase API response
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({
        data: [
          { difficulty: 'introductory', completed_at: sevenDaysAgo },
          { difficulty: 'introductory', completed_at: sevenDaysAgo },
          { difficulty: 'interview', completed_at: sevenDaysAgo },
        ],
        error: null,
      }),
    });

    render(<StatCard />);

    await waitFor(() => {
      expect(screen.getByText('Easy Questions Completed')).toBeInTheDocument();
      expect(screen.getByText('2 / 7')).toBeInTheDocument();

      expect(screen.getByText('Hard Questions Completed')).toBeInTheDocument();
      expect(screen.getByText('1 / 7')).toBeInTheDocument();

      expect(screen.getByText('Total Questions Completed')).toBeInTheDocument();
      expect(screen.getByText('3 / 14')).toBeInTheDocument();

      expect(screen.getByText('Easy Questions Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('29%')).toBeInTheDocument();

      expect(screen.getByText('Hard Questions Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('14%')).toBeInTheDocument();

      expect(screen.getByText('Total Questions Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('21%')).toBeInTheDocument();
    });
  });

  test('renders correctly when user has no completed questions', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

    // Mock empty Supabase response
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    render(<StatCard />);

    await waitFor(() => {
        expect(screen.getAllByText('0 / 7')).toHaveLength(2); // Expect two occurrences
        expect(screen.getByText('0 / 14')).toBeInTheDocument();
        expect(screen.getAllByText('0%')).toHaveLength(3); // Expect three occurrences
    });
  });

  test('handles Supabase errors gracefully', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

    // Mock Supabase returning an error
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
    });

    console.error = jest.fn(); // Suppress error logs

    render(<StatCard />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching completed questions:', expect.any(Error));
    });
  });
});
