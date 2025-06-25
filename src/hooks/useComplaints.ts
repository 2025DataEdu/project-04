
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Complaint, ComplaintSolution, ComplaintStats } from '@/types/complaint';
import { toast } from 'sonner';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [solutions, setSolutions] = useState<ComplaintSolution[]>([]);
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('민원 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('complaint_solutions')
        .select('*')
        .order('priority_score', { ascending: false });

      if (error) throw error;
      setSolutions(data || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const calculateStats = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*');

      if (error) throw error;

      const total = data.length;
      const resolved = data.filter(c => c.status === '해결').length;
      const pending = data.filter(c => c.status === '접수' || c.status === '처리중').length;

      const categories: Record<string, number> = {};
      data.forEach(complaint => {
        categories[complaint.category] = (categories[complaint.category] || 0) + 1;
      });

      // 월별 데이터 계산
      const monthlyData = calculateMonthlyData(data);

      setStats({
        total,
        resolved,
        pending,
        categories,
        monthlyData
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const calculateMonthlyData = (data: Complaint[]) => {
    const monthlyMap: Record<string, { count: number; resolved: number }> = {};

    data.forEach(complaint => {
      const month = new Date(complaint.created_at).toISOString().slice(0, 7);
      if (!monthlyMap[month]) {
        monthlyMap[month] = { count: 0, resolved: 0 };
      }
      monthlyMap[month].count++;
      if (complaint.status === '해결') {
        monthlyMap[month].resolved++;
      }
    });

    return Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // 최근 12개월
  };

  const createComplaint = async (complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert(complaintData)
        .select()
        .single();

      if (error) throw error;

      toast.success('민원이 성공적으로 등록되었습니다.');
      await fetchComplaints();
      return data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast.error('민원 등록에 실패했습니다.');
      return null;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success('민원이 성공적으로 업데이트되었습니다.');
      await fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('민원 업데이트에 실패했습니다.');
    }
  };

  const findRecommendedSolutions = (complaintContent: string, category: string) => {
    return solutions
      .filter(solution => 
        solution.category === category ||
        solution.keywords.some(keyword => 
          complaintContent.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, 3);
  };

  useEffect(() => {
    fetchComplaints();
    fetchSolutions();
  }, []);

  useEffect(() => {
    if (complaints.length > 0) {
      calculateStats();
    }
  }, [complaints]);

  return {
    complaints,
    solutions,
    stats,
    isLoading,
    fetchComplaints,
    createComplaint,
    updateComplaint,
    findRecommendedSolutions
  };
};
