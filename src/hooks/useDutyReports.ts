
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DutyReportWithWorker } from '@/types/dutyReport';
import { toast } from 'sonner';

export const useDutyReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<DutyReportWithWorker[]>([]);

  const fetchDutyReports = async (year: number, month: number): Promise<DutyReportWithWorker[]> => {
    setIsLoading(true);
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      console.log('Fetching duty reports for date range:', startDate, 'to', endDate);

      // 당직 보고서 데이터를 조회
      const { data: reportsData, error: reportsError } = await supabase
        .from('duty_reports')
        .select('*')
        .gte('report_date', startDate)
        .lte('report_date', endDate)
        .order('report_date', { ascending: true }); // 날짜 순으로 정렬

      if (reportsError) {
        console.error('Error fetching duty reports:', reportsError);
        toast.error('당직 보고서를 불러오는데 실패했습니다.');
        return [];
      }

      console.log(`Found ${reportsData?.length || 0} duty reports for ${year}-${month}`);

      if (!reportsData || reportsData.length === 0) {
        return [];
      }

      // 근로자 정보 조회
      const { data: workers, error: workersError } = await supabase
        .from('worker_list')
        .select('*');

      if (workersError) {
        console.error('Error fetching workers:', workersError);
        toast.error('근로자 정보를 불러오는데 실패했습니다.');
        return [];
      }

      // 당직 배정 정보 조회
      const { data: assignments, error: assignmentsError } = await supabase
        .from('duty_assignments')
        .select('*')
        .gte('assignment_date', startDate)
        .lte('assignment_date', endDate);

      if (assignmentsError) {
        console.error('Error fetching duty assignments:', assignmentsError);
      }

      // 데이터 조합 - assignment_id를 사용하여 정확한 매칭
      const reportsWithWorker: DutyReportWithWorker[] = reportsData.map(report => {
        // assignment_id로 정확한 당직 배정 찾기
        const matchingAssignment = assignments?.find(a => a.id === report.assignment_id);
        
        // duty_worker_id로 근로자 정보 찾기 (보고서에 직접 저장된 당직자 ID 사용)
        const worker = workers?.find(w => w.일련번호 === report.duty_worker_id);
        
        let assignmentInfo = undefined;
        if (matchingAssignment) {
          const primaryWorker = workers?.find(w => w.일련번호 === matchingAssignment.primary_worker_id);
          const backupWorker = workers?.find(w => w.일련번호 === matchingAssignment.backup_worker_id);
          
          assignmentInfo = {
            duty_type: matchingAssignment.duty_type,
            primary_worker_name: primaryWorker?.이름 || '알 수 없음',
            backup_worker_name: backupWorker?.이름 || '알 수 없음'
          };
        }

        return {
          ...report,
          worker_name: worker?.이름 || '알 수 없음',
          worker_department: worker?.소속부서 || '알 수 없음',
          assignment: assignmentInfo
        };
      });

      console.log('Reports with worker info:', reportsWithWorker.map(r => ({ 
        date: r.report_date, 
        worker: r.worker_name, 
        type: r.assignment?.duty_type 
      })));

      setReports(reportsWithWorker);
      return reportsWithWorker;
    } catch (error) {
      console.error('Error in fetchDutyReports:', error);
      toast.error('당직 보고서를 불러오는데 실패했습니다.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getDutyReportsByDate = async (date: string): Promise<DutyReportWithWorker[]> => {
    try {
      console.log('Getting duty reports for date:', date);
      
      // 해당 날짜의 모든 보고서를 조회 (single() 대신 여러 개 가능)
      const { data: reportsData, error: reportsError } = await supabase
        .from('duty_reports')
        .select('*')
        .eq('report_date', date);

      if (reportsError) {
        console.error('Error fetching duty reports:', reportsError);
        return [];
      }

      if (!reportsData || reportsData.length === 0) {
        console.log('No duty reports found for date:', date);
        return [];
      }

      console.log(`Found ${reportsData.length} duty reports for date:`, date);

      // 근로자 정보 조회
      const { data: workers } = await supabase
        .from('worker_list')
        .select('*');

      // 당직 배정 정보 조회
      const { data: assignments } = await supabase
        .from('duty_assignments')
        .select('*')
        .eq('assignment_date', date);

      // 각 보고서에 대해 근로자 정보와 배정 정보를 결합
      const reportsWithWorker: DutyReportWithWorker[] = reportsData.map(report => {
        const worker = workers?.find(w => w.일련번호 === report.duty_worker_id);
        const assignment = assignments?.find(a => a.id === report.assignment_id);

        let assignmentInfo = undefined;
        if (assignment) {
          const primaryWorker = workers?.find(w => w.일련번호 === assignment.primary_worker_id);
          const backupWorker = workers?.find(w => w.일련번호 === assignment.backup_worker_id);
          
          assignmentInfo = {
            duty_type: assignment.duty_type,
            primary_worker_name: primaryWorker?.이름 || '알 수 없음',
            backup_worker_name: backupWorker?.이름 || '알 수 없음'
          };
        }

        return {
          ...report,
          worker_name: worker?.이름 || '알 수 없음',
          worker_department: worker?.소속부서 || '알 수 없음',
          assignment: assignmentInfo
        };
      });

      console.log('Final reports with worker info:', reportsWithWorker);
      return reportsWithWorker;
    } catch (error) {
      console.error('Error fetching duty reports by date:', error);
      return [];
    }
  };

  // 하위 호환성을 위해 기존 함수명도 유지
  const getDutyReportByDate = async (date: string): Promise<DutyReportWithWorker | null> => {
    const reports = await getDutyReportsByDate(date);
    return reports.length > 0 ? reports[0] : null;
  };

  return {
    isLoading,
    reports,
    fetchDutyReports,
    getDutyReportByDate,
    getDutyReportsByDate // 새로운 함수 추가
  };
};
