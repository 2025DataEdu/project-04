
import { Worker } from '@/types/duty';
import { supabase } from '@/integrations/supabase/client';

export interface WorkerAssignmentCounts {
  [key: number]: number;
}

export const initializeWorkerCounts = (workers: Worker[]): WorkerAssignmentCounts => {
  const counts: WorkerAssignmentCounts = {};
  workers.forEach(worker => {
    counts[worker.일련번호] = 0;
  });
  return counts;
};

export const getSortedWorkersByAssignmentCount = (
  workers: Worker[], 
  counts: WorkerAssignmentCounts
): Worker[] => {
  return [...workers].sort((a, b) => 
    counts[a.일련번호] - counts[b.일련번호]
  );
};

export const createDutyAssignment = async (
  dateString: string,
  dutyType: '평일야간' | '주말주간' | '주말야간',
  primaryWorkerId: number,
  backupWorkerId: number
) => {
  const result = await supabase
    .from('duty_assignments')
    .insert({
      assignment_date: dateString,
      duty_type: dutyType,
      primary_worker_id: primaryWorkerId,
      backup_worker_id: backupWorkerId
    })
    .select()
    .single();

  return result;
};

export const isWeekday = (dayOfWeek: number): boolean => {
  return dayOfWeek >= 1 && dayOfWeek <= 5;
};

export const isWeekend = (dayOfWeek: number): boolean => {
  return dayOfWeek === 0 || dayOfWeek === 6;
};
