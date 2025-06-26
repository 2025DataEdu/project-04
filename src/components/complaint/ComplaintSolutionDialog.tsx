
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComplaintSolution } from '@/types/complaint';

interface ComplaintSolutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: () => void;
  solutions: ComplaintSolution[];
  complaintTitle: string;
}

const ComplaintSolutionDialog = ({ 
  isOpen, 
  onClose, 
  onResolve, 
  solutions, 
  complaintTitle 
}: ComplaintSolutionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            "{complaintTitle}" 민원 해결책 추천
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {solutions.length > 0 ? (
            solutions.map((solution, index) => (
              <div key={solution.id} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-blue-600 mb-2">
                  추천 해결방법 {index + 1}: {solution.solution_title}
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {solution.solution_content}
                </p>
                {solution.keywords.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">관련 키워드: </span>
                    {solution.keywords.map((keyword, idx) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>해당 민원에 대한 추천 해결방법이 없습니다.</p>
              <p className="text-sm mt-2">일반적인 해결 절차를 따라 처리해 주세요.</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={onResolve} className="bg-green-600 hover:bg-green-700">
            해결 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintSolutionDialog;
