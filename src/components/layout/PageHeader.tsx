
import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const PageHeader = () => {
  const notifications = [
    {
      id: 1,
      message: "오늘 '평일 야간' 업무일입니다",
      time: "방금 전",
      type: "duty"
    },
    {
      id: 2,
      message: "업무 인수인계 사항이 있습니다",
      time: "5분 전",
      type: "handover"
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* 상단 유틸리티 바 */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="flex items-center gap-4 text-gray-600">
            <span>당직관리시스템</span>
            <span className="text-gray-400">|</span>
            <span>효율적인 업무 관리</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <button className="hover:text-blue-600 transition-colors">도움말</button>
            <span className="text-gray-400">|</span>
            <button className="hover:text-blue-600 transition-colors">설정</button>
          </div>
        </div>
        
        {/* 메인 헤더 */}
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">당직 관리 시스템</h1>
                <p className="text-gray-600">효율적인 당직 배정과 관리를 위한 통합 시스템</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right text-sm text-gray-600">
                <div>접속시간: {new Date().toLocaleString('ko-KR')}</div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium">관리자</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative h-8 w-8">
                        <Bell className="h-4 w-4" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {notifications.length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 bg-white border shadow-lg z-50">
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-900">알림</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500">
                            새로운 알림이 없습니다
                          </div>
                        ) : (
                          <div className="divide-y">
                            {notifications.map((notification) => (
                              <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    notification.type === 'duty' ? 'bg-blue-500' : 'bg-orange-500'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 mb-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t bg-gray-50">
                        <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900">
                          모든 알림 보기
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
