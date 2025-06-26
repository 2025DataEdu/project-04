
import { supabase } from '@/integrations/supabase/client';
import { PenaltyDuty, PenaltyDutyWithWorker } from '@/types/penalty';

export const penaltyDutyService = {
  async createPenaltyDuty(penaltyData: {
    worker_id: number;
    violation_date: string;
    violation_type: string;
    violation_details: string;
    reported_by: string;
  }) {
    const { data, error } = await supabase
      .from('penalty_duties')
      .insert(penaltyData)
      .select()
      .single();

    if (error) {
      console.error('Error creating penalty duty:', error);
      throw new Error('벌당직 등록에 실패했습니다.');
    }

    return data;
  },

  async getPenaltyDuties(): Promise<PenaltyDuty[]> {
    const { data: penalties, error } = await supabase
      .from('penalty_duties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching penalty duties:', error);
      throw new Error('벌당직 목록을 불러오는데 실패했습니다.');
    }

    // Cast penalty_status to the correct union type
    return (penalties || []).map(penalty => ({
      ...penalty,
      penalty_status: penalty.penalty_status as '대기' | '완료' | '취소'
    }));
  },

  async updatePenaltyStatus(id: string, status: '대기' | '완료' | '취소', penalty_assigned_date?: string) {
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
      throw new Error('벌당직 상태 업데이트에 실패했습니다.');
    }

    return true;
  },

  async getDutyWorkerByDate(date: string) {
    try {
      // 해당 날짜의 당직 배정 정보를 가져옵니다
      const { data: assignments, error: assignmentError } = await supabase
        .from('duty_assignments')
        .select('primary_worker_id, backup_worker_id')
        .eq('assignment_date', date);

      if (assignmentError) {
        console.error('Error fetching duty assignments:', assignmentError);
        return null;
      }

      if (!assignments || assignments.length === 0) {
        console.log('No duty assignment found for date:', date);
        return null;
      }

      // 주 당직자의 정보를 가져옵니다
      const assignment = assignments[0];
      const { data: worker, error: workerError } = await supabase
        .from('worker_list')
        .select('이름')
        .eq('일련번호', assignment.primary_worker_id)
        .single();

      if (workerError || !worker) {
        console.error('Error fetching worker info:', workerError);
        return null;
      }

      return {
        worker_name: worker.이름
      };
    } catch (error) {
      console.error('Error in getDutyWorkerByDate:', error);
      return null;
    }
  }
};
