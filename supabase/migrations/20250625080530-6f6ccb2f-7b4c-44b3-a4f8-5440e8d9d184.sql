
-- 잘못된 당직 배정 데이터만 삭제 (업데이트 없이)

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
