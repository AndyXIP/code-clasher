'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient'; // Adjust path as needed
import { useAuth } from '../contexts/AuthContext';
import { startOfMonth, endOfMonth, getDay, format } from 'date-fns';

type DifficultyStatus = 'none' | 'introductory' | 'interview' | 'both';
interface DayMap {
  [dateStr: string]: DifficultyStatus;
}

// Helper: Returns an array of dates between start and end (inclusive)
function getDaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export default function MyMonthlyCalendar() {
  const { user, loading } = useAuth();

  // Determine current month start/end
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Generate days for the current month
  const monthDays = getDaysInRange(monthStart, monthEnd);

  // Calculate padding for empty cells at start/end of the month
  const paddingStart = getDay(monthStart);
  const paddingEnd = 6 - getDay(monthEnd);

  // Build the grid cells array (null for padding, Date for actual days)
  const gridCells: (Date | null)[] = [
    ...Array(paddingStart).fill(null),
    ...monthDays,
    ...Array(paddingEnd).fill(null),
  ];

  // Split into weeks (each with 7 cells)
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < gridCells.length; i += 7) {
    weeks.push(gridCells.slice(i, i + 7));
  }

  const [dayMap, setDayMap] = useState<DayMap>({});

  useEffect(() => {
    if (!loading && user) {
      fetchMonthlyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function fetchMonthlyData() {
    try {
      const { data, error } = await supabase
        .from('completed_questions')
        .select('difficulty, completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', monthStart.toISOString())
        .lte('completed_at', monthEnd.toISOString());
      if (error) throw error;

      // Build a map for each day of the month
      const tempMap: DayMap = {};
      monthDays.forEach((day) => {
        tempMap[format(day, 'yyyy-MM-dd')] = 'none';
      });

      // Update the map with data
      data.forEach((row: any) => {
        const dayStr = format(new Date(row.completed_at), 'yyyy-MM-dd');
        if (!tempMap[dayStr] || tempMap[dayStr] === 'none') {
          tempMap[dayStr] =
            row.difficulty === 'introductory' ? 'introductory' : 'interview';
        } else {
          tempMap[dayStr] = 'both';
        }
      });

      setDayMap(tempMap);
    } catch (err) {
      console.error('Error fetching monthly data:', err);
    }
  }

  /**
   * Tailwind classes for background color by status.
   * Light Mode:
   *   - none: bg-gray-200
   *   - introductory: bg-green-200
   *   - interview: bg-green-400
   *   - both: bg-green-600
   *
   * Dark Mode (purple shades):
   *   - none: dark:bg-gray-700
   *   - introductory: dark:bg-purple-800
   *   - interview: dark:bg-purple-600
   *   - both: dark:bg-purple-400
   */
  function getColorClass(date: Date): string {
    const dayStr = format(date, 'yyyy-MM-dd');
    const status = dayMap[dayStr] || 'none';

    switch (status) {
      case 'introductory':
        return 'bg-green-200 dark:bg-purple-800';
      case 'interview':
        return 'bg-green-400 dark:bg-purple-600';
      case 'both':
        return 'bg-green-600 dark:bg-purple-400';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  }

  return (
    <div className="flex justify-center items-start gap-8 mt-4">
      {/* Calendar */}
      <div>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd) => (
            <div
              key={wd}
              className="text-xs text-gray-500 dark:text-gray-400 text-center"
            >
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, rowIndex) =>
            week.map((day, cellIndex) =>
              day ? (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  className={`w-6 h-6 rounded-sm ${getColorClass(day)}`}
                  title={format(day, 'yyyy-MM-dd')}
                />
              ) : (
                <div key={`${rowIndex}-${cellIndex}`} className="w-6 h-6" />
              )
            )
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            No Activity
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm bg-green-200 dark:bg-purple-800" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Introductory
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm bg-green-400 dark:bg-purple-600" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Interview
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm bg-green-600 dark:bg-purple-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Both
          </span>
        </div>
      </div>
    </div>
  );
}
