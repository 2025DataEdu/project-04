
import { supabase } from '@/integrations/supabase/client';
import { DutyAssignment } from '@/types/duty';

export const createDutyReportsForAssignments = async (assignments: DutyAssignment[]) => {
  try {
    console.log('Creating duty reports for assignments:', assignments.length);
    console.log('Assignment dates:', assignments.map(a => a.assignment_date));
    
    const reportsToInsert = assignments.map(assignment => {
      // assignment_id를 기준으로 report_date를 assignment_date와 동일하게 설정
      const reportDate = assignment.assignment_date;
      
      // 날짜별로 다양한 보고서 내용 생성
      const dayOfMonth = new Date(reportDate).getDate();
      const isWeekend = assignment.duty_type.includes('주말');
      
      return {
        report_date: reportDate, // assignment_date와 동일하게 설정
        assignment_id: assignment.id, // assignment_id를 명확히 연결
        duty_worker_id: assignment.primary_worker_id,
        instruction_datetime: `${reportDate} 08:00, 당직사령관 지시`,
        instruction_content: isWeekend 
          ? `주말 특별 점검 (${dayOfMonth}일), 각 시도 재난 정보 확인하여 산불대비, 보안 강화, 방문객 관리`
          : `평일 정규 업무 (${dayOfMonth}일), 각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인`,
        instruction_handover: '다음 당직자에게 당일 지시사항 및 순찰 결과 전달',
        patrol_datetime: `${reportDate} ${isWeekend ? '14:00-15:00, 19:00-20:00' : '17:00-18:00'}`,
        patrol_content: isWeekend ? '주말 특별 순찰 및 방문객 안전 관리' : '정기 업무 순찰 실시',
        patrol_actions: isWeekend 
          ? `시설 전반 점검 완료, 보안 상태 확인, 방문객 ${Math.floor(Math.random() * 50) + 20}명 확인`
          : '시설 전반 점검 완료, 보안 상태 확인, 일반 업무 점검',
        patrol_notes: assignment.duty_type === '주말야간' 
          ? `야간 특별 순찰 실시 (${dayOfMonth}일), 산불대비 관련 지시사항에 따른 추가 점검, 야간 보안 강화`
          : assignment.duty_type === '주말주간'
          ? `주말 주간 점검 (${dayOfMonth}일), 방문객 안전 관리, 주말 특별 업무 처리`
          : `평일 정규 점검 (${dayOfMonth}일), 산불대비 관련 지시사항에 따른 추가 점검 실시`,
        handover_pending: isWeekend 
          ? `${Math.floor(Math.random() * 3) + 2}건의 주말 대기 업무` 
          : `${Math.floor(Math.random() * 4) + 1}건의 평일 대기 업무`,
        handover_notes: assignment.duty_type === '주말야간'
          ? `야간 보안 강화 필요 (${dayOfMonth}일), 산불대비 상황 지속 모니터링, 재난 정보 확인 결과 공유, 야간 특이사항 없음`
          : assignment.duty_type === '주말주간'
          ? `주말 방문객 관리 강화 (${dayOfMonth}일), 시설 안전 점검 결과 공유, 주말 특별사항 처리 완료`
          : `평일 정규 업무 처리 (${dayOfMonth}일), 산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유`,
        handover_completion_rate: Math.floor(Math.random() * 16) + 80, // 80-95 랜덤
        handover_issues: assignment.duty_type.includes('주말') 
          ? `주말 특별 점검 완료 (${dayOfMonth}일), 보안 상태 양호, 방문객 관리 원활` 
          : `정기 점검 완료 (${dayOfMonth}일), 특이사항 없음, 업무 처리 정상`
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
    console.log('Created report dates:', data?.map(d => d.report_date));
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
