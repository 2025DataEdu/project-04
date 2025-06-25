
-- 2025년 6월 기존 데이터 모두 삭제 후 재생성
DELETE FROM public.duty_reports WHERE report_date >= '2025-06-01' AND report_date <= '2025-06-30';
DELETE FROM public.duty_assignments WHERE assignment_date >= '2025-06-01' AND assignment_date <= '2025-06-30';

-- 민원 데이터를 2024년에서 2025년으로 업데이트 (아직 2024년 데이터가 있다면)
UPDATE public.complaints 
SET created_at = (created_at + INTERVAL '1 year')::timestamp with time zone,
    updated_at = (updated_at + INTERVAL '1 year')::timestamp with time zone,
    resolved_at = CASE 
        WHEN resolved_at IS NOT NULL 
        THEN (resolved_at + INTERVAL '1 year')::timestamp with time zone 
        ELSE NULL 
    END
WHERE EXTRACT(YEAR FROM created_at) = 2024;

-- 2025년 6월 전체 당직 배정 새로 생성 (일요일, 월요일 제외)
INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) VALUES
('2025-06-03', '평일야간', 1, 2),
('2025-06-04', '평일야간', 3, 4),
('2025-06-05', '평일야간', 5, 6),
('2025-06-06', '평일야간', 7, 8),
('2025-06-07', '주말주간', 9, 10),
('2025-06-10', '평일야간', 11, 12),
('2025-06-11', '평일야간', 13, 14),
('2025-06-12', '평일야간', 15, 1),
('2025-06-13', '평일야간', 2, 3),
('2025-06-14', '주말주간', 4, 5),
('2025-06-17', '평일야간', 6, 7),
('2025-06-18', '평일야간', 8, 9),
('2025-06-19', '평일야간', 10, 11),
('2025-06-20', '평일야간', 12, 13),
('2025-06-21', '주말주간', 14, 15),
('2025-06-24', '평일야간', 1, 2),
('2025-06-25', '평일야간', 3, 4),
('2025-06-26', '평일야간', 5, 6),
('2025-06-27', '평일야간', 7, 8),
('2025-06-28', '주말주간', 9, 10);

-- 모든 당직 배정에 대한 당직 보고서 생성
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
    ELSE '산불대비 관련 지시사항에 따른 추가 점검 실시'
  END,
  CASE 
    WHEN da.duty_type = '주말주간' THEN '3건의 대기 중인 업무'
    WHEN RANDOM() > 0.7 THEN '1건의 대기 중인 업무'
    ELSE '2건의 대기 중인 업무'
  END,
  CASE 
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
    WHEN da.duty_type = '주말주간' THEN '주말 특별 점검 완료, 보안 상태 양호'
    WHEN RANDOM() > 0.5 THEN '시설 점검 완료, 특이사항 없음'
    ELSE '정기 점검 완료, 일부 보수 필요'
  END
FROM public.duty_assignments da
WHERE da.assignment_date >= '2025-06-01' AND da.assignment_date <= '2025-06-30';
