
import { Worker, DutyAssignment } from '@/types/duty';
import { toast } from 'sonner';
import { 
  initializeWorkerCounts, 
  getSortedWorkersByAssignmentCount, 
  createDutyAssignment,
  isWeekday,
  isWeekend,
  WorkerAssignmentCounts
} from '@/utils/dutyAssignmentUtils';

export const assignMonthlyDuties = async (
  year: number, 
  month: number, 
  workers: Worker[]
): Promise<DutyAssignment[]> => {
  if (workers.length < 4) {
    toast.error('배정 가능한 근로자가 부족합니다. 최소 4명이 필요합니다.');
    return [];
  }

  const assignments: DutyAssignment[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  const workerAssignmentCounts: WorkerAssignmentCounts = initializeWorkerCounts(workers);

  for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const dateString = currentDate.toISOString().split('T')[0];

    // 평일 (월-금) 야간 당직
    if (isWeekday(dayOfWeek)) {
      const sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerAssignmentCounts);
      const primary = sortedWorkers[0];
      const backup = sortedWorkers[1];

      const result = await createDutyAssignment(dateString, '평일야간', primary.일련번호, backup.일련번호);

      if (result.data) {
        assignments.push(result.data);
        workerAssignmentCounts[primary.일련번호]++;
        workerAssignmentCounts[backup.일련번호]++;
      }
    }

    // 주말 (토, 일) 주간 및 야간 당직
    if (isWeekend(dayOfWeek)) {
      // 주간 당직
      const sortedWorkersDay = getSortedWorkersByAssignmentCount(workers, workerAssignmentCounts);
      const dayPrimary = sortedWorkersDay[0];
      const dayBackup = sortedWorkersDay[1];

      const dayResult = await createDutyAssignment(dateString, '주말주간', dayPrimary.일련번호, dayBackup.일련번호);

      if (dayResult.data) {
        assignments.push(dayResult.data);
        workerAssignmentCounts[dayPrimary.일련번호]++;
        workerAssignmentCounts[dayBackup.일련번호]++;
      }

      // 야간 당직
      const sortedWorkersNight = getSortedWorkersByAssignmentCount(workers, workerAssignmentCounts);
      const nightPrimary = sortedWorkersNight[0];
      const nightBackup = sortedWorkersNight[1];

      const nightResult = await createDutyAssignment(dateString, '주말야간', nightPrimary.일련번호, nightBackup.일련번호);

      if (nightResult.data) {
        assignments.push(nightResult.data);
        workerAssignmentCounts[nightPrimary.일련번호]++;
        workerAssignmentCounts[nightBackup.일련번호]++;
      }
    }
  }

  return assignments;
};
