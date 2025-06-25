
import { supabase } from '@/integrations/supabase/client';
import { Worker, DutyAssignmentWithWorkers } from '@/types/duty';
import { toast } from 'sonner';

export const fetchDutyAssignments = async (
  startDate?: string, 
  endDate?: string
): Promise<DutyAssignmentWithWorkers[]> => {
  try {
    // 먼저 당직 배정 정보를 가져옵니다
    let assignmentQuery = supabase
      .from('duty_assignments')
      .select('*')
      .order('assignment_date', { ascending: true });

    if (startDate) {
      assignmentQuery = assignmentQuery.gte('assignment_date', startDate);
    }
    if (endDate) {
      assignmentQuery = assignmentQuery.lte('assignment_date', endDate);
    }

    const { data: assignments, error: assignmentError } = await assignmentQuery;

    if (assignmentError) {
      console.error('Error fetching duty assignments:', assignmentError);
      toast.error('당직 배정 목록을 불러오는데 실패했습니다.');
      return [];
    }

    if (!assignments || assignments.length === 0) {
      return [];
    }

    // 별도로 근로자 정보를 가져옵니다
    const { data: workers, error: workersError } = await supabase
      .from('worker_list')
      .select('*');

    if (workersError) {
      console.error('Error fetching workers:', workersError);
      toast.error('근로자 목록을 불러오는데 실패했습니다.');
      return [];
    }

    // 수동으로 조인합니다
    const assignmentsWithWorkers: DutyAssignmentWithWorkers[] = assignments.map(assignment => {
      const primaryWorker = workers?.find(w => w.일련번호 === assignment.primary_worker_id);
      const backupWorker = workers?.find(w => w.일련번호 === assignment.backup_worker_id);

      if (!primaryWorker || !backupWorker) {
        console.warn('Worker not found for assignment:', assignment);
      }

      return {
        ...assignment,
        duty_type: assignment.duty_type as '평일야간' | '주말주간' | '주말야간',
        primary_worker: primaryWorker || {} as Worker,
        backup_worker: backupWorker || {} as Worker
      };
    });

    return assignmentsWithWorkers;
  } catch (error) {
    console.error('Error in fetchDutyAssignments:', error);
    toast.error('당직 배정 목록을 불러오는데 실패했습니다.');
    return [];
  }
};
