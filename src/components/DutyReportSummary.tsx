
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User } from "lucide-react";
import { DutyReportWithWorker } from '@/types/dutyReport';

interface DutyReportSummaryProps {
  report: DutyReportWithWorker;
}

export const DutyReportSummary: React.FC<DutyReportSummaryProps> = ({ report }) => {
  return (
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
              <span className="font-medium">{report.worker_name}</span>
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                {report.worker_department}
              </Badge>
            </div>
            {report.assignment && (
              <div className="text-sm text-muted-foreground">
                <span>당직 유형: </span>
                <Badge variant="secondary">{report.assignment.duty_type}</Badge>
                <span className="ml-2">예비: {report.assignment.backup_worker_name}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">업무 분류</h4>
            <div className="flex flex-wrap gap-2">
              {report.report_types?.map((type, index) => (
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
              <div><strong>완료율:</strong> <Badge variant="outline">{report.handover_completion_rate}%</Badge></div>
              <div><strong>대기 업무:</strong> {report.handover_pending || '없음'}</div>
              <div><strong>주요 이슈:</strong> {report.handover_issues || '없음'}</div>
              {report.handover_notes && (
                <div><strong>인수인계 요약:</strong> {report.handover_notes}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
