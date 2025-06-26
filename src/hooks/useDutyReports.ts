
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

      // assignment_id를 기준으로 정확한 매칭을 위해 조인 사용
      const { data: reportsData, error: reportsError } = await supabase
        .from('duty_reports')
        .select(`
          *,
          duty_assignments!inner(
            id,
            assignment_date,
            duty_type,
            primary_worker_id,
            backup_worker_id
          )
        `)
        .gte('report_date', startDate)
        .lte('report_date', endDate)
        .order('report_date', { ascending: true });

      if (reportsError) {
        console.error('Error fetching duty reports:', reportsError);
        toast.error('당직 보고서를 불러오는데 실패했습니다.');
        return [];
      }

      console.log(`Found ${reportsData?.length || 0} duty reports for ${year}-${month}`);

      if (!reportsData || reportsData.length === 0) {
        setReports([]);
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

      // 데이터 조합 - assignment_id를 통한 정확한 매칭
      const reportsWithWorker: DutyReportWithWorker[] = reportsData.map(report => {
        // assignment에서 가져온 정보 사용
        const assignment = report.duty_assignments;
        
        // duty_worker_id로 근로자 정보 찾기
        const worker = workers?.find(w => w.일련번호 === report.duty_worker_id);
        
        // 주당직자와 예비당직자 정보
        const primaryWorker = workers?.find(w => w.일련번호 === assignment.primary_worker_id);
        const backupWorker = workers?.find(w => w.일련번호 === assignment.backup_worker_id);
        
        const assignmentInfo = {
          duty_type: assignment.duty_type,
          primary_worker_name: primaryWorker?.이름 || '알 수 없음',
          backup_worker_name: backupWorker?.이름 || '알 수 없음'
        };

        // duty_assignments 속성 제거하고 필요한 정보만 포함
        const { duty_assignments, ...reportWithoutAssignment } = report;

        return {
          ...reportWithoutAssignment,
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
      
      // assignment_id를 기준으로 정확한 매칭
      const { data: reportsData, error: reportsError } = await supabase
        .from('duty_reports')
        .select(`
          *,
          duty_assignments!inner(
            id,
            assignment_date,
            duty_type,
            primary_worker_id,
            backup_worker_id
          )
        `)
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

      // 각 보고서에 대해 근로자 정보와 배정 정보를 결합
      const reportsWithWorker: DutyReportWithWorker[] = reportsData.map(report => {
        const assignment = report.duty_assignments;
        const worker = workers?.find(w => w.일련번호 === report.duty_worker_id);
        
        const primaryWorker = workers?.find(w => w.일련번호 === assignment.primary_worker_id);
        const backupWorker = workers?.find(w => w.일련번호 === assignment.backup_worker_id);
        
        const assignmentInfo = {
          duty_type: assignment.duty_type,
          primary_worker_name: primaryWorker?.이름 || '알 수 없음',
          backup_worker_name: backupWorker?.이름 || '알 수 없음'
        };

        // duty_assignments 속성 제거
        const { duty_assignments, ...reportWithoutAssignment } = report;

        return {
          ...reportWithoutAssignment,
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
    getDutyReportsByDate
  };
};
