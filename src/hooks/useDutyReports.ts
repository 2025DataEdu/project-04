
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
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

      // 당직 보고서 데이터를 조회
      const { data: reportsData, error: reportsError } = await supabase
        .from('duty_reports')
        .select('*')
        .gte('report_date', startDate)
        .lte('report_date', endDate)
        .order('report_date', { ascending: false });

      if (reportsError) {
        console.error('Error fetching duty reports:', reportsError);
        toast.error('당직 보고서를 불러오는데 실패했습니다.');
        return [];
      }

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

      // 데이터 조합
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

  const getDutyReportByDate = async (date: string): Promise<DutyReportWithWorker | null> => {
    try {
      const { data: reportData, error: reportError } = await supabase
        .from('duty_reports')
        .select('*')
        .eq('report_date', date)
        .single();

      if (reportError || !reportData) {
        return null;
      }

      // 근로자 정보 조회
      const { data: worker } = await supabase
        .from('worker_list')
        .select('*')
        .eq('일련번호', reportData.duty_worker_id)
        .single();

      // 당직 배정 정보 조회
      const { data: assignment } = await supabase
        .from('duty_assignments')
        .select('*')
        .eq('id', reportData.assignment_id)
        .single();

      let assignmentInfo = undefined;
      if (assignment) {
        const { data: workers } = await supabase
          .from('worker_list')
          .select('*')
          .in('일련번호', [assignment.primary_worker_id, assignment.backup_worker_id]);

        const primaryWorker = workers?.find(w => w.일련번호 === assignment.primary_worker_id);
        const backupWorker = workers?.find(w => w.일련번호 === assignment.backup_worker_id);
        
        assignmentInfo = {
          duty_type: assignment.duty_type,
          primary_worker_name: primaryWorker?.이름 || '알 수 없음',
          backup_worker_name: backupWorker?.이름 || '알 수 없음'
        };
      }

      return {
        ...reportData,
        worker_name: worker?.이름 || '알 수 없음',
        worker_department: worker?.소속부서 || '알 수 없음',
        assignment: assignmentInfo
      };
    } catch (error) {
      console.error('Error fetching duty report by date:', error);
      return null;
    }
  };

  return {
    isLoading,
    reports,
    fetchDutyReports,
    getDutyReportByDate
  };
};
