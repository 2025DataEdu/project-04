
export interface HandoverReport {
  id: string;
  date: string;
  dayOfWeek: string;
  dutyType: string;
  reportContent: {
    commanderInstructions: string;
    patrolReport: string;
    handoverSummary: string;
    issues: string;
    pendingTasks: string;
    nextDutyNotes: string;
  };
  reportedBy: string;
  department: string;
  reportTime: string;
}
