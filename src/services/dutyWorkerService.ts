
import { supabase } from '@/integrations/supabase/client';

export const dutyWorkerService = {
  async getDutyWorkerByDate(date: string) {
    try {
      const { data: dutyReport } = await supabase
        .from('duty_reports')
        .select('duty_worker_id')
        .eq('report_date', date)
        .single();

      if (!dutyReport || !dutyReport.duty_worker_id) {
        return null;
      }

      const { data: worker } = await supabase
        .from('worker_list')
        .select('이름')
        .eq('일련번호', dutyReport.duty_worker_id)
        .single();

      return {
        duty_worker_id: dutyReport.duty_worker_id,
        worker_name: worker?.이름 || null
      };
    } catch (error) {
      console.error('Error fetching duty worker:', error);
      return null;
    }
  }
};
