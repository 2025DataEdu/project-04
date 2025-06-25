
export interface DutyReportData {
  id: string;
  report_date: string;
  assignment_id?: string;
  duty_worker_id?: number;
  instruction_datetime?: string;
  instruction_content?: string;
  instruction_abnormalities?: string;
  instruction_handover?: string;
  patrol_datetime?: string;
  patrol_content?: string;
  patrol_actions?: string;
  patrol_notes?: string;
  handover_issues?: string;
  handover_pending?: string;
  handover_notes?: string;
  handover_completion_rate?: number;
  report_types?: string[];
  created_at: string;
  updated_at: string;
}

export interface DutyReportWithWorker extends DutyReportData {
  worker_name?: string;
  worker_department?: string;
  assignment?: {
    duty_type: string;
    primary_worker_name: string;
    backup_worker_name: string;
  };
}
