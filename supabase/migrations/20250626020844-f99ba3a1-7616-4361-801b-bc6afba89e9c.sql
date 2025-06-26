
-- duty_assignments 테이블에서 2025-06-01 데이터 조회
SELECT 
  da.*,
  pw.이름 as primary_worker_name,
  bw.이름 as backup_worker_name
FROM duty_assignments da
LEFT JOIN worker_list pw ON pw.일련번호 = da.primary_worker_id
LEFT JOIN worker_list bw ON bw.일련번호 = da.backup_worker_id
WHERE da.assignment_date = '2025-06-01';

-- duty_reports 테이블에서 2025-06-01 데이터 조회
SELECT 
  dr.*,
  wl.이름 as duty_worker_name,
  wl.소속부서 as duty_worker_department
FROM duty_reports dr
LEFT JOIN worker_list wl ON wl.일련번호 = dr.duty_worker_id
WHERE dr.report_date = '2025-06-01';
