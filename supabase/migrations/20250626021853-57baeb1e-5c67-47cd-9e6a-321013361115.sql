
-- 2025-06-01 미만의 모든 duty_reports 데이터 삭제
DELETE FROM public.duty_reports 
WHERE report_date < '2025-06-01';

-- 2025-06-01 미만의 모든 duty_assignments 데이터 삭제
DELETE FROM public.duty_assignments 
WHERE assignment_date < '2025-06-01';
