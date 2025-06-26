
import { supabase } from '@/integrations/supabase/client';
import { DutyAssignment } from '@/types/duty';

export const createDutyReportsForAssignments = async (assignments: DutyAssignment[]) => {
  try {
    console.log('Creating duty reports for assignments:', assignments.length);
    
    const reportsToInsert = assignments.map(assignment => {
      // assignment_id를 기준으로 report_date를 assignment_date와 동일하게 설정
      const reportDate = assignment.assignment_date;
      
      return {
        report_date: reportDate, // assignment_date와 동일하게 설정
        assignment_id: assignment.id, // assignment_id를 명확히 연결
        duty_worker_id: assignment.primary_worker_id,
        instruction_datetime: `${reportDate} 08:00, 당직사령관 지시`,
        instruction_content: assignment.duty_type.includes('주말') 
          ? '주말 특별 점검, 각 시도 재난 정보 확인하여 산불대비, 보안 강화'
          : '각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인',
        instruction_handover: '다음 당직자에게 당일 지시사항 및 순찰 결과 전달',
        patrol_datetime: `${reportDate} 17:00-18:00`,
        patrol_content: '정기 업무 순찰 실시',
        patrol_actions: '시설 전반 점검 완료, 보안 상태 확인',
        patrol_notes: assignment.duty_type === '주말야간' 
          ? '야간 특별 순찰 실시, 산불대비 관련 지시사항에 따른 추가 점검'
          : assignment.duty_type === '주말주간'
          ? '주말 주간 점검, 방문객 안전 관리'
          : '산불대비 관련 지시사항에 따른 추가 점검 실시',
        handover_pending: assignment.duty_type.includes('주말') ? '3건의 대기 중인 업무' : '2건의 대기 중인 업무',
        handover_notes: assignment.duty_type === '주말야간'
          ? '야간 보안 강화 필요, 산불대비 상황 지속 모니터링, 재난 정보 확인 결과 공유'
          : assignment.duty_type === '주말주간'
          ? '주말 방문객 관리 강화, 시설 안전 점검 결과 공유'
          : '산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유',
        handover_completion_rate: Math.floor(Math.random() * 16) + 80, // 80-95 랜덤
        handover_issues: assignment.duty_type.includes('주말') 
          ? '주말 특별 점검 완료, 보안 상태 양호' 
          : '정기 점검 완료, 특이사항 없음'
      };
    });

    const { data, error } = await supabase
      .from('duty_reports')
      .insert(reportsToInsert)
      .select();

    if (error) {
      console.error('Error creating duty reports:', error);
      throw error;
    }

    console.log(`Successfully created ${data?.length || 0} duty reports`);
    return data;
  } catch (error) {
    console.error('Error in createDutyReportsForAssignments:', error);
    throw error;
  }
};

export const getDutyReportsByMonth = async (year: number, month: number) => {
  try {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('duty_reports')
      .select(`
        *,
        duty_assignments!inner(
          assignment_date,
          duty_type,
          primary_worker_id,
          backup_worker_id
        )
      `)
      .gte('report_date', startDate)
      .lte('report_date', endDate)
      .order('report_date', { ascending: true });

    if (error) {
      console.error('Error fetching duty reports:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDutyReportsByMonth:', error);
    throw error;
  }
};
