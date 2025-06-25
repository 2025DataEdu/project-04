
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Worker } from '@/types/duty';

interface PenaltyDutyFormProps {
  workers: Worker[];
  isLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

const PenaltyDutyForm: React.FC<PenaltyDutyFormProps> = ({
  workers,
  isLoading,
  isDialogOpen,
  setIsDialogOpen,
  onSubmit
}) => {
  const form = useForm({
    defaultValues: {
      worker_id: '',
      violation_date: '',
      violation_type: '',
      violation_details: ''
    }
  });

  const violationTypes = [
    '중요 문서 보관 소홀',
    '캐비넷/서랍장 미잠금',
    '개인정보 보안문서 노출',
    '기타 보안 위반'
  ];

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30">
          <Plus className="h-4 w-4 mr-2" />
          벌당직 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>벌당직 등록</DialogTitle>
          <DialogDescription>
            순찰 시 발견된 지적사항을 등록하고 해당 근무자에게 벌당직을 부여합니다.
            지적자는 해당 위반일자의 당직자로 자동 설정됩니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="worker_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>지적 대상자</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="근무자를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.일련번호} value={worker.일련번호.toString()}>
                          {worker.이름} ({worker.소속부서} · {worker.직급})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="violation_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>위반 일자</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="violation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>위반 유형</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="위반 유형을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {violationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="violation_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상세 내용</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="지적사항의 상세 내용을 입력하세요..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '등록 중...' : '벌당직 등록'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PenaltyDutyForm;
