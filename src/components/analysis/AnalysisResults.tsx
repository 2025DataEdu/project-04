
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, TrendingUp, AlertTriangle, Shield, FileText } from "lucide-react";

interface AnalysisResultsProps {
  analyzedData: any;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analyzedData }) => {
  return (
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
                  {analyzedData.types.map((type: string, index: number) => (
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
  );
};

export default AnalysisResults;
