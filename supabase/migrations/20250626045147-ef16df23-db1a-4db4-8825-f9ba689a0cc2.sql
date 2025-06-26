
-- 2025년 6월 26일 이후의 당직 보고서 데이터 삭제
DELETE FROM public.duty_reports 
WHERE report_date > '2025-06-26';
