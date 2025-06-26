
-- duty_reports 테이블에서 6월이 아닌 데이터 삭제 (외래키 제약조건으로 인해 먼저 삭제)
DELETE FROM public.duty_reports 
WHERE EXTRACT(MONTH FROM report_date) != 6 OR EXTRACT(YEAR FROM report_date) != 2025;

-- duty_assignments 테이블에서 6월이 아닌 데이터 삭제
DELETE FROM public.duty_assignments 
WHERE EXTRACT(MONTH FROM assignment_date) != 6 OR EXTRACT(YEAR FROM assignment_date) != 2025;
