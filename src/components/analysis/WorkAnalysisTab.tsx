
import React, { useState } from 'react';
import { toast } from "sonner";
import { useHandoverData } from '@/hooks/useHandoverData';
import AnalysisInput from './AnalysisInput';
import AnalysisResults from './AnalysisResults';

const WorkAnalysisTab = () => {
  const [inputContent, setInputContent] = useState('당직사령관한테 받은 지시 상황(각 시도에 있는 재난 정보 확인하여 산불대비, 근무 규정 확인)-> 업무 순찰(17시 부터 18시) -> 다음 당직자 인수인계');
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addHandoverItem, getHandoverSummary } = useHandoverData();

  const analyzeContent = () => {
    if (!inputContent.trim()) {
      toast.error("입력 내용을 작성해주세요.");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const handoverSummary = getHandoverSummary();
      
      const mockAnalysis = {
        types: ['지시사항', '순찰', '인수인계'],
        meeting: {
          datetime: "2024-06-25, 당직사령관 지시",
          reports: "각 시도 재난 정보 확인, 산불대비 상황 점검",
          abnormalities: "특이사항 없음",
          handover: "다음 당직자에게 당일 지시사항 및 순찰 결과 전달"
        },
        inspection: {
          datetime: "2024-06-25 17:00-18:00",
          content: "정기 업무 순찰 실시",
          actions: "시설 전반 점검 완료, 보안 상태 확인",
          notes: "산불대비 관련 지시사항에 따른 추가 점검 실시"
        },
        handover: {
          issues: handoverSummary.issues > 0 ? `${handoverSummary.issues}건의 미처리 사항` : "없음",
          pending: `${handoverSummary.pending}건의 대기 중인 업무`,
          notes: "산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유",
          completionRate: `${handoverSummary.completionRate}%`
        },
        handoverStats: handoverSummary
      };
      
      addHandoverItem({
        date: new Date().toISOString().split('T')[0],
        type: 'instruction',
        title: '업무 분석 결과',
        content: inputContent,
        worker: '시스템 분석',
        status: 'completed',
        priority: 'medium'
      });
      
      setAnalyzedData(mockAnalysis);
      setIsAnalyzing(false);
      toast.success("분석이 완료되었습니다. 인수인계 현황이 업데이트되었습니다.");
    }, 2000);
  };

  const clearData = () => {
    setInputContent('');
    setAnalyzedData(null);
    toast.info("입력 내용이 초기화되었습니다.");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <AnalysisInput
        inputContent={inputContent}
        setInputContent={setInputContent}
        isAnalyzing={isAnalyzing}
        onAnalyze={analyzeContent}
        onClear={clearData}
      />
      <AnalysisResults analyzedData={analyzedData} />
    </div>
  );
};

export default WorkAnalysisTab;
