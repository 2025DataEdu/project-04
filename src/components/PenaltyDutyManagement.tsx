
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, UserX } from "lucide-react";
import { usePenaltyDuty } from '@/hooks/usePenaltyDuty';
import { useDutyAssignment } from '@/hooks/useDutyAssignment';
import { PenaltyDutyWithWorker } from '@/types/penalty';
import { Worker } from '@/types/duty';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const PenaltyDutyManagement = () => {
  const [penalties, setPenalties] = useState<PenaltyDutyWithWorker[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { isLoading, createPenaltyDuty, getPenaltyDuties, updatePenaltyStatus, getDutyWorkerByDate } = usePenaltyDuty();
  const { getAvailableWorkers } = useDutyAssignment();

  const form = useForm({
    defaultValues: {
      worker_id: '',
      violation_date: '',
      violation_type: '',
      violation_details: ''
    }
  });

  const loadData = async () => {
    const [penaltyData, workersData] = await Promise.all([
      getPenaltyDuties(),
      getAvailableWorkers()
    ]);
    setPenalties(penaltyData);
    setWorkers(workersData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePenalty = async (data: any) => {
    const result = await createPenaltyDuty({
      worker_id: parseInt(data.worker_id),
      violation_date: data.violation_date,
      violation_type: data.violation_type,
      violation_details: data.violation_details
    });

    if (result) {
      setIsDialogOpen(false);
      form.reset();
      loadData();
    }
  };

  const handleStatusUpdate = async (id: string, status: '대기' | '완료' | '취소', assignedDate?: string) => {
    const success = await updatePenaltyStatus(id, status, assignedDate);
    if (success) {
      loadData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '대기': return 'bg-yellow-100 text-yellow-700';
      case '완료': return 'bg-green-100 text-green-700';
      case '취소': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const violationTypes = [
    '중요 문서 보관 소홀',
    '캐비넷/서랍장 미잠금',
    '개인정보 보안문서 노출',
    '기타 보안 위반'
  ];

  return (
    <div className="space-y-6">
      {/* 벌당직 등록 */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              벌당직 관리
            </div>
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
                  <form onSubmit={form.handleSubmit(handleCreatePenalty)} className="space-y-4">
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
          </CardTitle>
          <CardDescription className="text-red-100">
            순찰 중 발견된 보안 위반 사항을 관리하고 벌당직을 부여합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {penalties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserX className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>등록된 벌당직이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>대상자</TableHead>
                    <TableHead>위반일자</TableHead>
                    <TableHead>위반유형</TableHead>
                    <TableHead>상세내용</TableHead>
                    <TableHead>지적자</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penalties.map((penalty) => (
                    <TableRow key={penalty.id}>
                      <TableCell className="font-medium">
                        {penalty.worker.이름}
                      </TableCell>
                      <TableCell>{penalty.violation_date}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-red-600">
                          {penalty.violation_type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={penalty.violation_details}>
                          {penalty.violation_details}
                        </div>
                      </TableCell>
                      <TableCell>{penalty.reported_by}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(penalty.penalty_status)}`}>
                          {penalty.penalty_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PenaltyDutyManagement;
