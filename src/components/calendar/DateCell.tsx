
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Phone, Mail } from "lucide-react";
import { DutyAssignmentWithWorkers } from '@/types/duty';

interface DateCellProps {
  day: Date | null;
  assignments: DutyAssignmentWithWorkers[];
}

const getDutyTypeColor = (dutyType: string) => {
  switch (dutyType) {
    case '평일야간': return 'bg-blue-100 text-blue-700';
    case '주말주간': return 'bg-green-100 text-green-700';
    case '주말야간': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const DateCell: React.FC<DateCellProps> = ({ day, assignments }) => {
  if (!day) {
    return (
      <div className="min-h-[120px] border border-gray-200 rounded-lg p-1 bg-gray-50" />
    );
  }

  return (
    <div className="min-h-[120px] border border-gray-200 rounded-lg p-1 bg-white hover:bg-gray-50">
      <div className={`text-sm font-medium mb-1 ${
        day.getDay() === 0 ? 'text-red-600' : 
        day.getDay() === 6 ? 'text-blue-600' : 'text-gray-700'
      }`}>
        {day.getDate()}
      </div>
      <div className="space-y-1">
        {assignments.map((assignment) => (
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
    </div>
  );
};
