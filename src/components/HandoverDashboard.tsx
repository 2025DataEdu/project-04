
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, AlertTriangle, Clock, ChevronLeft, ChevronRight, Users } from "lucide-react";

interface HandoverReport {
  id: string;
  date: string;
  dayOfWeek: string;
  dutyType: string;
  reportContent: {
    commanderInstructions: string;
    patrolReport: string;
    handoverSummary: string;
    issues: string;
    pendingTasks: string;
    nextDutyNotes: string;
  };
  reportedBy: string;
  department: string;
  reportTime: string;
}

const HandoverDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [handoverReports, setHandoverReports] = useState<HandoverReport[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockReports: HandoverReport[] = [
      {
        id: '1',
        date: '2024-06-24',
        dayOfWeek: '월요일',
        dutyType: '평일야간',
        reportContent: {
          commanderInstructions: '당직사령관 지시: 각 시도 재난 정보 확인, 산불대비 상황 점검',
          patrolReport: '17:00-18:00 정기 순찰 완료, 시설 전반 점검 이상 없음',
          handoverSummary: '산불대비 관련 지시사항 이행 완료, 재난 정보 확인 결과 공유 필요',
          issues: '특이사항 없음',
          pendingTasks: '화요일 당직자에게 산불대비 상황 지속 모니터링 요청',
          nextDutyNotes: '재난정보시스템 정기 확인 필요, 비상연락망 점검'
        },
        reportedBy: '김당직',
        department: '총무과',
        reportTime: '06:30'
      },
      {
        id: '2',
        date: '2024-06-25',
        dayOfWeek: '화요일',
        dutyType: '평일야간',
        reportContent: {
          commanderInstructions: '전일 산불대비 상황 지속 모니터링, 기상특보 대응 준비',
          patrolReport: '17:00-18:00 정기 순찰, 기상특보 대응 시설 점검 완료',
          handoverSummary: '기상특보 발령으로 인한 비상대응체계 가동, 관련 부서 연락 완료',
          issues: '기상특보 발령 (강풍주의보)',
          pendingTasks: '수요일 당직자에게 기상상황 지속 모니터링 요청',
          nextDutyNotes: '기상청 특보 현황 수시 확인, 비상연락체계 유지'
        },
        reportedBy: '이당직',
        department: '안전관리과',
        reportTime: '06:45'
      },
      {
        id: '3',
        date: '2024-06-26',
        dayOfWeek: '수요일',
        dutyType: '평일야간',
        reportContent: {
          commanderInstructions: '기상특보 해제 확인, 일반 당직업무 복귀',
          patrolReport: '17:00-18:00 정기 순찰, 기상특보 해제로 정상 운영',
          handoverSummary: '기상특보 해제 확인, 정상 당직업무로 복귀',
          issues: '없음',
          pendingTasks: '목요일 정상 당직업무 인계',
          nextDutyNotes: '정상 당직업무 수행'
        },
        reportedBy: '박당직',
        department: '기획조정실',
        reportTime: '06:20'
      }
    ];
    setHandoverReports(mockReports);
  }, []);

  const getWeekDays = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + (direction === 'prev' ? -7 : 7));
    setSelectedWeek(newDate);
  };

  const getReportForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return handoverReports.find(report => report.date === dateString);
  };

  const weekDays = getWeekDays(selectedWeek);
  const weekDayNames = ['월', '화', '수', '목', '금', '토', '일'];

  const getDutyTypeColor = (dutyType: string) => {
    switch (dutyType) {
      case '평일야간': return 'bg-blue-100 text-blue-700';
      case '주말주간': return 'bg-green-100 text-green-700';
      case '주말야간': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              당직 인수인계 대시보드
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1 hover:bg-white/20 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {selectedWeek.getFullYear()}년 {selectedWeek.getMonth() + 1}월 {weekDays[0].getDate()}일 ~ {weekDays[6].getDate()}일
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-1 hover:bg-white/20 rounded"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </CardTitle>
          <CardDescription className="text-emerald-100">
            주간별 당직 인수인계 사항을 확인하고 업무 연속성을 유지하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const report = getReportForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <Card 
                  key={index}
                  className={`min-h-[300px] ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-3">
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        index === 0 ? 'text-red-600' : 
                        index === 6 ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {weekDayNames[index]}
                      </div>
                      <div className={`text-lg font-bold ${
                        index === 0 ? 'text-red-600' : 
                        index === 6 ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {report ? (
                      <div className="space-y-3">
                        <div className="text-center">
                          <Badge className={`text-xs ${getDutyTypeColor(report.dutyType)}`}>
                            {report.dutyType}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs">
                            <div className="font-medium text-gray-600 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              담당자
                            </div>
                            <div className="text-sm">{report.reportedBy}</div>
                            <div className="text-xs text-muted-foreground">{report.department}</div>
                          </div>
                          
                          <Separator />
                          
                          <div className="text-xs">
                            <div className="font-medium text-orange-600 flex items-center gap-1 mb-1">
                              <AlertTriangle className="h-3 w-3" />
                              주요 지시사항
                            </div>
                            <div className="text-xs bg-orange-50 p-2 rounded text-gray-700 line-clamp-3">
                              {report.reportContent.commanderInstructions}
                            </div>
                          </div>
                          
                          <div className="text-xs">
                            <div className="font-medium text-green-600 flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              순찰 보고
                            </div>
                            <div className="text-xs bg-green-50 p-2 rounded text-gray-700 line-clamp-2">
                              {report.reportContent.patrolReport}
                            </div>
                          </div>
                          
                          <div className="text-xs">
                            <div className="font-medium text-purple-600 flex items-center gap-1 mb-1">
                              <FileText className="h-3 w-3" />
                              인수인계 사항
                            </div>
                            <div className="text-xs bg-purple-50 p-2 rounded text-gray-700 line-clamp-3">
                              {report.reportContent.handoverSummary}
                            </div>
                          </div>
                          
                          {(report.reportContent.issues !== '없음' && report.reportContent.issues !== '특이사항 없음') && (
                            <div className="text-xs">
                              <div className="font-medium text-red-600 mb-1">특이사항</div>
                              <div className="text-xs bg-red-50 p-2 rounded text-gray-700">
                                {report.reportContent.issues}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-center text-muted-foreground mt-2">
                            보고시간: {report.reportTime}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <div className="text-xs">당직 보고서 없음</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandoverDashboard;
