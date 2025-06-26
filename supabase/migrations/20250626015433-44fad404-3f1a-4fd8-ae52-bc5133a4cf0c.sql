
-- 2025년 6월 27일부터 30일까지의 당직 보고서 삭제
DELETE FROM public.duty_reports 
WHERE report_date >= '2025-06-27' AND report_date <= '2025-06-30';

-- 2025년 6월 27일부터 30일까지의 당직 배정 삭제
DELETE FROM public.duty_assignments 
WHERE assignment_date >= '2025-06-27' AND assignment_date <= '2025-06-30';
