
-- 기존 duty_reports 데이터에서 날짜 불일치 문제 수정
-- assignment_id가 있는 보고서들의 report_date를 해당 배정의 assignment_date와 동일하게 수정
UPDATE public.duty_reports 
SET report_date = da.assignment_date
FROM public.duty_assignments da 
WHERE duty_reports.assignment_id = da.id 
AND duty_reports.report_date != da.assignment_date;

-- 혹시 assignment_id가 null인 보고서가 있다면 날짜를 기준으로 매칭하여 assignment_id 설정
UPDATE public.duty_reports 
SET assignment_id = da.id
FROM public.duty_assignments da 
WHERE duty_reports.assignment_id IS NULL 
AND duty_reports.report_date = da.assignment_date 
AND duty_reports.duty_worker_id = da.primary_worker_id;
