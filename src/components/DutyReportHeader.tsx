import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
interface DutyReportHeaderProps {
  selectedMonth: string;
  selectedDate: string;
  monthDates: string[];
  onMonthNavigate: (direction: 'prev' | 'next') => void;
  onDateChange: (date: string) => void;
}
export const DutyReportHeader: React.FC<DutyReportHeaderProps> = ({
  selectedMonth,
  selectedDate,
  monthDates,
  onMonthNavigate,
  onDateChange
}) => {
  return <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            당직 보고서
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onMonthNavigate('prev')} className="p-1 hover:bg-white/20 rounded">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-semibold min-w-[120px] text-center">
              {selectedMonth}
            </span>
            <button onClick={() => onMonthNavigate('next')} className="p-1 hover:bg-white/20 rounded">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </CardTitle>
        <CardDescription className="text-purple-100">
          실제 당직 배정 데이터를 기반으로 생성된 당직 보고서
        </CardDescription>
      </CardHeader>
      
    </Card>;
};