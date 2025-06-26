
import { useState } from 'react';
import { toast } from 'sonner';
import { PenaltyDutyWithWorker } from '@/types/penalty';
import { penaltyDutyService } from '@/services/penaltyDutyService';
import { workerService } from '@/services/workerService';
import { penaltyEmailService } from '@/services/penaltyEmailService';
import { penaltyDataUtils } from '@/utils/penaltyDataUtils';

export const usePenaltyDuty = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getDutyWorkerByDate = async (date: string) => {
    return penaltyDutyService.getDutyWorkerByDate(date);
  };

  const createPenaltyDuty = async (penaltyData: {
    worker_id: number;
    violation_date: string;
    violation_type: string;
    violation_details: string;
    reported_by?: string;
  }) => {
    setIsLoading(true);
    try {
      // 해당 위반일자의 당직자를 찾아서 지적자로 설정
      let reportedBy = penaltyData.reported_by || '';
      
      if (!reportedBy) {
        console.log('Finding duty worker for date:', penaltyData.violation_date);
        const dutyWorker = await getDutyWorkerByDate(penaltyData.violation_date);
        if (dutyWorker && dutyWorker.worker_name) {
          reportedBy = dutyWorker.worker_name;
          console.log('Found duty worker:', reportedBy);
        } else {
          console.log('No duty worker found for date:', penaltyData.violation_date);
        }
      }

      const finalPenaltyData = {
        ...penaltyData,
        reported_by: reportedBy || '알 수 없음'
      };

      console.log('Creating penalty duty with data:', finalPenaltyData);
      const result = await penaltyDutyService.createPenaltyDuty(finalPenaltyData);

      // 이메일 통보 기능 호출
      await penaltyEmailService.sendPenaltyNotificationEmail(penaltyData.worker_id, {
        violation_type: penaltyData.violation_type,
        violation_details: penaltyData.violation_details,
        violation_date: penaltyData.violation_date,
        reported_by: finalPenaltyData.reported_by
      });

      toast.success('벌당직이 등록되었고 이메일 통보가 발송되었습니다.');
      return result;
    } catch (error) {
      console.error('Error in createPenaltyDuty:', error);
      toast.error('벌당직 등록에 실패했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPenaltyDuties = async (): Promise<PenaltyDutyWithWorker[]> => {
    try {
      const [penalties, workers] = await Promise.all([
        penaltyDutyService.getPenaltyDuties(),
        workerService.getWorkers()
      ]);

      return penaltyDataUtils.combinePenaltiesWithWorkers(penalties, workers);
    } catch (error) {
      console.error('Error in getPenaltyDuties:', error);
      toast.error('벌당직 목록을 불러오는데 실패했습니다.');
      return [];
    }
  };

  const updatePenaltyStatus = async (id: string, status: '대기' | '완료' | '취소', penalty_assigned_date?: string) => {
    setIsLoading(true);
    try {
      await penaltyDutyService.updatePenaltyStatus(id, status, penalty_assigned_date);
      toast.success('벌당직 상태가 업데이트되었습니다.');
      return true;
    } catch (error) {
      console.error('Error in updatePenaltyStatus:', error);
      toast.error('벌당직 상태 업데이트에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createPenaltyDuty,
    getPenaltyDuties,
    updatePenaltyStatus,
    getDutyWorkerByDate
  };
};
