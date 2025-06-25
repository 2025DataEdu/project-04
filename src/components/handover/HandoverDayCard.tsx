
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Clock, Users } from "lucide-react";
import { HandoverReport } from '@/types/handover';

interface HandoverDayCardProps {
  day: Date;
  dayIndex: number;
  weekDayNames: string[];
  report: HandoverReport | undefined;
  isToday: boolean;
  getDutyTypeColor: (dutyType: string) => string;
}

export const HandoverDayCard: React.FC<HandoverDayCardProps> = ({
  day,
  dayIndex,
  weekDayNames,
  report,
  isToday,
  getDutyTypeColor
}) => {
  return (
    <Card 
      className={`min-h-[300px] ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'} hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="text-center">
          <div className={`text-sm font-medium ${
            dayIndex === 0 ? 'text-red-600' : 
            dayIndex === 6 ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {weekDayNames[dayIndex]}
          </div>
          <div className={`text-lg font-bold ${
            dayIndex === 0 ? 'text-red-600' : 
            dayIndex === 6 ? 'text-blue-600' : 'text-gray-900'
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
                <div className="font-medium text-purple-600 flex items-center gap-1 mb-1">
                  <FileText className="h-3 w-3" />
                  인수인계 요약
                </div>
                <div className="text-xs bg-purple-50 p-2 rounded text-gray-700 line-clamp-4">
                  {report.reportContent.handoverSummary}
                </div>
              </div>

              <div className="text-xs">
                <div className="font-medium text-blue-600 flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3" />
                  다음 당직자 전달사항
                </div>
                <div className="text-xs bg-blue-50 p-2 rounded text-gray-700 line-clamp-4">
                  {report.reportContent.nextDutyNotes}
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
};
