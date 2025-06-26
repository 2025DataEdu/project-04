
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ComplaintFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const ComplaintFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}: ComplaintFiltersProps) => {
  return (
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
  );
};

export default ComplaintFilters;
