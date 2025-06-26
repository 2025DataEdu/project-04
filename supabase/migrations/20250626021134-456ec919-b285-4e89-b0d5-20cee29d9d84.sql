
-- 현재 duty_assignments 테이블의 모든 6월 데이터 확인 (올바른 날짜 범위)
SELECT 
  da.assignment_date,
  da.duty_type,
  pw.이름 as primary_worker_name,
  bw.이름 as backup_worker_name,
  da.id
FROM duty_assignments da
LEFT JOIN worker_list pw ON pw.일련번호 = da.primary_worker_id
LEFT JOIN worker_list bw ON bw.일련번호 = da.backup_worker_id
WHERE da.assignment_date >= '2025-06-01' AND da.assignment_date <= '2025-06-30'
ORDER BY da.assignment_date;

-- 현재 duty_reports 테이블의 모든 6월 데이터 확인 (올바른 날짜 범위)
SELECT 
  dr.report_date,
  wl.이름 as duty_worker_name,
  wl.소속부서 as duty_worker_department,
  dr.id
FROM duty_reports dr
LEFT JOIN worker_list wl ON wl.일련번호 = dr.duty_worker_id
WHERE dr.report_date >= '2025-06-01' AND dr.report_date <= '2025-06-30'
ORDER BY dr.report_date;

-- 혹시 다른 연도 데이터인지 확인 (6월 1일만)
SELECT 
  da.assignment_date,
  pw.이름 as primary_worker_name,
  bw.이름 as backup_worker_name
FROM duty_assignments da
LEFT JOIN worker_list pw ON pw.일련번호 = da.primary_worker_id
LEFT JOIN worker_list bw ON bw.일련번호 = da.backup_worker_id
WHERE EXTRACT(MONTH FROM da.assignment_date) = 6 AND EXTRACT(DAY FROM da.assignment_date) = 1
ORDER BY da.assignment_date;
