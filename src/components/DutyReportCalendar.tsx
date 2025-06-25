
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DutyReportWithWorker } from '@/types/dutyReport';

interface DutyReportCalendarProps {
  selectedMonth: string;
  selectedDate: string;
  monthDates: string[];
  reports: DutyReportWithWorker[];
  onDateSelect: (date: string) => void;
}

export const DutyReportCalendar: React.FC<DutyReportCalendarProps> = ({
  selectedMonth,
  selectedDate,
  monthDates,
  reports,
  onDateSelect
}) => {
  const reportsMap = new Map(reports.map(report => [report.report_date, report]));

  const getDayOfWeek = (date: string) => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[new Date(date).getDay()];
  };

  const generateCalendarGrid = () => {
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]);
    
    // 월의 첫째 날과 마지막 날
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    
    // 첫째 날의 요일 (0=일요일, 1=월요일, ...)
    const startDayOfWeek = firstDay.getDay();
    
    // 달력 그리드를 위한 배열 생성
    const calendarDays = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
      calendarDays.push(dateString);
    }
    
    return calendarDays;
  };

  const calendarDays = generateCalendarGrid();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>월별 보고서 목록</CardTitle>
        <CardDescription>{selectedMonth}의 당직 보고서 현황 (총 {reports.length}건)</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, index) => (
            <div 
              key={day} 
              className={`text-center font-semibold py-2 text-sm ${
                index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-16"></div>;
            }
            
            const hasReport = reportsMap.has(date);
            const isSelected = date === selectedDate;
            const reportData = reportsMap.get(date);
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            return (
              <Button
                key={date}
                variant={isSelected ? "default" : hasReport ? "outline" : "ghost"}
                size="sm"
                className={`h-16 flex flex-col p-1 ${
                  hasReport 
                    ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                    : isWeekend 
                      ? 'bg-gray-50 hover:bg-gray-100' 
                      : ''
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onDateSelect(date)}
              >
                <div className="flex flex-col items-center w-full">
                  <span className={`text-xs mb-1 ${
                    dayOfWeek === 0 ? 'text-red-600' : 
                    dayOfWeek === 6 ? 'text-blue-600' : 
                    'text-gray-700'
                  }`}>
                    {new Date(date).getDate()}
                  </span>
                  {hasReport && (
                    <>
                      <span className="text-xs text-green-600">●</span>
                      <span className="text-xs text-green-600 truncate w-full text-center">
                        {reportData?.worker_name}
                      </span>
                    </>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            보고서 작성 완료
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            일요일
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            토요일
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
