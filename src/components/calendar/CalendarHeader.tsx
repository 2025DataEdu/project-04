
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onNavigateMonth
}) => {
  return (
    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          당직 배정 달력
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateMonth('prev')}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold min-w-[120px] text-center">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </span>
          <button
            onClick={() => onNavigateMonth('next')}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
