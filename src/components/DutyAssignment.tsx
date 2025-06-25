
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { useDutyAssignment } from '@/hooks/useDutyAssignment';
import DutyCalendar from './DutyCalendar';

const DutyAssignment = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { isLoading, assignMonthlyDuties } = useDutyAssignment();

  const handleMonthlyAssignment = async () => {
    const results = await assignMonthlyDuties(selectedYear, selectedMonth);
    if (results.length > 0) {
      // Calendar will auto-refresh through its useEffect
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

      {/* 당직 배정 달력 */}
      <DutyCalendar />
    </div>
  );
};

export default DutyAssignment;
