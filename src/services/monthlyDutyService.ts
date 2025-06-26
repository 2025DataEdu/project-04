
import { supabase } from '@/integrations/supabase/client';
import { Worker, DutyAssignment } from '@/types/duty';
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
  try {
    // 정확한 월의 첫날과 마지막날 계산 (month는 1-12, JavaScript Date는 0-11을 사용)
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    console.log(`Deleting existing assignments for ${startDate} to ${endDate}`);
    
    // CASCADE DELETE가 설정되어 있으므로 당직 배정만 삭제하면 됨
    const { error: deleteError } = await supabase
      .from('duty_assignments')
      .delete()
      .gte('assignment_date', startDate)
      .lte('assignment_date', endDate);

    if (deleteError) {
      console.error('Error deleting duty assignments:', deleteError);
      throw new Error(`기존 배정 삭제 실패: ${deleteError.message}`);
    }

    console.log('Successfully deleted existing assignments and related reports');

    // 해당 월의 모든 날짜 생성 (정확한 월의 일수 계산)
    const daysInMonth = new Date(year, month, 0).getDate(); // new Date(2025, 6, 0) = 2025년 6월 30일
    const assignments: DutyAssignment[] = [];
    
    // 근로자별 배정 횟수 추적
    const workerCounts = initializeWorkerCounts(workers);
    
    for (let day = 1; day <= daysInMonth; day++) {
      // 정확한 월로 날짜 생성 (month - 1을 사용하여 JavaScript의 0-based month에 맞춤)
      const currentDate = new Date(year, month - 1, day);
      const dayOfWeek = currentDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
      const dateString = currentDate.toISOString().split('T')[0];
      
      // 요일에 따른 당직 유형 및 배정 결정
      if (isWeekday(dayOfWeek)) {
        // 월요일(1)~금요일(5): 평일야간만 배정
        const sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
        const primaryWorker = sortedWorkers[0];
        const backupWorker = sortedWorkers[1];
        
        const result = await createDutyAssignment(
          dateString,
          '평일야간',
          primaryWorker.일련번호,
          backupWorker.일련번호
        );
        
        if (result.error) {
          console.error('Error creating weekday duty assignment:', result.error);
          throw new Error(`평일야간 당직 배정 생성 실패: ${result.error.message}`);
        }
        
        if (result.data) {
          const assignmentWithCorrectType: DutyAssignment = {
            ...result.data,
            duty_type: result.data.duty_type as '평일야간' | '주말주간' | '주말야간'
          };
          assignments.push(assignmentWithCorrectType);
          workerCounts[primaryWorker.일련번호]++;
          workerCounts[backupWorker.일련번호]++;
        }
      } else {
        // 토요일(6), 일요일(0): 주말주간과 주말야간 모두 배정
        
        // 1. 주말주간 배정
        let sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
        const dayPrimaryWorker = sortedWorkers[0];
        const dayBackupWorker = sortedWorkers[1];
        
        const dayResult = await createDutyAssignment(
          dateString,
          '주말주간',
          dayPrimaryWorker.일련번호,
          dayBackupWorker.일련번호
        );
        
        if (dayResult.error) {
          console.error('Error creating weekend day duty assignment:', dayResult.error);
          throw new Error(`주말주간 당직 배정 생성 실패: ${dayResult.error.message}`);
        }
        
        if (dayResult.data) {
          const dayAssignmentWithCorrectType: DutyAssignment = {
            ...dayResult.data,
            duty_type: dayResult.data.duty_type as '평일야간' | '주말주간' | '주말야간'
          };
          assignments.push(dayAssignmentWithCorrectType);
          workerCounts[dayPrimaryWorker.일련번호]++;
          workerCounts[dayBackupWorker.일련번호]++;
        }
        
        // 2. 주말야간 배정 (다른 근로자들로)
        sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
        const nightPrimaryWorker = sortedWorkers[0];
        const nightBackupWorker = sortedWorkers[1];
        
        const nightResult = await createDutyAssignment(
          dateString,
          '주말야간',
          nightPrimaryWorker.일련번호,
          nightBackupWorker.일련번호
        );
        
        if (nightResult.error) {
          console.error('Error creating weekend night duty assignment:', nightResult.error);
          throw new Error(`주말야간 당직 배정 생성 실패: ${nightResult.error.message}`);
        }
        
        if (nightResult.data) {
          const nightAssignmentWithCorrectType: DutyAssignment = {
            ...nightResult.data,
            duty_type: nightResult.data.duty_type as '평일야간' | '주말주간' | '주말야간'
          };
          assignments.push(nightAssignmentWithCorrectType);
          workerCounts[nightPrimaryWorker.일련번호]++;
          workerCounts[nightBackupWorker.일련번호]++;
        }
      }
    }
    
    console.log(`Successfully created ${assignments.length} assignments for ${year}-${month.toString().padStart(2, '0')}`);
    return assignments;
  } catch (error) {
    console.error('Monthly duty assignment error:', error);
    throw error;
  }
};
