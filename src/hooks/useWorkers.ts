
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Worker } from '@/types/duty';
import { toast } from 'sonner';

export const useWorkers = () => {
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

  return {
    isLoading,
    getAvailableWorkers
  };
};
