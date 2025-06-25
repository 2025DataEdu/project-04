
import { useState, useEffect } from 'react';
import { useDutyReports } from '@/hooks/useDutyReports';
import { DutyReportWithWorker } from '@/types/dutyReport';
import { HandoverReport } from '@/types/handover';

export const useHandoverReports = (selectedWeek: Date) => {
  const [handoverReports, setHandoverReports] = useState<HandoverReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchDutyReports } = useDutyReports();

  const convertDutyReportsToHandover = (dutyReports: DutyReportWithWorker[]): HandoverReport[] => {
    try {
      return dutyReports.map(report => {
        const reportDate = new Date(report.report_date);
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        
        return {
          id: report.id || '',
          date: report.report_date || '',
          dayOfWeek: dayNames[reportDate.getDay()] || '',
          dutyType: report.assignment?.duty_type || '당직',
          reportContent: {
            commanderInstructions: report.instruction_content || '지시사항 없음',
            patrolReport: report.patrol_content || '순찰 내용 없음',
            handoverSummary: report.handover_notes || '인수인계 사항 없음',
            issues: report.handover_issues || '없음',
            pendingTasks: report.handover_pending || '대기 중인 업무 없음',
            nextDutyNotes: report.instruction_handover || '전달사항 없음'
          },
          reportedBy: report.worker_name || '알 수 없음',
          department: report.worker_department || '알 수 없음',
          reportTime: report.patrol_datetime?.split(' ')[1] || report.created_at?.split('T')[1]?.split('.')[0] || '미기록'
        };
      });
    } catch (error) {
      console.error('Error converting duty reports to handover:', error);
      return [];
    }
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const getReportForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return handoverReports.find(report => report.date === dateString);
  };

  useEffect(() => {
    const loadWeekData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const weekDays = getWeekDays(selectedWeek);
        const year = weekDays[0].getFullYear();
        const month = weekDays[0].getMonth() + 1;
        
        console.log(`Loading handover data for ${year}-${month}`);
        
        const weekReports = await fetchDutyReports(year, month);
        
        if (!weekReports) {
          console.log('No reports returned from fetchDutyReports');
          setHandoverReports([]);
          return;
        }

        const startDate = weekDays[0].toISOString().split('T')[0];
        const endDate = weekDays[6].toISOString().split('T')[0];
        
        const filteredReports = weekReports.filter(report => {
          if (!report.report_date) return false;
          const reportDate = report.report_date;
          return reportDate >= startDate && reportDate <= endDate;
        });
        
        console.log(`Filtered ${filteredReports.length} reports for week ${startDate} to ${endDate}`);
        
        const convertedReports = convertDutyReportsToHandover(filteredReports);
        setHandoverReports(convertedReports);
        
      } catch (error) {
        console.error('Error loading handover data:', error);
        setError('당직보고서를 불러오는데 실패했습니다.');
        setHandoverReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeekData();
  }, [selectedWeek, fetchDutyReports]);

  return {
    handoverReports,
    isLoading,
    error,
    getWeekDays,
    getReportForDate
  };
};
