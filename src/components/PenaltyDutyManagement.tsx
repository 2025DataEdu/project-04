
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { usePenaltyDuty } from '@/hooks/usePenaltyDuty';
import { useDutyAssignment } from '@/hooks/useDutyAssignment';
import { PenaltyDutyWithWorker } from '@/types/penalty';
import { Worker } from '@/types/duty';
import PenaltyDutyForm from './penalty/PenaltyDutyForm';
import PenaltyDutyTable from './penalty/PenaltyDutyTable';

const PenaltyDutyManagement = () => {
  const [penalties, setPenalties] = useState<PenaltyDutyWithWorker[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { isLoading, createPenaltyDuty, getPenaltyDuties, updatePenaltyStatus, getDutyWorkerByDate } = usePenaltyDuty();
  const { getAvailableWorkers } = useDutyAssignment();

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
      loadData();
    }
  };

  const handleStatusUpdate = async (id: string, status: '대기' | '완료' | '취소', assignedDate?: string) => {
    const success = await updatePenaltyStatus(id, status, assignedDate);
    if (success) {
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              벌당직 관리
            </div>
            <PenaltyDutyForm
              workers={workers}
              isLoading={isLoading}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onSubmit={handleCreatePenalty}
            />
          </CardTitle>
          <CardDescription className="text-red-100">
            순찰 중 발견된 보안 위반 사항을 관리하고 벌당직을 부여합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PenaltyDutyTable penalties={penalties} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PenaltyDutyManagement;
