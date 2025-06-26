
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewComplaint {
  complaint_number: string;
  title: string;
  content: string;
  complainant_name: string;
  complainant_contact: string;
  category: string;
  priority: string;
}

interface ComplaintCreateDialogProps {
  newComplaint: NewComplaint;
  setNewComplaint: React.Dispatch<React.SetStateAction<NewComplaint>>;
  onCreateComplaint: () => void;
  onCancel: () => void;
}

const ComplaintCreateDialog = ({
  newComplaint,
  setNewComplaint,
  onCreateComplaint,
  onCancel
}: ComplaintCreateDialogProps) => {
  return (
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
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={onCreateComplaint}>등록</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ComplaintCreateDialog;
