
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Clock, RefreshCw, CalendarDays } from "lucide-react";
import { useDutyAssignment } from '@/hooks/useDutyAssignment';
import { DutyAssignmentWithWorkers } from '@/types/duty';

const DutyAssignment = () => {
  const [assignments, setAssignments] = useState<DutyAssignmentWithWorkers[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { isLoading, assignMonthlyDuties, getDutyAssignments } = useDutyAssignment();

  const loadAssignments = async () => {
    try {
      const data = await getDutyAssignments();
      // 타입 안전성을 위한 체크
      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        console.error('Unexpected data format:', data);
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleMonthlyAssignment = async () => {
    const results = await assignMonthlyDuties(selectedYear, selectedMonth);
    if (results.length > 0) {
      loadAssignments();
    }
  };

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
      {/* 월단위 당직 배정 */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            월단위 당직 배정
          </CardTitle>
          <CardDescription className="text-orange-100">
            한 달 전체의 당직을 균등하게 자동 배정합니다 (근무자별 배정 횟수 최적화)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">년도</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">월</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleMonthlyAssignment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    배정 중...
                  </>
                ) : (
                  '월단위 당직 배정'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 당직 배정 현황 */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            당직 배정 현황
          </CardTitle>
          <CardDescription className="text-purple-100">
            현재 배정된 당직 목록을 확인할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              총 {assignments.length}건의 당직이 배정되었습니다
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadAssignments}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              새로고침
            </Button>
          </div>
          
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>배정된 당직이 없습니다</p>
                </div>
              ) : (
                assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getDutyTypeColor(assignment.duty_type)}>
                          {assignment.duty_type}
                        </Badge>
                        <span className="font-medium">
                          {new Date(assignment.assignment_date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-blue-600">주당직자</div>
                        <div className="text-sm">
                          <div className="font-medium">{assignment.primary_worker?.이름 || '정보 없음'}</div>
                          <div className="text-muted-foreground">
                            {assignment.primary_worker?.소속부서} · {assignment.primary_worker?.직급}
                          </div>
                          <div className="text-muted-foreground">
                            {assignment.primary_worker?.전화번호}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-green-600">예비당직자</div>
                        <div className="text-sm">
                          <div className="font-medium">{assignment.backup_worker?.이름 || '정보 없음'}</div>
                          <div className="text-muted-foreground">
                            {assignment.backup_worker?.소속부서} · {assignment.backup_worker?.직급}
                          </div>
                          <div className="text-muted-foreground">
                            {assignment.backup_worker?.전화번호}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DutyAssignment;
