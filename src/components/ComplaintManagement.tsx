
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useComplaints } from '@/hooks/useComplaints';
import { toast } from 'sonner';
import ComplaintHeader from './complaint/ComplaintHeader';
import ComplaintCreateDialog from './complaint/ComplaintCreateDialog';
import ComplaintFilters from './complaint/ComplaintFilters';
import ComplaintList from './complaint/ComplaintList';

const ComplaintManagement = () => {
  const {
    complaints,
    isLoading,
    createComplaint,
    updateComplaint,
    findRecommendedSolutions,
    solutions
  } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    complaint_number: '',
    title: '',
    content: '',
    complainant_name: '',
    complainant_contact: '',
    category: '',
    priority: '일반'
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         complaint.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         complaint.complainant_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '전체' || complaint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateComplaint = async () => {
    if (!newComplaint.title || !newComplaint.content || !newComplaint.complainant_name) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const complaintNumber = `C${Date.now()}`;
    const result = await createComplaint({
      ...newComplaint,
      complaint_number: complaintNumber,
      status: '접수'
    });

    if (result) {
      setIsCreateDialogOpen(false);
      setNewComplaint({
        complaint_number: '',
        title: '',
        content: '',
        complainant_name: '',
        complainant_contact: '',
        category: '',
        priority: '일반'
      });

      // 추천 해결방법 표시
      const recommendations = findRecommendedSolutions(newComplaint.content, newComplaint.category);
      if (recommendations.length > 0) {
        toast.success(`민원이 등록되었습니다. ${recommendations.length}개의 해결방법이 추천됩니다.`);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateComplaint(id, {
      status,
      resolved_at: status === '해결' ? new Date().toISOString() : null
    });
  };

  const handleCancelCreate = () => {
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 통합된 헤더와 목록 카드 */}
      <Card className="shadow-lg border-0 bg-white">
        <ComplaintHeader 
          isCreateDialogOpen={isCreateDialogOpen} 
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        >
          <ComplaintCreateDialog 
            newComplaint={newComplaint} 
            setNewComplaint={setNewComplaint} 
            onCreateComplaint={handleCreateComplaint} 
            onCancel={handleCancelCreate} 
          />
        </ComplaintHeader>
        
        <CardContent className="p-6 pt-0 my-[30px]">
          <ComplaintFilters 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            filterStatus={filterStatus} 
            setFilterStatus={setFilterStatus} 
          />

          <ComplaintList 
            complaints={filteredComplaints} 
            onUpdateStatus={handleUpdateStatus}
            recommendedSolutions={solutions}
            onFindSolutions={findRecommendedSolutions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintManagement;
