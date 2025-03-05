import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreakBadge from '../../components/StreakBadges';

describe('StreakBadge Component', () => {
  const testCases = [
    { streak: 0, label: 'No Streak', classIncludes: 'bg-gray-50' },
    { streak: 1, label: 'Novice', classIncludes: 'bg-red-50' },
    { streak: 2, label: 'Novice', classIncludes: 'bg-yellow-50' },
    { streak: 3, label: 'Intermediate', classIncludes: 'bg-green-50' },
    { streak: 4, label: 'Intermediate', classIncludes: 'bg-blue-50' },
    { streak: 5, label: 'Advanced', classIncludes: 'bg-indigo-50' },
    { streak: 6, label: 'Advanced', classIncludes: 'bg-purple-50' },
    { streak: 7, label: 'Master', classIncludes: 'bg-pink-50' },
    // Ensure 7+ maps to "Master"
    { streak: 10, label: 'Master', classIncludes: 'bg-pink-50' },
  ];

  testCases.forEach(({ streak, label, classIncludes }) => {
    test(`renders correctly for streak = ${streak}`, () => {
      render(<StreakBadge streak={streak} />);
      
      const badge = screen.getByText(label);

      // Check if the correct label is displayed
      expect(badge).toBeInTheDocument();

      // Check if the correct class is applied (badge color)
      expect(badge).toHaveClass(classIncludes);
    });
  });
});
