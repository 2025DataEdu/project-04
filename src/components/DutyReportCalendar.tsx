
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
  // 날짜별로 보고서들을 그룹화 (주말에는 2개의 보고서가 있을 수 있음)
  const reportsGroupedByDate = reports.reduce((acc, report) => {
    const date = report.report_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(report);
    return acc;
  }, {} as Record<string, DutyReportWithWorker[]>);

  console.log('Reports grouped by date:', reportsGroupedByDate);

  const generateCalendarGrid = () => {
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]);
    
    // 월의 첫째 날과 마지막 날
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    
    // 첫째 날의 요일 (0=일요일, 1=월요일, ..., 6=토요일)
    const startDayOfWeek = firstDay.getDay();
    
    // 달력 그리드를 위한 배열 생성
    const calendarDays = [];
    
    // 이전 달의 빈 칸들 (일요일부터 시작)
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // 현재 달의 날짜들을 정확한 형식으로 생성
    for (let day = 1; day <= daysInMonth; day++) {
      // 날짜를 정확하게 YYYY-MM-DD 형식으로 생성
      const month_str = month.toString().padStart(2, '0');
      const day_str = day.toString().padStart(2, '0');
      const dateString = `${year}-${month_str}-${day_str}`;
      calendarDays.push(dateString);
    }
    
    return calendarDays;
  };

  const calendarDays = generateCalendarGrid();
  // 일요일부터 시작하는 요일 배열
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
              return <div key={`empty-${index}`} className="h-24"></div>;
            }
            
            const dayReports = reportsGroupedByDate[date] || [];
            const hasReports = dayReports.length > 0;
            const isSelected = date === selectedDate;
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // 디버깅을 위한 로그 추가
            console.log(`Calendar date: ${date}, Reports found: ${dayReports.length}, Day: ${new Date(date).getDate()}`);
            
            return (
              <Button
                key={date}
                variant={isSelected ? "default" : hasReports ? "outline" : "ghost"}
                size="sm"
                className={`h-24 flex flex-col p-2 ${
                  hasReports 
                    ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                    : isWeekend 
                      ? 'bg-gray-50 hover:bg-gray-100' 
                      : ''
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onDateSelect(date)}
              >
                <div className="flex flex-col items-center w-full h-full">
                  <span className={`text-sm font-bold mb-1 ${
                    dayOfWeek === 0 ? 'text-red-600' : 
                    dayOfWeek === 6 ? 'text-blue-600' : 
                    'text-gray-700'
                  }`}>
                    {new Date(date).getDate()}
                  </span>
                  {hasReports && (
                    <div className="flex flex-col items-center w-full space-y-1 flex-1">
                      {dayReports.length === 1 ? (
                        // 평일 또는 단일 보고서
                        <div className="text-center w-full">
                          <div className="bg-green-100 rounded-full px-2 py-1">
                            <div className="text-xs font-medium text-green-800 truncate">
                              {dayReports[0].worker_name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // 주말 보고서 (2개, 주간/야간으로 구분하여 표시)
                        <div className="flex flex-col space-y-1 w-full">
                          {dayReports
                            .sort((a, b) => {
                              // 주간을 먼저, 야간을 나중에 정렬
                              if (a.assignment?.duty_type === '주말주간') return -1;
                              if (b.assignment?.duty_type === '주말주간') return 1;
                              return 0;
                            })
                            .map((report) => (
                            <div key={report.id} className="text-center w-full">
                              <div className={`rounded-full px-2 py-0.5 ${
                                report.assignment?.duty_type === '주말주간' 
                                  ? 'bg-yellow-100' 
                                  : 'bg-blue-100'
                              }`}>
                                <div className={`text-xs font-medium truncate ${
                                  report.assignment?.duty_type === '주말주간' 
                                    ? 'text-yellow-800' 
                                    : 'text-blue-800'
                                }`}>
                                  {report.worker_name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
