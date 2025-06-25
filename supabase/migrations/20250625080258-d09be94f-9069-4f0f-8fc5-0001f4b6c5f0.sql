
-- 잘못된 당직 배정 데이터 삭제 및 수정 (올바른 순서)

-- 1단계: 먼저 관련된 당직 보고서 삭제
-- 월요일(1)에 주말주간으로 잘못 배정된 데이터와 관련된 보고서 삭제
DELETE FROM public.duty_reports 
WHERE assignment_id IN (
    SELECT id FROM public.duty_assignments 
    WHERE EXTRACT(DOW FROM assignment_date) = 1 AND duty_type = '주말주간'
);

-- 토요일(6)에 평일야간으로 잘못 배정된 데이터와 관련된 보고서 삭제
DELETE FROM public.duty_reports 
WHERE assignment_id IN (
    SELECT id FROM public.duty_assignments 
    WHERE EXTRACT(DOW FROM assignment_date) = 6 AND duty_type = '평일야간'
);

-- 2단계: 잘못된 당직 배정 데이터 삭제
-- 월요일(1)에 주말주간으로 잘못 배정된 데이터 삭제
DELETE FROM public.duty_assignments 
WHERE EXTRACT(DOW FROM assignment_date) = 1 -- 월요일
AND duty_type = '주말주간';

-- 토요일(6)에 평일야간으로 잘못 배정된 데이터 삭제  
DELETE FROM public.duty_assignments 
WHERE EXTRACT(DOW FROM assignment_date) = 6 -- 토요일
AND duty_type = '평일야간';

-- 3단계: 올바른 당직 배정 데이터 추가
-- 월요일에는 평일야간으로, 토요일에는 주말주간으로 올바르게 배정
-- 2025년 6월 월요일들에 평일야간 배정
INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-02'::date, '평일야간', 3, 4
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-02' AND duty_type = '평일야간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-09'::date, '평일야간', 7, 8
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-09' AND duty_type = '평일야간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-16'::date, '평일야간', 11, 12
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-16' AND duty_type = '평일야간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-23'::date, '평일야간', 15, 1
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-23' AND duty_type = '평일야간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-30'::date, '평일야간', 4, 5
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-30' AND duty_type = '평일야간');

-- 2025년 6월 토요일들에 주말주간 배정
INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-07'::date, '주말주간', 9, 10
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-07' AND duty_type = '주말주간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-14'::date, '주말주간', 4, 5
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-14' AND duty_type = '주말주간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-21'::date, '주말주간', 14, 15
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-21' AND duty_type = '주말주간');

INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) 
SELECT '2025-06-28'::date, '주말주간', 9, 10
WHERE NOT EXISTS (SELECT 1 FROM public.duty_assignments WHERE assignment_date = '2025-06-28' AND duty_type = '주말주간');

-- 4단계: 새로운 올바른 배정에 대한 당직 보고서 생성
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
  '2건의 대기 중인 업무',
  CASE 
    WHEN da.duty_type = '주말주간' THEN '주말 방문객 관리 강화, 시설 안전 점검 결과 공유'
    ELSE '산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유'
  END,
  85,
  CASE 
    WHEN da.duty_type = '주말주간' THEN '주말 특별 점검 완료, 보안 상태 양호'
    ELSE '평일 점검 완료, 특이사항 없음'
  END
FROM public.duty_assignments da
WHERE da.assignment_date IN ('2025-06-02', '2025-06-07', '2025-06-09', '2025-06-14', '2025-06-16', '2025-06-21', '2025-06-23', '2025-06-28', '2025-06-30')
AND ((EXTRACT(DOW FROM da.assignment_date) = 1 AND da.duty_type = '평일야간') 
     OR (EXTRACT(DOW FROM da.assignment_date) = 6 AND da.duty_type = '주말주간'))
AND NOT EXISTS (
  SELECT 1 FROM public.duty_reports dr WHERE dr.assignment_id = da.id
);
