export interface Worker {
  일련번호: number;
  소속부서: string;
  직급: string;
  이름: string;
  메일주소: string;
  전화번호: string;
  제외여부: string;
}

export interface DutyAssignment {
  id: string;
  assignment_date: string;
  duty_type: '평일야간' | '주말주간' | '주말야간';
  primary_worker_id: number;
  backup_worker_id: number;
  created_at: string;
  updated_at: string;
}

export interface DutyAssignmentWithWorkers extends DutyAssignment {
  primary_worker: Worker;
  backup_worker: Worker;
}

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
  worker: Worker;
}
