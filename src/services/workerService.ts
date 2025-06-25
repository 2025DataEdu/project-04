
import { supabase } from '@/integrations/supabase/client';

export const workerService = {
  async getWorkers() {
    const { data: workers, error } = await supabase
      .from('worker_list')
      .select('*');

    if (error) {
      console.error('Error fetching workers:', error);
      throw new Error('근로자 목록을 불러오는데 실패했습니다.');
    }

    return workers || [];
  },

  async getWorkerById(workerId: number) {
    const { data: worker } = await supabase
      .from('worker_list')
      .select('*')
      .eq('일련번호', workerId)
      .single();

    return worker;
  }
};
