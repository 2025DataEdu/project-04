
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, AlertTriangle, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface DutyReportData {
  date: string;
  types: string[];
  meeting: {
    datetime: string;
    reports: string;
    abnormalities: string;
    handover: string;
  };
  inspection: {
    datetime: string;
    content: string;
    actions: string;
    notes: string;
  };
  handover: {
    issues: string;
    pending: string;
    notes: string;
    completionRate: string;
  };
}

const DutyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Mock data - 실제로는 분석 결과를 저장/불러오는 로직이 필요
  const [reportData] = useState<DutyReportData>({
    date: "2024-06-25",
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
      issues: "없음",
      pending: "2건의 대기 중인 업무",
      notes: "산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유",
      completionRate: "85%"
    }
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedMonth + '-01');
    currentDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setSelectedMonth(currentDate.toISOString().slice(0, 7));
  };

  const generateDatesForMonth = (month: string) => {
    const year = parseInt(month.split('-')[0]);
    const monthNum = parseInt(month.split('-')[1]);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return `${month}-${day}`;
    });
  };

  const monthDates = generateDatesForMonth(selectedMonth);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              당직 보고서
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-white/20 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-semibold min-w-[120px] text-center">
                {selectedMonth}
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-white/20 rounded"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </CardTitle>
          <CardDescription className="text-purple-100">
            업무 분석 결과를 기반으로 생성된 당직 보고서
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthDates.map(date => (
                  <SelectItem key={date} value={date}>
                    {new Date(date).toLocaleDateString('ko-KR', { 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reportData && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* 보고서 요약 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    보고서 요약
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">업무 분류</h4>
                      <div className="flex flex-wrap gap-2">
                        {reportData.types.map((type, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">인수인계 현황</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>완료율:</strong> <Badge variant="outline">{reportData.handover.completionRate}</Badge></div>
                        <div><strong>대기 업무:</strong> {reportData.handover.pending}</div>
                        <div><strong>주요 이슈:</strong> {reportData.handover.issues}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 상세 보고서 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    상세 내용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {/* 지시사항 */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          지시사항/상황 요약
                        </h4>
                        <div className="bg-orange-50 p-3 rounded-lg space-y-1 text-sm">
                          <div><strong>지시 일시:</strong> {reportData.meeting.datetime}</div>
                          <div><strong>주요 지시사항:</strong> {reportData.meeting.reports}</div>
                          <div><strong>이상 유무:</strong> {reportData.meeting.abnormalities}</div>
                          <div><strong>후속 조치:</strong> {reportData.meeting.handover}</div>
                        </div>
                      </div>

                      {/* 순찰 보고 */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          순찰/점검 보고
                        </h4>
                        <div className="bg-green-50 p-3 rounded-lg space-y-1 text-sm">
                          <div><strong>순찰 시간:</strong> {reportData.inspection.datetime}</div>
                          <div><strong>순찰 내용:</strong> {reportData.inspection.content}</div>
                          <div><strong>점검 결과:</strong> {reportData.inspection.actions}</div>
                          <div><strong>특이사항:</strong> {reportData.inspection.notes}</div>
                        </div>
                      </div>

                      {/* 인수인계 */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          인수인계 사항
                        </h4>
                        <div className="bg-purple-50 p-3 rounded-lg space-y-1 text-sm">
                          <div><strong>주요 이슈:</strong> {reportData.handover.issues}</div>
                          <div><strong>미해결 과제:</strong> {reportData.handover.pending}</div>
                          <div><strong>다음 근무자 유의사항:</strong> {reportData.handover.notes}</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 월별 보고서 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 보고서 목록</CardTitle>
          <CardDescription>{selectedMonth}의 당직 보고서 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {monthDates.map(date => {
              const hasReport = date === reportData.date; // 실제로는 해당 날짜에 보고서가 있는지 확인
              const isSelected = date === selectedDate;
              
              return (
                <Button
                  key={date}
                  variant={isSelected ? "default" : hasReport ? "outline" : "ghost"}
                  size="sm"
                  className={`h-16 flex flex-col ${hasReport ? 'border-green-300 bg-green-50 hover:bg-green-100' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-xs">{new Date(date).getDate()}</span>
                  {hasReport && <span className="text-xs text-green-600">●</span>}
                </Button>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              보고서 작성 완료
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DutyReport;
