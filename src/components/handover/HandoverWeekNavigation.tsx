
import React from 'react';
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HandoverWeekNavigationProps {
  selectedWeek: Date;
  weekDays: Date[];
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export const HandoverWeekNavigation: React.FC<HandoverWeekNavigationProps> = ({
  selectedWeek,
  weekDays,
  onNavigateWeek
}) => {
  return (
    <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          당직 인수인계 대시보드 (실시간 연동)
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateWeek('prev')}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold min-w-[200px] text-center">
            {selectedWeek.getFullYear()}년 {selectedWeek.getMonth() + 1}월 {weekDays[0].getDate()}일 ~ {weekDays[6].getDate()}일
          </span>
          <button
            onClick={() => onNavigateWeek('next')}
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
  );
};
