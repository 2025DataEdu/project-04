
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface AnalysisInputProps {
  inputContent: string;
  setInputContent: (content: string) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onClear: () => void;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({
  inputContent,
  setInputContent,
  isAnalyzing,
  onAnalyze,
  onClear
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          업무 내용 입력
        </CardTitle>
        <CardDescription className="text-blue-100">
          지시사항, 순찰, 인수인계 등의 내용을 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Textarea
            placeholder="예시: 
당직사령관한테 받은 지시 상황(각 시도에 있는 재난 정보 확인하여 산불대비, 근무 규정 확인)
-> 업무 순찰(17시 부터 18시)
-> 다음 당직자 인수인계"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="min-h-[200px] resize-none border-2 focus:border-blue-500 transition-colors"
          />
          <div className="flex gap-3">
            <Button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  분석 중...
                </>
              ) : (
                '내용 분석하기'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClear}
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              초기화
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisInput;
