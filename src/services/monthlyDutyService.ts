
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
    console.log(`Starting monthly duty assignment for ${year}년 ${month}월`);
    console.log(`Available workers: ${workers.length}`);

    // 근로자가 충분한지 확인
    if (workers.length < 2) {
      throw new Error('당직 배정을 위해서는 최소 2명의 근로자가 필요합니다.');
    }

    // 정확한 월의 첫날과 마지막날 계산
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    
    // 해당 월의 마지막 날 계산 (1-based month 사용)
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`;
    
    console.log(`Processing ${year}년 ${month}월 assignments`);
    console.log(`Date range: ${startDate} to ${endDate}`);
    console.log(`Days in month: ${lastDayOfMonth}`);
    
    // 기존 배정 삭제 (CASCADE DELETE가 설정되어 있으므로 관련 보고서도 함께 삭제됨)
    console.log('Deleting existing assignments...');
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
    
    const assignments: DutyAssignment[] = [];
    
    // 근로자별 배정 횟수 추적
    const workerCounts = initializeWorkerCounts(workers);
    console.log('Initial worker counts:', workerCounts);
    
    for (let day = 1; day <= lastDayOfMonth; day++) {
      try {
        // 정확한 날짜 문자열 생성
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        // 해당 날짜의 요일 구하기 (0: 일요일, 1: 월요일, ..., 6: 토요일)
        const currentDate = new Date(year, month - 1, day); // JavaScript Date는 0-based month
        const dayOfWeek = currentDate.getDay();
        
        console.log(`Processing day ${day}: ${dateString}, dayOfWeek: ${dayOfWeek}`);
        
        // 요일에 따른 당직 유형 및 배정 결정
        if (isWeekday(dayOfWeek)) {
          // 월요일(1)~금요일(5): 평일야간만 배정
          const sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
          
          if (sortedWorkers.length < 2) {
            throw new Error(`${dateString}에 배정할 수 있는 근로자가 부족합니다.`);
          }
          
          const primaryWorker = sortedWorkers[0];
          const backupWorker = sortedWorkers[1];
          
          console.log(`평일야간 배정 - Primary: ${primaryWorker.이름}, Backup: ${backupWorker.이름}`);
          
          const result = await createDutyAssignment(
            dateString,
            '평일야간',
            primaryWorker.일련번호,
            backupWorker.일련번호
          );
          
          if (result.error) {
            console.error('Error creating weekday duty assignment:', result.error);
            throw new Error(`${dateString} 평일야간 당직 배정 생성 실패: ${result.error.message}`);
          }
          
          if (result.data) {
            const assignmentWithCorrectType: DutyAssignment = {
              ...result.data,
              duty_type: result.data.duty_type as '평일야간' | '주말주간' | '주말야간'
            };
            assignments.push(assignmentWithCorrectType);
            workerCounts[primaryWorker.일련번호]++;
            workerCounts[backupWorker.일련번호]++;
            console.log(`Successfully created weekday assignment for ${dateString}`);
          }
        } else {
          // 토요일(6), 일요일(0): 주말주간과 주말야간 모두 배정
          console.log(`주말 배정 처리 중...`);
          
          if (workers.length < 4) {
            console.warn(`주말 배정을 위해서는 최소 4명의 근로자가 권장됩니다. 현재 ${workers.length}명`);
          }
          
          // 1. 주말주간 배정
          let sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
          const dayPrimaryWorker = sortedWorkers[0];
          const dayBackupWorker = sortedWorkers[1];
          
          console.log(`주말주간 배정 - Primary: ${dayPrimaryWorker.이름}, Backup: ${dayBackupWorker.이름}`);
          
          const dayResult = await createDutyAssignment(
            dateString,
            '주말주간',
            dayPrimaryWorker.일련번호,
            dayBackupWorker.일련번호
          );
          
          if (dayResult.error) {
            console.error('Error creating weekend day duty assignment:', dayResult.error);
            throw new Error(`${dateString} 주말주간 당직 배정 생성 실패: ${dayResult.error.message}`);
          }
          
          if (dayResult.data) {
            const dayAssignmentWithCorrectType: DutyAssignment = {
              ...dayResult.data,
              duty_type: dayResult.data.duty_type as '평일야간' | '주말주간' | '주말야간'
            };
            assignments.push(dayAssignmentWithCorrectType);
            workerCounts[dayPrimaryWorker.일련번호]++;
            workerCounts[dayBackupWorker.일련번호]++;
            console.log(`Successfully created weekend day assignment for ${dateString}`);
          }
          
          // 2. 주말야간 배정 (다른 근로자들로)
          sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
          const nightPrimaryWorker = sortedWorkers[0];
          const nightBackupWorker = sortedWorkers[1];
          
          console.log(`주말야간 배정 - Primary: ${nightPrimaryWorker.이름}, Backup: ${nightBackupWorker.이름}`);
          
          const nightResult = await createDutyAssignment(
            dateString,
            '주말야간',
            nightPrimaryWorker.일련번호,
            nightBackupWorker.일련번호
          );
          
          if (nightResult.error) {
            console.error('Error creating weekend night duty assignment:', nightResult.error);
            throw new Error(`${dateString} 주말야간 당직 배정 생성 실패: ${nightResult.error.message}`);
          }
          
          if (nightResult.data) {
            const nightAssignmentWithCorrectType: DutyAssignment = {
              ...nightResult.data,
              duty_type: nightResult.data.duty_type as '평일야간' | '주말주간' | '주말야간'
            };
            assignments.push(nightAssignmentWithCorrectType);
            workerCounts[nightPrimaryWorker.일련번호]++;
            workerCounts[nightBackupWorker.일련번호]++;
            console.log(`Successfully created weekend night assignment for ${dateString}`);
          }
        }
      } catch (dayError) {
        console.error(`Error processing day ${day}:`, dayError);
        throw new Error(`${day}일 당직 배정 처리 중 오류: ${dayError instanceof Error ? dayError.message : '알 수 없는 오류'}`);
      }
    }
    
    console.log(`Successfully created ${assignments.length} assignments for ${year}년 ${month}월`);
    console.log('Final worker assignment counts:', workerCounts);
    
    // 배정 결과 검증
    if (assignments.length === 0) {
      throw new Error('배정된 당직이 없습니다. 근로자 목록과 날짜를 확인해주세요.');
    }
    
    return assignments;
  } catch (error) {
    console.error('Monthly duty assignment error:', error);
    
    // 더 구체적인 에러 메시지 제공
    if (error instanceof Error) {
      throw new Error(`월별 당직 배정 실패: ${error.message}`);
    } else {
      throw new Error('월별 당직 배정 중 알 수 없는 오류가 발생했습니다.');
    }
  }
};
