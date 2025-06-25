
import React, { useState, useEffect } from 'react';
import { useDutyReports } from '@/hooks/useDutyReports';
import { DutyReportWithWorker } from '@/types/dutyReport';
import { DutyReportHeader } from './DutyReportHeader';
import { DutyReportSummary } from './DutyReportSummary';
import { DutyReportDetails } from './DutyReportDetails';
import { DutyReportCalendar } from './DutyReportCalendar';

const DutyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState('2025-06'); // 2025년 6월로 업데이트
  const [currentReport, setCurrentReport] = useState<DutyReportWithWorker | null>(null);

  const { isLoading, reports, fetchDutyReports, getDutyReportByDate } = useDutyReports();

  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    fetchDutyReports(year, month);
  }, [selectedMonth]);

  useEffect(() => {
    const loadReportForDate = async () => {
      const report = await getDutyReportByDate(selectedDate);
      setCurrentReport(report);
    };
    loadReportForDate();
  }, [selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedMonth + '-01');
    currentDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setSelectedMonth(currentDate.toISOString().slice(0, 7));
  };

  const generateDatesForMonth = (month: string) => {
    const year = parseInt(month.split('-')[0]);
    const monthNum = parseInt(month.split('-')[1]);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return `${month}-${day}`;
    });
  };

  const monthDates = generateDatesForMonth(selectedMonth);

  return (
    <div className="space-y-6">
      <DutyReportHeader 
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        monthDates={monthDates}
        onMonthNavigate={navigateMonth}
        onDateChange={setSelectedDate}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : currentReport ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <DutyReportSummary report={currentReport} />
          <DutyReportDetails report={currentReport} />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          선택한 날짜({selectedDate})에 대한 당직 보고서가 없습니다.
        </div>
      )}

      <DutyReportCalendar 
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        monthDates={monthDates}
        reports={reports}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
};

export default DutyReport;
