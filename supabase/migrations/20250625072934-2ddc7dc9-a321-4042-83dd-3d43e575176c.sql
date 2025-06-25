
-- 2025년 6월 일요일, 월요일 당직 배정 추가
INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) VALUES
('2025-06-01', '주말주간', 1, 2),  -- 일요일
('2025-06-02', '평일야간', 3, 4),  -- 월요일
('2025-06-08', '주말주간', 5, 6),  -- 일요일
('2025-06-09', '평일야간', 7, 8),  -- 월요일
('2025-06-15', '주말주간', 9, 10), -- 일요일
('2025-06-16', '평일야간', 11, 12), -- 월요일
('2025-06-22', '주말주간', 13, 14), -- 일요일
('2025-06-23', '평일야간', 15, 1), -- 월요일
('2025-06-29', '주말주간', 2, 3),  -- 일요일
('2025-06-30', '평일야간', 4, 5);  -- 월요일

-- 새로 추가된 당직 배정에 대한 당직 보고서 생성
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
    WHEN da.duty_type = '주말주간' THEN '주말 특별 점검, 각 시도 재난 정보 확인하여 산불대비, 보안 강화'
    ELSE '각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인'  
  END,
  '다음 당직자에게 당일 지시사항 및 순찰 결과 전달',
  da.assignment_date::text || ' 17:00-18:00',
  '정기 업무 순찰 실시',
  '시설 전반 점검 완료, 보안 상태 확인',
  CASE 
    WHEN da.duty_type = '주말주간' THEN '주말 주간 점검, 방문객 안전 관리'
    ELSE '평일 야간 순찰, 산불대비 관련 지시사항에 따른 추가 점검 실시'
  END,
  CASE 
    WHEN da.duty_type = '주말주간' THEN '3건의 대기 중인 업무'
    ELSE '2건의 대기 중인 업무'
  END,
  CASE 
    WHEN da.duty_type = '주말주간' THEN '주말 방문객 관리 강화, 시설 안전 점검 결과 공유'
    ELSE '산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유'
  END,
  CASE 
    WHEN da.duty_type = '주말주간' THEN 90
    ELSE 85
  END,
  CASE 
    WHEN da.duty_type = '주말주간' THEN '주말 특별 점검 완료, 보안 상태 양호'
    ELSE '평일 점검 완료, 특이사항 없음'
  END
FROM public.duty_assignments da
WHERE da.assignment_date IN ('2025-06-01', '2025-06-02', '2025-06-08', '2025-06-09', '2025-06-15', '2025-06-16', '2025-06-22', '2025-06-23', '2025-06-29', '2025-06-30');
