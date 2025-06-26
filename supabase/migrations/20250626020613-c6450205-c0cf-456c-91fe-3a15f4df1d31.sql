
-- 기존 벌당직 데이터의 지적자명을 위반일자의 당직자로 업데이트
UPDATE penalty_duties 
SET reported_by = COALESCE(worker_info.이름, '알 수 없음'),
    updated_at = now()
FROM (
  SELECT 
    pd.id as penalty_id,
    wl.이름
  FROM penalty_duties pd
  LEFT JOIN duty_assignments da ON da.assignment_date = pd.violation_date
  LEFT JOIN worker_list wl ON wl.일련번호 = da.primary_worker_id
) as worker_info
WHERE penalty_duties.id = worker_info.penalty_id;
