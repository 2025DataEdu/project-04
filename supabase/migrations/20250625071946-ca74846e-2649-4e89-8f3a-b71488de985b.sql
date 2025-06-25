
-- 기존 6월 당직 보고서 데이터 확인 및 삭제
DELETE FROM public.duty_reports WHERE report_date >= '2024-06-01' AND report_date <= '2024-06-30';

-- 6월 당직 보고서 샘플 데이터 재생성 (당직 배정과 연동)
INSERT INTO public.duty_reports (
  report_date, assignment_id, duty_worker_id, instruction_datetime, instruction_content, 
  instruction_handover, patrol_datetime, patrol_content, patrol_actions, 
  patrol_notes, handover_pending, handover_notes, handover_completion_rate,
  handover_issues
) 
SELECT 
  da.assignment_date,
  da.id,
  da.primary_worker_id,
  da.assignment_date::text || ' 08:00, 당직사령관 지시',
  CASE 
    WHEN EXTRACT(DOW FROM da.assignment_date) IN (0, 6) THEN '주말 특별 점검, 각 시도 재난 정보 확인하여 산불대비, 보안 강화'
    ELSE '각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인'
  END,
  '다음 당직자에게 당일 지시사항 및 순찰 결과 전달',
  da.assignment_date::text || ' 17:00-18:00',
  '정기 업무 순찰 실시',
  '시설 전반 점검 완료, 보안 상태 확인',
  CASE 
    WHEN da.duty_type = '주말야간' THEN '야간 특별 순찰 실시, 산불대비 관련 지시사항에 따른 추가 점검'
    WHEN da.duty_type = '주말주간' THEN '주말 주간 점검, 방문객 안전 관리'
    ELSE '산불대비 관련 지시사항에 따른 추가 점검 실시'
  END,
  CASE 
    WHEN EXTRACT(DOW FROM da.assignment_date) IN (0, 6) THEN '3건의 대기 중인 업무'
    WHEN RANDOM() > 0.7 THEN '1건의 대기 중인 업무'
    ELSE '2건의 대기 중인 업무'
  END,
  CASE 
    WHEN da.duty_type = '주말야간' THEN '야간 보안 강화 필요, 산불대비 상황 지속 모니터링, 재난 정보 확인 결과 공유'
    WHEN da.duty_type = '주말주간' THEN '주말 방문객 관리 강화, 시설 안전 점검 결과 공유'
    ELSE '산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유'
  END,
  CASE 
    WHEN RANDOM() > 0.8 THEN 95
    WHEN RANDOM() > 0.6 THEN 90
    WHEN RANDOM() > 0.3 THEN 85
    ELSE 80
  END,
  CASE 
    WHEN EXTRACT(DOW FROM da.assignment_date) IN (0, 6) THEN '주말 특별 점검 완료, 보안 상태 양호'
    WHEN RANDOM() > 0.5 THEN '시설 점검 완료, 특이사항 없음'
    ELSE '정기 점검 완료, 일부 보수 필요'
  END
FROM public.duty_assignments da
WHERE da.assignment_date >= '2024-06-01' AND da.assignment_date <= '2024-06-30';
