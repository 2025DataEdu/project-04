
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, AlertTriangle, Clock, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useDutyReports } from '@/hooks/useDutyReports';
import { DutyReportWithWorker } from '@/types/dutyReport';

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
  const { reports, fetchDutyReports } = useDutyReports();

  // 실제 당직 보고서 데이터를 인수인계 보고서 형태로 변환
  const convertDutyReportsToHandover = (dutyReports: DutyReportWithWorker[]): HandoverReport[] => {
    return dutyReports.map(report => {
      const reportDate = new Date(report.report_date);
      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      
      return {
        id: report.id,
        date: report.report_date,
        dayOfWeek: dayNames[reportDate.getDay()],
        dutyType: report.assignment?.duty_type || '당직',
        reportContent: {
          commanderInstructions: report.instruction_content || '지시사항 없음',
          patrolReport: report.patrol_content || '순찰 내용 없음',
          handoverSummary: report.handover_notes || '인수인계 사항 없음',
          issues: report.handover_issues || '없음',
          pendingTasks: report.handover_pending || '대기 중인 업무 없음',
          nextDutyNotes: report.instruction_handover || '전달사항 없음'
        },
        reportedBy: report.worker_name || '알 수 없음',
        department: report.worker_department || '알 수 없음',
        reportTime: report.patrol_datetime?.split(' ')[1] || '미기록'
      };
    });
  };

  // 주간 데이터 로드
  useEffect(() => {
    const loadWeekData = async () => {
      const weekDays = getWeekDays(selectedWeek);
      const startDate = weekDays[0].toISOString().split('T')[0];
      const endDate = weekDays[6].toISOString().split('T')[0];
      
      // 해당 주의 연도와 월 계산
      const year = weekDays[0].getFullYear();
      const month = weekDays[0].getMonth() + 1;
      
      const weekReports = await fetchDutyReports(year, month);
      
      // 해당 주에 해당하는 보고서만 필터링
      const filteredReports = weekReports.filter(report => {
        const reportDate = report.report_date;
        return reportDate >= startDate && reportDate <= endDate;
      });
      
      const convertedReports = convertDutyReportsToHandover(filteredReports);
      setHandoverReports(convertedReports);
    };

    loadWeekData();
  }, [selectedWeek, fetchDutyReports]);

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
              당직 인수인계 대시보드 (실시간 연동)
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
            당직 보고서 기반 실시간 인수인계 현황 - 업무 연속성을 유지하세요
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
                              당직사령관 지시사항
                            </div>
                            <div className="text-xs bg-orange-50 p-2 rounded text-gray-700 line-clamp-3">
                              {report.reportContent.commanderInstructions}
                            </div>
                          </div>
                          
                          <div className="text-xs">
                            <div className="font-medium text-purple-600 flex items-center gap-1 mb-1">
                              <FileText className="h-3 w-3" />
                              인수인계 요약
                            </div>
                            <div className="text-xs bg-purple-50 p-2 rounded text-gray-700 line-clamp-3">
                              {report.reportContent.handoverSummary}
                            </div>
                          </div>

                          <div className="text-xs">
                            <div className="font-medium text-blue-600 flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              다음 당직자 전달사항
                            </div>
                            <div className="text-xs bg-blue-50 p-2 rounded text-gray-700 line-clamp-3">
                              {report.reportContent.nextDutyNotes}
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

                          <div className="text-xs">
                            <div className="font-medium text-green-600 mb-1">미처리 업무</div>
                            <div className="text-xs bg-green-50 p-2 rounded text-gray-700">
                              {report.reportContent.pendingTasks}
                            </div>
                          </div>
                          
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
