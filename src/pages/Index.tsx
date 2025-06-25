import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, FileText, Users, TrendingUp, AlertTriangle, CalendarDays, ClipboardList, Calendar, BarChart3, MessageSquareMore, PieChart } from "lucide-react";
import { toast } from "sonner";
import DutyAssignment from "@/components/DutyAssignment";
import HandoverDashboard from "@/components/HandoverDashboard";
import PenaltyDutyManagement from '@/components/PenaltyDutyManagement';
import ComplaintDashboard from '@/components/ComplaintDashboard';
import ComplaintManagement from '@/components/ComplaintManagement';
import DutyReport from '@/components/DutyReport';
import { useHandoverData } from '@/hooks/useHandoverData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('assignment');
  const [inputContent, setInputContent] = useState('당직사령관한테 받은 지시 상황(각 시도에 있는 재난 정보 확인하여 산불대비, 근무 규정 확인)-> 업무 순찰(17시 부터 18시) -> 다음 당직자 인수인계');
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { handoverItems, addHandoverItem, getHandoverSummary } = useHandoverData();

  const analyzeContent = () => {
    if (!inputContent.trim()) {
      toast.error("입력 내용을 작성해주세요.");
      return;
    }

    setIsAnalyzing(true);
    
    // 실제 인수인계 데이터와 연동하여 분석
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
      
      // 분석된 내용을 인수인계 데이터에 추가
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">당직 관리 시스템</h1>
          <p className="text-gray-600">효율적인 당직 배정과 관리를 위한 통합 시스템</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="assignment" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              당직 배정
            </TabsTrigger>
            <TabsTrigger value="handover" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              인수인계 현황
            </TabsTrigger>
            <TabsTrigger value="penalty" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              벌당직 관리
            </TabsTrigger>
            <TabsTrigger value="complaint-dashboard" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              민원 대시보드
            </TabsTrigger>
            <TabsTrigger value="complaint-management" className="flex items-center gap-2">
              <MessageSquareMore className="h-4 w-4" />
              민원 관리
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              당직 보고서
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              업무 분석
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignment">
            <DutyAssignment />
          </TabsContent>

          <TabsContent value="handover">
            <HandoverDashboard />
          </TabsContent>

          <TabsContent value="penalty">
            <PenaltyDutyManagement />
          </TabsContent>

          <TabsContent value="complaint-dashboard">
            <ComplaintDashboard />
          </TabsContent>

          <TabsContent value="complaint-management">
            <ComplaintManagement />
          </TabsContent>

          <TabsContent value="report">
            <DutyReport />
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    업무 내용 입력
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    지시사항, 순찰, 인수인계 등의 내용을 입력해주세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="예시: 
당직사령관한테 받은 지시 상황(각 시도에 있는 재난 정보 확인하여 산불대비, 근무 규정 확인)
-> 업무 순찰(17시 부터 18시)
-> 다음 당직자 인수인계"
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
                    분석 결과 (인수인계 연동)
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    AI가 분석한 구조화된 업무 정보와 인수인계 현황
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

                        {/* Commander Instructions */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            지시사항/상황 요약
                          </h3>
                          <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                            <div><strong>지시 일시 및 출처:</strong> {analyzedData.meeting.datetime}</div>
                            <div><strong>주요 지시 및 확인사항:</strong> {analyzedData.meeting.reports}</div>
                            <div><strong>이상 유무 및 특이사항:</strong> {analyzedData.meeting.abnormalities}</div>
                            <div><strong>후속 조치 및 전달사항:</strong> {analyzedData.meeting.handover}</div>
                          </div>
                        </div>

                        {/* Patrol Report */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            순찰/점검 보고
                          </h3>
                          <div className="bg-green-50 p-4 rounded-lg space-y-2">
                            <div><strong>순찰 실시 시간:</strong> {analyzedData.inspection.datetime}</div>
                            <div><strong>순찰 내용:</strong> {analyzedData.inspection.content}</div>
                            <div><strong>점검 결과 및 조치사항:</strong> {analyzedData.inspection.actions}</div>
                            <div><strong>특이사항 및 추가 조치:</strong> {analyzedData.inspection.notes}</div>
                          </div>
                        </div>

                        {/* Enhanced Handover Summary with Real Data */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                            인수인계 요약 (실시간 연동)
                          </h3>
                          <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                            <div><strong>주요 이슈:</strong> {analyzedData.handover.issues}</div>
                            <div><strong>미해결 과제:</strong> {analyzedData.handover.pending}</div>
                            <div><strong>다음 근무자 유의사항:</strong> {analyzedData.handover.notes}</div>
                            <div><strong>인수인계 완료율:</strong> 
                              <Badge variant="outline" className="ml-2">
                                {analyzedData.handover.completionRate}
                              </Badge>
                            </div>
                            <div className="mt-3 p-3 bg-white/50 rounded border">
                              <p className="text-sm text-muted-foreground mb-2">현재 인수인계 현황:</p>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>완료: {analyzedData.handoverStats.completed}건</div>
                                <div>대기: {analyzedData.handoverStats.pending}건</div>
                                <div>이슈: {analyzedData.handoverStats.issues}건</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">주요 기능</h2>
          <div className="grid md:grid-cols-5 gap-6">
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
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">스마트 배정</h3>
              <p className="text-sm text-muted-foreground">AI 기반 공정한 당직 배정으로 업무 부담 균등화</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <MessageSquareMore className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <h3 className="font-semibold mb-2">민원 관리</h3>
              <p className="text-sm text-muted-foreground">체계적인 민원 접수, 처리 및 해결방법 추천</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
