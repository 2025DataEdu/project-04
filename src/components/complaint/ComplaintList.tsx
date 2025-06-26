
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Complaint } from '@/types/complaint';
import ComplaintSolutionDialog from './ComplaintSolutionDialog';

interface ComplaintListProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, status: string) => void;
  recommendedSolutions: any[];
  onFindSolutions: (content: string, category: string) => any[];
}

const ComplaintList = ({ 
  complaints, 
  onUpdateStatus, 
  recommendedSolutions, 
  onFindSolutions 
}: ComplaintListProps) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSolutions, setCurrentSolutions] = useState<any[]>([]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '접수':
        return <Badge variant="secondary">접수</Badge>;
      case '처리중':
        return <Badge variant="default">처리중</Badge>;
      case '해결':
        return <Badge variant="outline" className="text-green-600 border-green-600">해결</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case '긴급':
        return <Badge variant="destructive">긴급</Badge>;
      case '높음':
        return <Badge variant="default">높음</Badge>;
      case '일반':
        return <Badge variant="secondary">일반</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleResolveClick = (complaint: Complaint) => {
    const solutions = onFindSolutions(complaint.content, complaint.category);
    setSelectedComplaint(complaint);
    setCurrentSolutions(solutions);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedComplaint(null);
    setCurrentSolutions([]);
  };

  const handleResolveConfirm = () => {
    if (selectedComplaint) {
      onUpdateStatus(selectedComplaint.id, '해결');
    }
    handleDialogClose();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>민원번호</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>신청인</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>우선순위</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map(complaint => (
            <TableRow key={complaint.id}>
              <TableCell className="font-mono text-sm">{complaint.complaint_number}</TableCell>
              <TableCell className="font-medium">{complaint.title}</TableCell>
              <TableCell>{complaint.complainant_name}</TableCell>
              <TableCell>{complaint.category}</TableCell>
              <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
              <TableCell>{getStatusBadge(complaint.status)}</TableCell>
              <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {complaint.status !== '해결' && (
                    <>
                      {complaint.status === '접수' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateStatus(complaint.id, '처리중')}
                        >
                          처리중
                        </Button>
                      )}
                      {complaint.status === '처리중' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveClick(complaint)}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                        >
                          해결
                        </Button>
                      )}
                    </>
                  )}
                  {complaint.status === '해결' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ComplaintSolutionDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onResolve={handleResolveConfirm}
        solutions={currentSolutions}
        complaintTitle={selectedComplaint?.title || ''}
      />
    </>
  );
};

export default ComplaintList;
