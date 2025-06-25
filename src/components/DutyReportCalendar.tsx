
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>월별 보고서 목록</CardTitle>
        <CardDescription>{selectedMonth}의 당직 보고서 현황 (총 {reports.length}건)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {monthDates.map(date => {
            const hasReport = reportsMap.has(date);
            const isSelected = date === selectedDate;
            const reportData = reportsMap.get(date);
            
            return (
              <Button
                key={date}
                variant={isSelected ? "default" : hasReport ? "outline" : "ghost"}
                size="sm"
                className={`h-16 flex flex-col ${hasReport ? 'border-green-300 bg-green-50 hover:bg-green-100' : ''}`}
                onClick={() => onDateSelect(date)}
              >
                <span className="text-xs">{new Date(date).getDate()}</span>
                {hasReport && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-green-600">●</span>
                    <span className="text-xs text-green-600 truncate w-full">
                      {reportData?.worker_name}
                    </span>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            보고서 작성 완료
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
