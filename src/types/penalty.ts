
export interface PenaltyDuty {
  id: string;
  worker_id: number;
  violation_date: string;
  violation_type: string;
  violation_details: string;
  reported_by: string;
  penalty_status: '대기' | '완료' | '취소';
  penalty_assigned_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PenaltyDutyWithWorker extends PenaltyDuty {
  worker: {
    이름: string;
    소속부서: string;
    직급: string;
    메일주소: string;
    전화번호: string;
  };
}
