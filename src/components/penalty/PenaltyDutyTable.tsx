
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserX } from "lucide-react";
import { PenaltyDutyWithWorker } from '@/types/penalty';
import PenaltyStatusBadge from './PenaltyStatusBadge';

interface PenaltyDutyTableProps {
  penalties: PenaltyDutyWithWorker[];
}

const PenaltyDutyTable: React.FC<PenaltyDutyTableProps> = ({ penalties }) => {
  if (penalties.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <UserX className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>등록된 벌당직이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>대상자</TableHead>
            <TableHead>위반일자</TableHead>
            <TableHead>위반유형</TableHead>
            <TableHead>상세내용</TableHead>
            <TableHead>지적자</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {penalties.map((penalty) => (
            <TableRow key={penalty.id}>
              <TableCell className="font-medium">
                {penalty.worker.이름}
              </TableCell>
              <TableCell>{penalty.violation_date}</TableCell>
              <TableCell>
                <div className="text-sm font-medium text-red-600">
                  {penalty.violation_type}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={penalty.violation_details}>
                  {penalty.violation_details}
                </div>
              </TableCell>
              <TableCell>{penalty.reported_by}</TableCell>
              <TableCell>
                <PenaltyStatusBadge status={penalty.penalty_status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PenaltyDutyTable;
