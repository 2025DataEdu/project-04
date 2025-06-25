
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { HandoverWeekNavigation } from './handover/HandoverWeekNavigation';
import { HandoverDayCard } from './handover/HandoverDayCard';
import { useHandoverReports } from '@/hooks/useHandoverReports';
import { getDutyTypeColor } from '@/utils/handoverUtils';

const HandoverDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { getWeekDays, getReportForDate } = useHandoverReports(selectedWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + (direction === 'prev' ? -7 : 7));
    setSelectedWeek(newDate);
  };

  const weekDays = getWeekDays(selectedWeek);
  const weekDayNames = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <HandoverWeekNavigation
          selectedWeek={selectedWeek}
          weekDays={weekDays}
          onNavigateWeek={navigateWeek}
        />
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const report = getReportForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <HandoverDayCard
                  key={index}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default HandoverDashboard;
