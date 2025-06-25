
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { useDutyAssignment } from '@/hooks/useDutyAssignment';
import { DutyAssignmentWithWorkers } from '@/types/duty';

const DutyCalendar = () => {
  const [assignments, setAssignments] = useState<DutyAssignmentWithWorkers[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getDutyAssignments } = useDutyAssignment();

  const loadAssignments = async (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    try {
      const data = await getDutyAssignments(startDate, endDate);
      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    }
  };

  useEffect(() => {
    loadAssignments(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAssignmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return assignments.filter(assignment => assignment.assignment_date === dateString);
  };

  const getDutyTypeColor = (dutyType: string) => {
    switch (dutyType) {
      case '평일야간': return 'bg-blue-100 text-blue-700';
      case '주말주간': return 'bg-green-100 text-green-700';
      case '주말야간': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              당직 배정 달력
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-white/20 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-semibold min-w-[120px] text-center">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-white/20 rounded"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center font-medium text-sm ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border border-gray-200 rounded-lg p-1 ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      day.getDay() === 0 ? 'text-red-600' : 
                      day.getDay() === 6 ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getAssignmentsForDate(day).map((assignment) => (
                        <Tooltip key={assignment.id}>
                          <TooltipTrigger asChild>
                            <div className="cursor-pointer">
                              <Badge 
                                className={`text-xs px-1 py-0.5 w-full justify-center ${getDutyTypeColor(assignment.duty_type)}`}
                              >
                                {assignment.duty_type}
                              </Badge>
                              <div className="text-xs mt-1 space-y-0.5">
                                <div className="font-medium text-blue-600 truncate">
                                  {assignment.primary_worker?.소속부서}
                                </div>
                                <div className="truncate">
                                  주: {assignment.primary_worker?.이름}
                                </div>
                                <div className="truncate">
                                  예: {assignment.backup_worker?.이름}
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-2">
                              <div className="font-semibold text-center">
                                {assignment.duty_type} 당직
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-blue-600">주당직자</div>
                                <div className="text-sm">
                                  <div className="font-medium">{assignment.primary_worker?.이름}</div>
                                  <div className="text-muted-foreground">
                                    {assignment.primary_worker?.소속부서} · {assignment.primary_worker?.직급}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {assignment.primary_worker?.전화번호}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {assignment.primary_worker?.메일주소}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-green-600">예비당직자</div>
                                <div className="text-sm">
                                  <div className="font-medium">{assignment.backup_worker?.이름}</div>
                                  <div className="text-muted-foreground">
                                    {assignment.backup_worker?.소속부서} · {assignment.backup_worker?.직급}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {assignment.backup_worker?.전화번호}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {assignment.backup_worker?.메일주소}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DutyCalendar;
