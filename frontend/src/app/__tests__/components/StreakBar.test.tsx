import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../SupabaseClient';
import StreakBar from '../../components/StreakBar';
import '@testing-library/jest-dom';

// Mock StreakBadge component
jest.mock('../../components/StreakBadges', () => ({
  __esModule: true,
  default: ({ streak }: { streak: number }) => <span data-testid={`streak-${streak}`}>Streak: {streak}</span>,
}));

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

describe('StreakBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });
    render(<StreakBar />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
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

    render(<StreakBar />);

    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});
