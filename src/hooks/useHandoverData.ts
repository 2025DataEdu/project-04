
import { useState, useEffect } from 'react';
import { useDutyAssignment } from './useDutyAssignment';

export interface HandoverItem {
  id: string;
  date: string;
  type: 'instruction' | 'patrol' | 'handover';
  title: string;
  content: string;
  worker: string;
  status: 'completed' | 'pending' | 'issues';
  priority: 'high' | 'medium' | 'low';
}

export const useHandoverData = () => {
  const [handoverItems, setHandoverItems] = useState<HandoverItem[]>([]);
  const { getDutyAssignments } = useDutyAssignment();

  // 실제 인수인계 데이터를 가져오는 함수 (현재는 모의 데이터)
  const fetchHandoverData = async () => {
    try {
      // 당직 배정 정보를 기반으로 인수인계 데이터 생성
      const assignments = await getDutyAssignments();
      
      // 모의 인수인계 데이터 생성
      const mockHandoverData: HandoverItem[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          type: 'instruction',
          title: '당직사령관 지시사항',
          content: '각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인',
          worker: '김당직',
          status: 'completed',
          priority: 'high'
        },
        {
          id: '2',
          date: new Date().toISOString().split('T')[0],
          type: 'patrol',
          title: '정기 순찰 완료',
          content: '17:00-18:00 업무 순찰 실시, 시설 전반 점검 완료',
          worker: '이순찰',
          status: 'completed',
          priority: 'medium'
        },
        {
          id: '3',
          date: new Date().toISOString().split('T')[0],
          type: 'handover',
          title: '다음 당직자 인수인계',
          content: '당일 지시사항 및 순찰 결과 전달, 산불대비 상황 지속 모니터링 필요',
          worker: '박인계',
          status: 'pending',
          priority: 'medium'
        }
      ];

      setHandoverItems(mockHandoverData);
    } catch (error) {
      console.error('Error fetching handover data:', error);
    }
  };

  const addHandoverItem = (item: Omit<HandoverItem, 'id'>) => {
    const newItem: HandoverItem = {
      ...item,
      id: Date.now().toString()
    };
    setHandoverItems(prev => [newItem, ...prev]);
  };

  const updateHandoverStatus = (id: string, status: HandoverItem['status']) => {
    setHandoverItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const getHandoverSummary = () => {
    const total = handoverItems.length;
    const completed = handoverItems.filter(item => item.status === 'completed').length;
    const pending = handoverItems.filter(item => item.status === 'pending').length;
    const issues = handoverItems.filter(item => item.status === 'issues').length;

    return {
      total,
      completed,
      pending,
      issues,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  useEffect(() => {
    fetchHandoverData();
  }, []);

  return {
    handoverItems,
    fetchHandoverData,
    addHandoverItem,
    updateHandoverStatus,
    getHandoverSummary
  };
};
