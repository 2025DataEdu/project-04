import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Worker, DutyAssignment, DutyAssignmentWithWorkers } from '@/types/duty';
import { toast } from 'sonner';

export const useDutyAssignment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getAvailableWorkers = async (): Promise<Worker[]> => {
    const { data, error } = await supabase
      .from('worker_list')
      .select('*')
      .neq('제외여부', 'Y');

    if (error) {
      console.error('Error fetching workers:', error);
      toast.error('근로자 목록을 불러오는데 실패했습니다.');
      return [];
    }

    return data || [];
  };

  const generateRandomAssignment = (workers: Worker[], excludeIds: number[] = []) => {
    const availableWorkers = workers.filter(w => !excludeIds.includes(w.일련번호));
    
    if (availableWorkers.length < 2) {
      throw new Error('배정 가능한 근로자가 부족합니다.');
    }

    const shuffled = [...availableWorkers].sort(() => Math.random() - 0.5);
    return {
      primary: shuffled[0],
      backup: shuffled[1]
    };
  };

  const assignDuty = async (date: string, dutyType: '평일야간' | '주말주간' | '주말야간') => {
    setIsLoading(true);
    try {
      const workers = await getAvailableWorkers();
      
      if (workers.length < 2) {
        toast.error('배정 가능한 근로자가 부족합니다.');
        return null;
      }

      const assignment = generateRandomAssignment(workers);

      const { data, error } = await supabase
        .from('duty_assignments')
        .insert({
          assignment_date: date,
          duty_type: dutyType,
          primary_worker_id: assignment.primary.일련번호,
          backup_worker_id: assignment.backup.일련번호
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating assignment:', error);
        toast.error('당직 배정에 실패했습니다.');
        return null;
      }

      toast.success(`${dutyType} 당직이 배정되었습니다.`);
      return data;
    } catch (error) {
      console.error('Error in assignDuty:', error);
      toast.error(error instanceof Error ? error.message : '당직 배정에 실패했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const assignWeeklyDuties = async (startDate: string) => {
    setIsLoading(true);
    try {
      const workers = await getAvailableWorkers();
      
      if (workers.length < 6) { // 평일야간 2명 + 주말주간 2명 + 주말야간 2명
        toast.error('배정 가능한 근로자가 부족합니다. 최소 6명이 필요합니다.');
        return [];
      }

      const start = new Date(startDate);
      const assignments = [];
      const usedWorkerIds: number[] = [];

      // 평일 야간 (월-금)
      for (let i = 0; i < 5; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // 주말 제외
          const assignment = generateRandomAssignment(workers, usedWorkerIds);
          usedWorkerIds.push(assignment.primary.일련번호, assignment.backup.일련번호);
          
          const result = await assignDuty(currentDate.toISOString().split('T')[0], '평일야간');
          if (result) assignments.push(result);
        }
      }

      // 주말 (토요일, 일요일)
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) { // 주말만
          // 주간 당직
          const dayAssignment = generateRandomAssignment(workers, usedWorkerIds);
          usedWorkerIds.push(dayAssignment.primary.일련번호, dayAssignment.backup.일련번호);
          
          const dayResult = await assignDuty(currentDate.toISOString().split('T')[0], '주말주간');
          if (dayResult) assignments.push(dayResult);

          // 야간 당직
          const nightAssignment = generateRandomAssignment(workers, usedWorkerIds);
          usedWorkerIds.push(nightAssignment.primary.일련번호, nightAssignment.backup.일련번호);
          
          const nightResult = await assignDuty(currentDate.toISOString().split('T')[0], '주말야간');
          if (nightResult) assignments.push(nightResult);
        }
      }

      toast.success(`주간 당직이 성공적으로 배정되었습니다. (총 ${assignments.length}건)`);
      return assignments;
    } catch (error) {
      console.error('Error in assignWeeklyDuties:', error);
      toast.error('주간 당직 배정에 실패했습니다.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const assignMonthlyDuties = async (year: number, month: number) => {
    setIsLoading(true);
    try {
      const workers = await getAvailableWorkers();
      
      if (workers.length < 4) {
        toast.error('배정 가능한 근로자가 부족합니다. 최소 4명이 필요합니다.');
        return [];
      }

      const assignments = [];
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      // 월별 근무자 순환을 위한 인덱스
      let workerIndex = 0;
      const workerAssignmentCounts: { [key: number]: number } = {};
      
      // 근무자별 배정 횟수 초기화
      workers.forEach(worker => {
        workerAssignmentCounts[worker.일련번호] = 0;
      });

      for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const dateString = currentDate.toISOString().split('T')[0];

        // 평일 (월-금) 야간 당직
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          // 가장 적게 배정된 근무자들 중에서 선택
          const sortedWorkers = [...workers].sort((a, b) => 
            workerAssignmentCounts[a.일련번호] - workerAssignmentCounts[b.일련번호]
          );
          
          const primary = sortedWorkers[0];
          const backup = sortedWorkers[1];

          const result = await supabase
            .from('duty_assignments')
            .insert({
              assignment_date: dateString,
              duty_type: '평일야간',
              primary_worker_id: primary.일련번호,
              backup_worker_id: backup.일련번호
            })
            .select()
            .single();

          if (result.data) {
            assignments.push(result.data);
            workerAssignmentCounts[primary.일련번호]++;
            workerAssignmentCounts[backup.일련번호]++;
          }
        }

        // 주말 (토, 일) 주간 및 야간 당직
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // 주간 당직
          const sortedWorkersDay = [...workers].sort((a, b) => 
            workerAssignmentCounts[a.일련번호] - workerAssignmentCounts[b.일련번호]
          );
          
          const dayPrimary = sortedWorkersDay[0];
          const dayBackup = sortedWorkersDay[1];

          const dayResult = await supabase
            .from('duty_assignments')
            .insert({
              assignment_date: dateString,
              duty_type: '주말주간',
              primary_worker_id: dayPrimary.일련번호,
              backup_worker_id: dayBackup.일련번호
            })
            .select()
            .single();

          if (dayResult.data) {
            assignments.push(dayResult.data);
            workerAssignmentCounts[dayPrimary.일련번호]++;
            workerAssignmentCounts[dayBackup.일련번호]++;
          }

          // 야간 당직
          const sortedWorkersNight = [...workers].sort((a, b) => 
            workerAssignmentCounts[a.일련번호] - workerAssignmentCounts[b.일련번호]
          );
          
          const nightPrimary = sortedWorkersNight[0];
          const nightBackup = sortedWorkersNight[1];

          const nightResult = await supabase
            .from('duty_assignments')
            .insert({
              assignment_date: dateString,
              duty_type: '주말야간',
              primary_worker_id: nightPrimary.일련번호,
              backup_worker_id: nightBackup.일련번호
            })
            .select()
            .single();

          if (nightResult.data) {
            assignments.push(nightResult.data);
            workerAssignmentCounts[nightPrimary.일련번호]++;
            workerAssignmentCounts[nightBackup.일련번호]++;
          }
        }
      }

      toast.success(`${year}년 ${month}월 당직이 성공적으로 배정되었습니다. (총 ${assignments.length}건)`);
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
      console.error('Error in getDutyAssignments:', error);
      toast.error('당직 배정 목록을 불러오는데 실패했습니다.');
      return [];
    }
  };

  return {
    isLoading,
    assignDuty,
    assignWeeklyDuties,
    assignMonthlyDuties,
    getDutyAssignments,
    getAvailableWorkers
  };
};
