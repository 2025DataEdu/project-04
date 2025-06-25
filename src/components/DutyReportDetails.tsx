
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertTriangle, Shield, Clock } from "lucide-react";
import { DutyReportWithWorker } from '@/types/dutyReport';

interface DutyReportDetailsProps {
  report: DutyReportWithWorker;
}

export const DutyReportDetails: React.FC<DutyReportDetailsProps> = ({ report }) => {
  return (
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
                <div><strong>지시 일시:</strong> {report.instruction_datetime || '-'}</div>
                <div><strong>주요 지시사항:</strong> {report.instruction_content || '-'}</div>
                <div><strong>이상 유무:</strong> {report.instruction_abnormalities || '특이사항 없음'}</div>
                <div><strong>후속 조치:</strong> {report.instruction_handover || '-'}</div>
              </div>
            </div>

            {/* 순찰 보고 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                순찰/점검 보고
              </h4>
              <div className="bg-green-50 p-3 rounded-lg space-y-1 text-sm">
                <div><strong>순찰 시간:</strong> {report.patrol_datetime || '-'}</div>
                <div><strong>순찰 내용:</strong> {report.patrol_content || '-'}</div>
                <div><strong>점검 결과:</strong> {report.patrol_actions || '-'}</div>
                <div><strong>특이사항:</strong> {report.patrol_notes || '특이사항 없음'}</div>
              </div>
            </div>

            {/* 인수인계 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                인수인계 사항
              </h4>
              <div className="bg-purple-50 p-3 rounded-lg space-y-1 text-sm">
                <div><strong>주요 이슈:</strong> {report.handover_issues || '없음'}</div>
                <div><strong>미해결 과제:</strong> {report.handover_pending || '없음'}</div>
                <div><strong>다음 근무자 유의사항:</strong> {report.handover_notes || '특별한 사항 없음'}</div>
                <div><strong>업무 완료율:</strong> {report.handover_completion_rate}%</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
