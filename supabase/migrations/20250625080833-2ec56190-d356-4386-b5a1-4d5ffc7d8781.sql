
-- 전체 당직 배정 데이터 확인 (최근 데이터부터)
SELECT 
    assignment_date,
    EXTRACT(DOW FROM assignment_date) as day_of_week,
    CASE 
        WHEN EXTRACT(DOW FROM assignment_date) = 0 THEN '일요일'
        WHEN EXTRACT(DOW FROM assignment_date) = 1 THEN '월요일' 
        WHEN EXTRACT(DOW FROM assignment_date) = 2 THEN '화요일'
        WHEN EXTRACT(DOW FROM assignment_date) = 3 THEN '수요일'
        WHEN EXTRACT(DOW FROM assignment_date) = 4 THEN '목요일'
        WHEN EXTRACT(DOW FROM assignment_date) = 5 THEN '금요일'
        WHEN EXTRACT(DOW FROM assignment_date) = 6 THEN '토요일'
    END as weekday_name,
    duty_type,
    primary_worker_id,
    backup_worker_id
FROM public.duty_assignments 
ORDER BY assignment_date DESC
LIMIT 50;
