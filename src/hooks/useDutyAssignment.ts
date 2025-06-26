
import { useState } from 'react';
import { DutyAssignmentWithWorkers } from '@/types/duty';
import { toast } from 'sonner';
import { useWorkers } from './useWorkers';
import { assignMonthlyDuties as performMonthlyAssignment } from '@/services/monthlyDutyService';
import { createDutyReportsForAssignments } from '@/services/dutyReportService';
import { fetchDutyAssignments } from '@/services/dutyAssignmentService';

export const useDutyAssignment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAvailableWorkers } = useWorkers();

  const assignMonthlyDuties = async (year: number, month: number) => {
    setIsLoading(true);
    try {
      const workers = await getAvailableWorkers();
      
      // 당직 배정 수행
      const assignments = await performMonthlyAssignment(year, month, workers);
      
      // 당직 보고서 자동 생성
      await createDutyReportsForAssignments(assignments);
      
      toast.success(
        `${year}년 ${month}월 당직이 성공적으로 배정되었습니다. (총 ${assignments.length}건)\n` +
        '당직 보고서도 함께 생성되었습니다.'
      );
      return assignments;
    } catch (error) {
      console.error('Error in assignMonthlyDuties:', error);
      toast.error('월별 당직 배정에 실패했습니다.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getDutyAssignments = async (startDate?: string, endDate?: string): Promise<DutyAssignmentWithWorkers[]> => {
    return fetchDutyAssignments(startDate, endDate);
  };

  return {
    isLoading,
    assignMonthlyDuties,
    getDutyAssignments,
    getAvailableWorkers
  };
};
