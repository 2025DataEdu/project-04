import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useComplaints } from '@/hooks/useComplaints';
import { Plus, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from 'sonner';

const ComplaintManagement = () => {
  const { complaints, isLoading, createComplaint, updateComplaint, findRecommendedSolutions } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">민원 관리</h2>
          <p className="text-muted-foreground">민원 접수, 처리 및 해결방법 관리</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              민원 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 민원 등록</DialogTitle>
              <DialogDescription>
                민원 정보를 입력하면 자동으로 해결방법을 추천해드립니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint(prev => ({...prev, title: e.target.value}))}
                    placeholder="민원 제목을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint(prev => ({...prev, category: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="시설관리">시설관리</SelectItem>
                      <SelectItem value="소음">소음</SelectItem>
                      <SelectItem value="청소">청소</SelectItem>
                      <SelectItem value="주차">주차</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complainant_name">신청인 *</Label>
                  <Input
                    id="complainant_name"
                    value={newComplaint.complainant_name}
                    onChange={(e) => setNewComplaint(prev => ({...prev, complainant_name: e.target.value}))}
                    placeholder="신청인 이름"
                  />
                </div>
                <div>
                  <Label htmlFor="complainant_contact">연락처</Label>
                  <Input
                    id="complainant_contact"
                    value={newComplaint.complainant_contact}
                    onChange={(e) => setNewComplaint(prev => ({...prev, complainant_contact: e.target.value}))}
                    placeholder="연락처"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="priority">우선순위</Label>
                <Select value={newComplaint.priority} onValueChange={(value) => setNewComplaint(prev => ({...prev, priority: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일반">일반</SelectItem>
                    <SelectItem value="높음">높음</SelectItem>
                    <SelectItem value="긴급">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  value={newComplaint.content}
                  onChange={(e) => setNewComplaint(prev => ({...prev, content: e.target.value}))}
                  placeholder="민원 내용을 상세히 입력하세요"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateComplaint}>등록</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>민원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="제목, 내용, 신청인으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="접수">접수</SelectItem>
                <SelectItem value="처리중">처리중</SelectItem>
                <SelectItem value="해결">해결</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              {filteredComplaints.map(complaint => (
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(complaint.id, complaint.status === '접수' ? '처리중' : '해결')}
                        >
                          {complaint.status === '접수' ? '처리중' : '해결'}
                        </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintManagement;
