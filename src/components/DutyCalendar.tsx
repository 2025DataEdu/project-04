import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDutyAssignment } from '@/hooks/useDutyAssignment';
import { DutyAssignmentWithWorkers } from '@/types/duty';
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarGrid } from './calendar/CalendarGrid';
import { getDaysInMonth, getAssignmentsForDate } from '@/utils/calendarUtils';

const DutyCalendar = () => {
  const [assignments, setAssignments] = useState<DutyAssignmentWithWorkers[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getDutyAssignments } = useDutyAssignment();

  const loadAssignments = async (year: number, month: number) => {
    // 월의 첫째 날과 마지막 날을 정확히 계산
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    // 마지막 날을 정확히 구하기 위해 다음 달 0일을 사용하여 정확한 마지막 날 계산
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = new Date(year, month - 1, lastDayOfMonth).toISOString().split('T')[0];
    
    console.log(`Loading assignments for ${year}-${month}: ${startDate} to ${endDate}`);
    console.log(`Last day of month: ${lastDayOfMonth}`);
    console.log(`Calculated endDate: ${endDate}`);
    
    try {
      const data = await getDutyAssignments(startDate, endDate);
      if (Array.isArray(data)) {
        console.log(`Loaded ${data.length} assignments for ${year}-${month}`);
        console.log('Assignment dates:', data.map(d => d.assignment_date));
        
        // 6월 30일 데이터 특별 확인
        const june30Data = data.filter(d => d.assignment_date === '2025-06-30');
        console.log('June 30 data specifically:', june30Data);
        
        setAssignments(data);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    }
  };

  useEffect(() => {
    loadAssignments(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const handleGetAssignmentsForDate = (date: Date) => getAssignmentsForDate(date, assignments);

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CalendarHeader 
          currentDate={currentDate}
          onNavigateMonth={navigateMonth}
        />
        <CardContent className="p-6">
          <CalendarGrid 
            days={days}
            assignments={assignments}
            getAssignmentsForDate={handleGetAssignmentsForDate}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DutyCalendar;
