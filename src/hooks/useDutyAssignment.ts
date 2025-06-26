
import { useState } from 'react';
import { DutyAssignmentWithWorkers } from '@/types/duty';
import { toast } from 'sonner';
import { useWorkers } from './useWorkers';
import { assignMonthlyDuties as performMonthlyAssignment } from '@/services/monthlyDutyService';
import { fetchDutyAssignments } from '@/services/dutyAssignmentService';
import { createDutyReportsForAssignments } from '@/services/dutyReportService';

export const useDutyAssignment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAvailableWorkers } = useWorkers();

  const assignMonthlyDuties = async (year: number, month: number) => {
    setIsLoading(true);
    try {
      const workers = await getAvailableWorkers();
      
      // 당직 배정 수행
      const assignments = await performMonthlyAssignment(year, month, workers);
      
      // 테스트를 위한 당직 보고서 자동 생성 로직
      // 현재 날짜의 전날까지의 배정에 대해서만 보고서 생성
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const yesterdayString = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      console.log(`Today: ${today.toISOString().split('T')[0]}, Yesterday: ${yesterdayString}`);
      
      // 어제까지의 배정만 필터링
      const assignmentsForReports = assignments.filter(assignment => {
        const assignmentDate = assignment.assignment_date;
        return assignmentDate <= yesterdayString;
      });
      
      console.log(`Total assignments: ${assignments.length}, Assignments for reports: ${assignmentsForReports.length}`);
      
      if (assignmentsForReports.length > 0) {
        try {
          await createDutyReportsForAssignments(assignmentsForReports);
          toast.success(
            `${year}년 ${month}월 당직이 성공적으로 배정되었습니다. (총 ${assignments.length}건)\n` +
            `당직 보고서도 ${assignmentsForReports.length}건 생성되었습니다.`
          );
        } catch (reportError) {
          console.error('Error creating duty reports:', reportError);
          toast.warning(
            `${year}년 ${month}월 당직이 성공적으로 배정되었습니다. (총 ${assignments.length}건)\n` +
            `단, 당직 보고서 생성 중 오류가 발생했습니다.`
          );
        }
      } else {
        toast.success(
          `${year}년 ${month}월 당직이 성공적으로 배정되었습니다. (총 ${assignments.length}건)\n` +
          `현재 날짜 이전의 배정이 없어 당직 보고서는 생성되지 않았습니다.`
        );
      }
      
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
