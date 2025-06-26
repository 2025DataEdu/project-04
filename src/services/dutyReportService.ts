
import { supabase } from '@/integrations/supabase/client';
import { DutyAssignment } from '@/types/duty';

export const createDutyReportsForAssignments = async (assignments: DutyAssignment[]) => {
  try {
    const reportsToInsert = assignments.map(assignment => {
      const reportDate = assignment.assignment_date;
      const isDutyTypeWeekend = assignment.duty_type === '주말주간';
      const isDutyTypeWeekendNight = assignment.duty_type === '주말야간';
      
      return {
        report_date: reportDate,
        assignment_id: assignment.id,
        duty_worker_id: assignment.primary_worker_id, // 주당직자 ID를 정확히 매핑
        instruction_datetime: `${reportDate} 08:00, 당직사령관 지시`,
        instruction_content: isDutyTypeWeekend 
          ? '주말 특별 점검, 각 시도 재난 정보 확인하여 산불대비, 보안 강화'
          : isDutyTypeWeekendNight
          ? '주말 야간 특별 점검, 각 시도 재난 정보 확인하여 산불대비, 야간 보안 강화'
          : '각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인',
        instruction_handover: '다음 당직자에게 당일 지시사항 및 순찰 결과 전달',
        patrol_datetime: isDutyTypeWeekendNight 
          ? `${reportDate} 22:00-23:00` 
          : `${reportDate} 17:00-18:00`,
        patrol_content: '정기 업무 순찰 실시',
        patrol_actions: '시설 전반 점검 완료, 보안 상태 확인',
        patrol_notes: isDutyTypeWeekend 
          ? '주말 주간 점검, 방문객 안전 관리'
          : isDutyTypeWeekendNight
          ? '주말 야간 순찰, 야간 보안 및 산불대비 관련 지시사항에 따른 추가 점검 실시'
          : '평일 야간 순찰, 산불대비 관련 지시사항에 따른 추가 점검 실시',
        handover_pending: isDutyTypeWeekend ? '3건의 대기 중인 업무' : '2건의 대기 중인 업무',
        handover_notes: isDutyTypeWeekend 
          ? '주말 방문객 관리 강화, 시설 안전 점검 결과 공유'
          : isDutyTypeWeekendNight
          ? '주말 야간 상황 지속 모니터링 필요, 야간 보안 상태 공유'
          : '산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유',
        handover_completion_rate: isDutyTypeWeekend ? 90 : isDutyTypeWeekendNight ? 88 : 85,
        handover_issues: isDutyTypeWeekend 
          ? '주말 특별 점검 완료, 보안 상태 양호'
          : isDutyTypeWeekendNight
          ? '주말 야간 점검 완료, 야간 보안 상태 양호'
          : '평일 점검 완료, 특이사항 없음'
      };
    });

    const { data, error } = await supabase
      .from('duty_reports')
      .insert(reportsToInsert)
      .select();

    if (error) {
      throw new Error(`당직 보고서 생성 실패: ${error.message}`);
    }

    console.log(`Successfully created ${data?.length || 0} duty reports`);
    return data;
  } catch (error) {
    console.error('Error creating duty reports:', error);
    throw error;
  }
};
