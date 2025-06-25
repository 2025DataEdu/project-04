
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PenaltyDuty, PenaltyDutyWithWorker } from '@/types/penalty';
import { toast } from 'sonner';

export const usePenaltyDuty = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPenaltyDuty = async (penaltyData: {
    worker_id: number;
    violation_date: string;
    violation_type: string;
    violation_details: string;
    reported_by: string;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('penalty_duties')
        .insert(penaltyData)
        .select()
        .single();

      if (error) {
        console.error('Error creating penalty duty:', error);
        toast.error('벌당직 등록에 실패했습니다.');
        return null;
      }

      // 이메일 통보 기능 호출
      await sendPenaltyNotificationEmail(penaltyData.worker_id, {
        violation_type: penaltyData.violation_type,
        violation_details: penaltyData.violation_details,
        violation_date: penaltyData.violation_date,
        reported_by: penaltyData.reported_by
      });

      toast.success('벌당직이 등록되었고 이메일 통보가 발송되었습니다.');
      return data;
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
      const { data: penalties, error: penaltyError } = await supabase
        .from('penalty_duties')
        .select('*')
        .order('created_at', { ascending: false });

      if (penaltyError) {
        console.error('Error fetching penalty duties:', penaltyError);
        toast.error('벌당직 목록을 불러오는데 실패했습니다.');
        return [];
      }

      if (!penalties || penalties.length === 0) {
        return [];
      }

      const { data: workers, error: workersError } = await supabase
        .from('worker_list')
        .select('*');

      if (workersError) {
        console.error('Error fetching workers:', workersError);
        toast.error('근로자 목록을 불러오는데 실패했습니다.');
        return [];
      }

      const penaltiesWithWorkers: PenaltyDutyWithWorker[] = penalties.map(penalty => {
        const worker = workers?.find(w => w.일련번호 === penalty.worker_id);
        return {
          ...penalty,
          penalty_status: penalty.penalty_status as '대기' | '완료' | '취소',
          worker: worker ? {
            이름: worker.이름 || '',
            소속부서: worker.소속부서 || '',
            직급: worker.직급 || '',
            메일주소: worker.메일주소 || '',
            전화번호: worker.전화번호 || ''
          } : {
            이름: '',
            소속부서: '',
            직급: '',
            메일주소: '',
            전화번호: ''
          }
        };
      });

      return penaltiesWithWorkers;
    } catch (error) {
      console.error('Error in getPenaltyDuties:', error);
      toast.error('벌당직 목록을 불러오는데 실패했습니다.');
      return [];
    }
  };

  const updatePenaltyStatus = async (id: string, status: '대기' | '완료' | '취소', penalty_assigned_date?: string) => {
    setIsLoading(true);
    try {
      const updateData: any = {
        penalty_status: status,
        updated_at: new Date().toISOString()
      };

      if (penalty_assigned_date) {
        updateData.penalty_assigned_date = penalty_assigned_date;
      }

      const { error } = await supabase
        .from('penalty_duties')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating penalty status:', error);
        toast.error('벌당직 상태 업데이트에 실패했습니다.');
        return false;
      }

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

  const sendPenaltyNotificationEmail = async (workerId: number, penaltyInfo: {
    violation_type: string;
    violation_details: string;
    violation_date: string;
    reported_by: string;
  }) => {
    try {
      const { data: worker } = await supabase
        .from('worker_list')
        .select('*')
        .eq('일련번호', workerId)
        .single();

      if (!worker || !worker.메일주소) {
        console.error('Worker email not found');
        return;
      }

      const response = await supabase.functions.invoke('send-penalty-notification', {
        body: {
          workerEmail: worker.메일주소,
          workerName: worker.이름,
          penaltyInfo
        }
      });

      if (response.error) {
        console.error('Error sending email:', response.error);
      }
    } catch (error) {
      console.error('Error in sendPenaltyNotificationEmail:', error);
    }
  };

  return {
    isLoading,
    createPenaltyDuty,
    getPenaltyDuties,
    updatePenaltyStatus
  };
};
