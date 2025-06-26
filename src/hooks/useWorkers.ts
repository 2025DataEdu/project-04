
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Worker } from '@/types/duty';
import { toast } from 'sonner';

export const useWorkers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getAvailableWorkers = async (): Promise<Worker[]> => {
    setIsLoading(true);
    try {
      console.log('Fetching available workers...');
      
      const { data, error } = await supabase
        .from('worker_list')
        .select('*')
        .neq('제외여부', 'Y')
        .order('일련번호', { ascending: true });

      if (error) {
        console.error('Error fetching workers:', error);
        toast.error(`근로자 목록을 불러오는데 실패했습니다: ${error.message}`);
        return [];
      }

      if (!data || data.length === 0) {
        console.warn('No available workers found');
        toast.warning('배정 가능한 근로자가 없습니다.');
        return [];
      }

      console.log(`Found ${data.length} available workers:`, data.map(w => `${w.이름}(${w.일련번호})`));
      return data;
    } catch (error) {
      console.error('Unexpected error fetching workers:', error);
      toast.error('근로자 목록을 불러오는 중 예상치 못한 오류가 발생했습니다.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getAvailableWorkers
  };
};
