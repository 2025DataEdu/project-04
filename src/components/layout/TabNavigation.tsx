
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, BarChart3, FileText, AlertTriangle, PieChart, MessageSquareMore, ClipboardList } from "lucide-react";

const TabNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-7 mb-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            당직 배정
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI 기반 공정한 당직 배정으로 업무 부담 균등화</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            업무 분석
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>업무 내용을 자동으로 유형별로 분류하여 정리</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="handover" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            인수인계 현황
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>구조화된 정보 관리로 업무 효율성 극대화</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="penalty" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            벌당직 관리
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>수기 작성 오류와 누락을 방지하여 업무 신뢰성 제고</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="complaint-dashboard" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            민원 대시보드
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>민원 현황을 한눈에 파악할 수 있는 대시보드</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="complaint-management" className="flex items-center gap-2">
            <MessageSquareMore className="h-4 w-4" />
            민원 관리
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>체계적인 민원 접수, 처리 및 해결방법 추천</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            당직 보고서
          </TabsTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>당직 보고서 작성 및 관리</p>
        </TooltipContent>
      </Tooltip>
    </TabsList>
  );
};

export default TabNavigation;
