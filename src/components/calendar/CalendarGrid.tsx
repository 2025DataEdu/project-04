
import React from 'react';
import { DateCell } from './DateCell';
import { DutyAssignmentWithWorkers } from '@/types/duty';

interface CalendarGridProps {
  days: (Date | null)[];
  assignments: DutyAssignmentWithWorkers[];
  getAssignmentsForDate: (date: Date) => DutyAssignmentWithWorkers[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  assignments,
  getAssignmentsForDate
}) => {
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`p-2 text-center font-medium text-sm ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <DateCell
            key={index}
            day={day}
            assignments={day ? getAssignmentsForDate(day) : []}
          />
        ))}
      </div>
    </>
  );
};
