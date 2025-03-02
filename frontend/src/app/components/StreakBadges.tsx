interface StreakBadgeProps {
    streak: number; // Defining that streak should be a number (0 to 7)
  }
  
  export default function StreakBadge({ streak }: StreakBadgeProps) {
    const getBadgeLabel = (streak: number): string => {
      if (streak >= 1 && streak <= 2) return "Novice";
      if (streak >= 3 && streak <= 4) return "Intermediate";
      if (streak >= 5 && streak <= 6) return "Advanced";
      if (streak >= 7) return "Master";
      return "No Streak"; // Default if streak is 0 or invalid
    };
    // Determine badge color based on streak value (0 to 7)
    const getBadgeColor = (streak: number) => {
      if (streak === 0) return "bg-gray-50 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400 ring-gray-500/10 dark:ring-gray-400/20";
      if (streak === 1) return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-400 ring-red-600/10 dark:ring-red-400/20";
      if (streak === 2) return "bg-yellow-50 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-500 ring-yellow-600/20 dark:ring-yellow-400/20";
      if (streak === 3) return "bg-green-50 text-green-700 dark:bg-green-400/10 dark:text-green-400 ring-green-600/20 dark:ring-green-500/20";
      if (streak === 4) return "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400 ring-blue-700/10 dark:ring-blue-400/30";
      if (streak === 5) return "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-400 ring-indigo-700/10 dark:ring-indigo-400/30";
      if (streak === 6) return "bg-purple-50 text-purple-700 dark:bg-purple-400/10 dark:text-purple-400 ring-purple-700/10 dark:ring-purple-400/30";
      if (streak >= 7) return "bg-pink-50 text-pink-700 dark:bg-pink-400/10 dark:text-pink-400 ring-pink-700/10 dark:ring-pink-400/20";
    };

    return (
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ${getBadgeColor(streak)}`}
      >
        {getBadgeLabel(streak)} {/* Display the badge label */}
      </span>
    );
  }
  