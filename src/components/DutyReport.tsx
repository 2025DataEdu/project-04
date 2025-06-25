
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, AlertTriangle, Shield, Clock, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useDutyReports } from '@/hooks/useDutyReports';
import { DutyReportWithWorker } from '@/types/dutyReport';

const DutyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [currentReport, setCurrentReport] = useState<DutyReportWithWorker | null>(null);

  const { isLoading, reports, fetchDutyReports, getDutyReportByDate } = useDutyReports();

  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    fetchDutyReports(year, month);
  }, [selectedMonth]);

  useEffect(() => {
    const loadReportForDate = async () => {
      const report = await getDutyReportByDate(selectedDate);
      setCurrentReport(report);
    };
    loadReportForDate();
  }, [selectedDate]);

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
  const reportsMap = new Map(reports.map(report => [report.report_date, report]));

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
            실제 당직 배정 데이터를 기반으로 생성된 당직 보고서
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
            </div>
          ) : currentReport ? (
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
                      <h4 className="font-semibold text-sm mb-2">당직자 정보</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{currentReport.worker_name}</span>
                        <Badge variant="outline" className="bg-blue-50 border-blue-200">
                          {currentReport.worker_department}
                        </Badge>
                      </div>
                      {currentReport.assignment && (
                        <div className="text-sm text-muted-foreground">
                          <span>당직 유형: </span>
                          <Badge variant="secondary">{currentReport.assignment.duty_type}</Badge>
                          <span className="ml-2">예비: {currentReport.assignment.backup_worker_name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">업무 분류</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentReport.report_types?.map((type, index) => (
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
                        <div><strong>완료율:</strong> <Badge variant="outline">{currentReport.handover_completion_rate}%</Badge></div>
                        <div><strong>대기 업무:</strong> {currentReport.handover_pending}</div>
                        <div><strong>주요 이슈:</strong> {currentReport.handover_issues}</div>
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
                          <div><strong>지시 일시:</strong> {currentReport.instruction_datetime}</div>
                          <div><strong>주요 지시사항:</strong> {currentReport.instruction_content}</div>
                          <div><strong>이상 유무:</strong> {currentReport.instruction_abnormalities}</div>
                          <div><strong>후속 조치:</strong> {currentReport.instruction_handover}</div>
                        </div>
                      </div>

                      {/* 순찰 보고 */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          순찰/점검 보고
                        </h4>
                        <div className="bg-green-50 p-3 rounded-lg space-y-1 text-sm">
                          <div><strong>순찰 시간:</strong> {currentReport.patrol_datetime}</div>
                          <div><strong>순찰 내용:</strong> {currentReport.patrol_content}</div>
                          <div><strong>점검 결과:</strong> {currentReport.patrol_actions}</div>
                          <div><strong>특이사항:</strong> {currentReport.patrol_notes}</div>
                        </div>
                      </div>

                      {/* 인수인계 */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          인수인계 사항
                        </h4>
                        <div className="bg-purple-50 p-3 rounded-lg space-y-1 text-sm">
                          <div><strong>주요 이슈:</strong> {currentReport.handover_issues}</div>
                          <div><strong>미해결 과제:</strong> {currentReport.handover_pending}</div>
                          <div><strong>다음 근무자 유의사항:</strong> {currentReport.handover_notes}</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              선택한 날짜에 대한 당직 보고서가 없습니다.
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
              const hasReport = reportsMap.has(date);
              const isSelected = date === selectedDate;
              const reportData = reportsMap.get(date);
              
              return (
                <Button
                  key={date}
                  variant={isSelected ? "default" : hasReport ? "outline" : "ghost"}
                  size="sm"
                  className={`h-16 flex flex-col ${hasReport ? 'border-green-300 bg-green-50 hover:bg-green-100' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-xs">{new Date(date).getDate()}</span>
                  {hasReport && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-green-600">●</span>
                      <span className="text-xs text-green-600 truncate w-full">
                        {reportData?.worker_name}
                      </span>
                    </div>
                  )}
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
