
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Clock, FileText, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [inputContent, setInputContent] = useState('');
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = () => {
    if (!inputContent.trim()) {
      toast.error("입력 내용을 작성해주세요.");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        types: ['회의', '점검', '인수인계'],
        meeting: {
          datetime: "2024-06-25 14:00, 상황실",
          reports: "정상 운영 중, 특이사항 없음",
          abnormalities: "없음",
          handover: "다음 근무자에게 정기점검 완료 상태 전달"
        },
        inspection: {
          datetime: "2024-06-25 13:30",
          content: "시설 안전점검 실시",
          actions: "전 구역 정상 확인, 보고서 작성 완료",
          notes: "CCTV 시스템 정상 작동 확인"
        },
        handover: {
          issues: "없음",
          pending: "내일 오전 정기회의 준비",
          notes: "야간 순찰 시 출입구 보안 강화 필요"
        }
      };
      
      setAnalyzedData(mockAnalysis);
      setIsAnalyzing(false);
      toast.success("분석이 완료되었습니다.");
    }, 2000);
  };

  const clearData = () => {
    setInputContent('');
    setAnalyzedData(null);
    toast.info("입력 내용이 초기화되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              공공기관 당직근무 AI 비서
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            당직근무 업무의 디지털 혁신을 통해 효율성과 신뢰성을 향상시키는 스마트 솔루션
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                업무 내용 입력
              </CardTitle>
              <CardDescription className="text-blue-100">
                회의, 점검, 상황보고, 인수인계 등의 내용을 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="예시: 
오늘 14시 상황실에서 정기회의 진행
- 전체 시설 점검 완료, 이상 없음
- CCTV 시스템 정상 작동 확인
- 다음 근무자에게 야간 순찰 시 출입구 보안 강화 당부
- 내일 오전 정기회의 준비사항 전달"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  className="min-h-[200px] resize-none border-2 focus:border-blue-500 transition-colors"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={analyzeContent}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        분석 중...
                      </>
                    ) : (
                      '내용 분석하기'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearData}
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                  >
                    초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                분석 결과
              </CardTitle>
              <CardDescription className="text-green-100">
                AI가 분석한 구조화된 업무 정보
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!analyzedData ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>업무 내용을 입력하고 분석 버튼을 클릭해주세요</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {/* Types */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">분류</Badge>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analyzedData.types.map((type, index) => (
                          <Badge key={index} variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Meeting Summary */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        회의/음성 요약
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <div><strong>일시 및 장소:</strong> {analyzedData.meeting.datetime}</div>
                        <div><strong>주요 보고 및 전달사항:</strong> {analyzedData.meeting.reports}</div>
                        <div><strong>이상 유무 및 특이사항:</strong> {analyzedData.meeting.abnormalities}</div>
                        <div><strong>담당자 인수인계 사항:</strong> {analyzedData.meeting.handover}</div>
                      </div>
                    </div>

                    {/* Inspection Report */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        점검/상황보고
                      </h3>
                      <div className="bg-green-50 p-4 rounded-lg space-y-2">
                        <div><strong>점검/상황 발생 일시:</strong> {analyzedData.inspection.datetime}</div>
                        <div><strong>점검 또는 상황 내용:</strong> {analyzedData.inspection.content}</div>
                        <div><strong>조치 및 전달사항:</strong> {analyzedData.inspection.actions}</div>
                        <div><strong>특이사항 및 추가 메모:</strong> {analyzedData.inspection.notes}</div>
                      </div>
                    </div>

                    {/* Handover Summary */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        인수인계 요약
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                        <div><strong>주요 이슈:</strong> {analyzedData.handover.issues}</div>
                        <div><strong>미해결 과제:</strong> {analyzedData.handover.pending}</div>
                        <div><strong>다음 근무자 유의사항:</strong> {analyzedData.handover.notes}</div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">주요 기능</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">자동 분류</h3>
              <p className="text-sm text-muted-foreground">업무 내용을 자동으로 유형별로 분류하여 정리</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">신뢰성 향상</h3>
              <p className="text-sm text-muted-foreground">수기 작성 오류와 누락을 방지하여 업무 신뢰성 제고</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">효율성 증대</h3>
              <p className="text-sm text-muted-foreground">구조화된 정보 관리로 업무 효율성 극대화</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
