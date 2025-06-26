
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, BarChart3, FileText, AlertTriangle, PieChart, MessageSquareMore, ClipboardList } from "lucide-react";

const TabNavigation = () => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <TabsList className="grid w-full grid-cols-7 bg-transparent h-16 p-0 gap-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="assignment" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-medium">당직 배정</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI 기반 공정한 당직 배정으로 업무 부담 균등화</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="analysis" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs font-medium">업무 분석</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>업무 내용을 자동으로 유형별로 분류하여 정리</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="handover" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs font-medium">인수인계 현황</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>구조화된 정보 관리로 업무 효율성 극대화</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="report" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <ClipboardList className="h-5 w-5" />
                <span className="text-xs font-medium">당직 보고서</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>당직 보고서 작성 및 관리</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="penalty" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs font-medium">벌당직 관리</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>수기 작성 오류와 누락을 방지하여 업무 신뢰성 제고</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="complaint-dashboard" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <PieChart className="h-5 w-5" />
                <span className="text-xs font-medium">민원 대시보드</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>민원 현황을 한눈에 파악할 수 있는 대시보드</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="complaint-management" 
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 hover:bg-gray-50 transition-all duration-200"
              >
                <MessageSquareMore className="h-5 w-5" />
                <span className="text-xs font-medium">민원 관리</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>체계적인 민원 접수, 처리 및 해결방법 추천</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
      </div>
    </div>
  );
};

export default TabNavigation;
