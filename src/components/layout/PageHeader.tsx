
import React from 'react';

const PageHeader = () => {
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
                <div className="text-blue-600 font-medium">관리자</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
