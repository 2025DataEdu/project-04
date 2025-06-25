
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { HandoverWeekNavigation } from './handover/HandoverWeekNavigation';
import { HandoverDayCard } from './handover/HandoverDayCard';
import { useHandoverReports } from '@/hooks/useHandoverReports';
import { getDutyTypeColor } from '@/utils/handoverUtils';

const HandoverDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { handoverReports, isLoading, error, getWeekDays, getReportForDate } = useHandoverReports(selectedWeek);

  const weekDays = getWeekDays(selectedWeek);
  const today = new Date().toISOString().split('T')[0];
  const weekDayNames = ['월', '화', '수', '목', '금', '토', '일'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(selectedWeek.getDate() + (direction === 'prev' ? -7 : 7));
    setSelectedWeek(newWeek);
  };

  if (error) {
    return (
      <Card className="shadow-lg">
        <HandoverWeekNavigation 
          selectedWeek={selectedWeek}
          weekDays={weekDays}
          onNavigateWeek={navigateWeek}
        />
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">
            <div className="text-lg font-semibold mb-2">오류 발생</div>
            <div className="text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <HandoverWeekNavigation 
        selectedWeek={selectedWeek}
        weekDays={weekDays}
        onNavigateWeek={navigateWeek}
      />
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const report = getReportForDate(day);
              const isToday = day.toISOString().split('T')[0] === today;
              
              return (
                <HandoverDayCard
                  key={day.toISOString()}
                  day={day}
                  dayIndex={index}
                  weekDayNames={weekDayNames}
                  report={report}
                  isToday={isToday}
                  getDutyTypeColor={getDutyTypeColor}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HandoverDashboard;
