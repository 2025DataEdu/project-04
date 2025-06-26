
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
    // 기존 배정 데이터 삭제 (외래 키 제약조건 때문에 순서 중요)
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    console.log(`Deleting existing assignments for ${startDate} to ${endDate}`);
    
    // 1단계: 해당 기간의 당직 배정 ID들을 먼저 조회
    const { data: existingAssignments, error: fetchError } = await supabase
      .from('duty_assignments')
      .select('id')
      .gte('assignment_date', startDate)
      .lte('assignment_date', endDate);

    if (fetchError) {
      console.error('Error fetching existing assignments:', fetchError);
      throw new Error(`기존 배정 조회 실패: ${fetchError.message}`);
    }

    // 2단계: 해당 assignment_id들과 연결된 당직 보고서 삭제
    if (existingAssignments && existingAssignments.length > 0) {
      const assignmentIds = existingAssignments.map(a => a.id);
      console.log(`Deleting duty reports for ${assignmentIds.length} assignments`);
      
      const { error: deleteReportsError } = await supabase
        .from('duty_reports')
        .delete()
        .in('assignment_id', assignmentIds);

      if (deleteReportsError) {
        console.error('Error deleting duty reports:', deleteReportsError);
        throw new Error(`기존 당직 보고서 삭제 실패: ${deleteReportsError.message}`);
      }
    }

    // 3단계: 당직 배정 삭제
    const { error: deleteError } = await supabase
      .from('duty_assignments')
      .delete()
      .gte('assignment_date', startDate)
      .lte('assignment_date', endDate);

    if (deleteError) {
      console.error('Error deleting duty assignments:', deleteError);
      throw new Error(`기존 배정 삭제 실패: ${deleteError.message}`);
    }

    console.log('Successfully deleted existing assignments and reports');

    // 해당 월의 모든 날짜 생성
    const daysInMonth = new Date(year, month, 0).getDate();
    const assignments: DutyAssignment[] = [];
    
    // 근로자별 배정 횟수 추적
    const workerCounts = initializeWorkerCounts(workers);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayOfWeek = currentDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
      const dateString = currentDate.toISOString().split('T')[0];
      
      // 요일에 따른 당직 유형 결정
      let dutyType: '평일야간' | '주말주간' | '주말야간';
      
      if (isWeekday(dayOfWeek)) {
        // 월요일(1)~금요일(5): 평일야간
        dutyType = '평일야간';
      } else {
        // 토요일(6), 일요일(0): 주말주간
        dutyType = '주말주간';
      }
      
      // 가장 적게 배정된 근로자들을 우선 선택
      const sortedWorkers = getSortedWorkersByAssignmentCount(workers, workerCounts);
      
      const primaryWorker = sortedWorkers[0];
      const backupWorker = sortedWorkers[1];
      
      // 당직 배정 생성
      const result = await createDutyAssignment(
        dateString,
        dutyType,
        primaryWorker.일련번호,
        backupWorker.일련번호
      );
      
      if (result.error) {
        console.error('Error creating duty assignment:', result.error);
        throw new Error(`당직 배정 생성 실패: ${result.error.message}`);
      }
      
      if (result.data) {
        // 타입 단언을 사용하여 duty_type을 올바른 타입으로 변환
        const assignmentWithCorrectType: DutyAssignment = {
          ...result.data,
          duty_type: result.data.duty_type as '평일야간' | '주말주간' | '주말야간'
        };
        
        assignments.push(assignmentWithCorrectType);
        
        // 배정 횟수 업데이트
        workerCounts[primaryWorker.일련번호]++;
        workerCounts[backupWorker.일련번호]++;
      }
    }
    
    console.log(`Successfully created ${assignments.length} assignments`);
    return assignments;
  } catch (error) {
    console.error('Monthly duty assignment error:', error);
    throw error;
  }
};
