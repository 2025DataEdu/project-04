
-- 현재 6월의 당직 배정 데이터 확인
SELECT 
    assignment_date,
    EXTRACT(DOW FROM assignment_date) as day_of_week,
    duty_type,
    primary_worker_id,
    backup_worker_id
FROM public.duty_assignments 
WHERE assignment_date >= '2025-06-01' 
AND assignment_date <= '2025-06-30'
ORDER BY assignment_date;
