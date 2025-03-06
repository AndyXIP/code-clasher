'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../SupabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { startOfMonth, endOfMonth, getDay, format } from 'date-fns';

type DifficultyStatus = 'none' | 'introductory' | 'interview' | 'both';
interface DayMap {
  [dateStr: string]: DifficultyStatus;
}

function getDaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export default function MyMonthlyCalendar() {
  const { user, loading } = useAuth();

  // Memoize date calculations and week structure
  const { monthStart, monthEnd, monthDays, weeks } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthDays = getDaysInRange(monthStart, monthEnd);
    
    const paddingStart = getDay(monthStart);
    const paddingEnd = 6 - getDay(monthEnd);
    
    // Create temporary grid cells to calculate weeks
    const tempGridCells: (Date | null)[] = [
      ...Array(paddingStart).fill(null),
      ...monthDays,
      ...Array(paddingEnd).fill(null),
    ];

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < tempGridCells.length; i += 7) {
      weeks.push(tempGridCells.slice(i, i + 7));
    }

    return { monthStart, monthEnd, monthDays, weeks };
  }, []);

  const [dayMap, setDayMap] = useState<DayMap>({});

  useEffect(() => {
    if (!loading && user) {
      const fetchMonthlyData = async () => {
        try {
          const { data, error } = await supabase
            .from('completed_questions')
            .select('difficulty, completed_at')
            .eq('user_id', user.id)
            .gte('completed_at', monthStart.toISOString())
            .lte('completed_at', monthEnd.toISOString());

          if (error) throw error;

          const tempMap: DayMap = {};
          monthDays.forEach((day) => {
            tempMap[format(day, 'yyyy-MM-dd')] = 'none';
          });

          data.forEach((row: any) => {
            const dayStr = format(new Date(row.completed_at), 'yyyy-MM-dd');
            tempMap[dayStr] = tempMap[dayStr] === 'none' || !tempMap[dayStr]
              ? row.difficulty === 'introductory' ? 'introductory' : 'interview'
              : 'both';
          });

          setDayMap(tempMap);
        } catch (err) {
          console.error('Error fetching monthly data:', err);
        }
      };

      fetchMonthlyData();
    }
  }, [loading, user, monthStart, monthEnd, monthDays]);

  const getColorClass = useMemo(() => (date: Date): string => {
    const dayStr = format(date, 'yyyy-MM-dd');
    const status = dayMap[dayStr] || 'none';

    return {
      'introductory': 'bg-green-200 dark:bg-purple-800',
      'interview': 'bg-green-400 dark:bg-purple-600',
      'both': 'bg-green-600 dark:bg-purple-400',
      'none': 'bg-gray-200 dark:bg-gray-700',
    }[status];
  }, [dayMap]);

  return (
    <div className="flex justify-center items-start gap-8 mt-4">
      <div>
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
      {/* Legend remains unchanged */}
    </div>
  );
}