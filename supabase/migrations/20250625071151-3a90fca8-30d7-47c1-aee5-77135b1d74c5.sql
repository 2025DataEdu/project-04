
-- 당직 보고서 데이터를 저장할 테이블 생성
CREATE TABLE public.duty_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date DATE NOT NULL,
  assignment_id UUID REFERENCES public.duty_assignments(id),
  duty_worker_id BIGINT REFERENCES public.worker_list(일련번호),
  instruction_datetime TEXT,
  instruction_content TEXT,
  instruction_abnormalities TEXT DEFAULT '특이사항 없음',
  instruction_handover TEXT,
  patrol_datetime TEXT,
  patrol_content TEXT,
  patrol_actions TEXT,
  patrol_notes TEXT,
  handover_issues TEXT DEFAULT '없음',
  handover_pending TEXT,
  handover_notes TEXT,
  handover_completion_rate INTEGER DEFAULT 85,
  report_types TEXT[] DEFAULT ARRAY['지시사항', '순찰', '인수인계'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX idx_duty_reports_date ON public.duty_reports(report_date);
CREATE INDEX idx_duty_reports_assignment ON public.duty_reports(assignment_id);

-- RLS 정책 설정
ALTER TABLE public.duty_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view duty reports" 
  ON public.duty_reports 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create duty reports" 
  ON public.duty_reports 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update duty reports" 
  ON public.duty_reports 
  FOR UPDATE 
  USING (true);

-- 먼저 6월 당직 배정 데이터를 생성 (실제 근로자 ID 사용)
INSERT INTO public.duty_assignments (assignment_date, duty_type, primary_worker_id, backup_worker_id) VALUES
('2024-06-01', '평일야간', 1, 2),
('2024-06-02', '평일야간', 3, 4),
('2024-06-03', '평일야간', 5, 6),
('2024-06-05', '평일야간', 7, 8),
('2024-06-06', '평일야간', 9, 10),
('2024-06-07', '주말야간', 11, 12),
('2024-06-08', '주말주간', 13, 14),
('2024-06-10', '평일야간', 15, 1),
('2024-06-11', '평일야간', 2, 3),
('2024-06-12', '평일야간', 4, 5),
('2024-06-13', '평일야간', 6, 7),
('2024-06-14', '주말야간', 8, 9),
('2024-06-15', '주말주간', 10, 11),
('2024-06-17', '평일야간', 12, 13),
('2024-06-18', '평일야간', 14, 15),
('2024-06-19', '평일야간', 1, 2),
('2024-06-20', '평일야간', 3, 4),
('2024-06-21', '주말야간', 5, 6),
('2024-06-22', '주말주간', 7, 8),
('2024-06-24', '평일야간', 9, 10),
('2024-06-25', '평일야간', 11, 12),
('2024-06-26', '평일야간', 13, 14),
('2024-06-27', '평일야간', 15, 1),
('2024-06-28', '주말야간', 2, 3),
('2024-06-29', '주말주간', 4, 5);

-- 당직 보고서 샘플 데이터 생성 (당직 배정과 연동)
INSERT INTO public.duty_reports (
  report_date, assignment_id, duty_worker_id, instruction_datetime, instruction_content, 
  instruction_handover, patrol_datetime, patrol_content, patrol_actions, 
  patrol_notes, handover_pending, handover_notes, handover_completion_rate
) 
SELECT 
  da.assignment_date,
  da.id,
  da.primary_worker_id,
  da.assignment_date::text || ', 당직사령관 지시',
  CASE 
    WHEN EXTRACT(DOW FROM da.assignment_date) IN (0, 6) THEN '주말 특별 점검, 각 시도 재난 정보 확인하여 산불대비, 보안 강화'
    ELSE '각 시도 재난 정보 확인하여 산불대비, 근무 규정 확인'
  END,
  '다음 당직자에게 당일 지시사항 및 순찰 결과 전달',
  da.assignment_date::text || ' 17:00-18:00',
  '정기 업무 순찰 실시',
  '시설 전반 점검 완료, 보안 상태 확인',
  CASE 
    WHEN da.duty_type = '주말야간' THEN '야간 특별 순찰 실시, 산불대비 관련 지시사항에 따른 추가 점검'
    WHEN da.duty_type = '주말주간' THEN '주말 주간 점검, 방문객 안전 관리'
    ELSE '산불대비 관련 지시사항에 따른 추가 점검 실시'
  END,
  CASE 
    WHEN EXTRACT(DOW FROM da.assignment_date) IN (0, 6) THEN '3건의 대기 중인 업무'
    WHEN RANDOM() > 0.7 THEN '1건의 대기 중인 업무'
    ELSE '2건의 대기 중인 업무'
  END,
  CASE 
    WHEN da.duty_type = '주말야간' THEN '야간 보안 강화 필요, 산불대비 상황 지속 모니터링, 재난 정보 확인 결과 공유'
    WHEN da.duty_type = '주말주간' THEN '주말 방문객 관리 강화, 시설 안전 점검 결과 공유'
    ELSE '산불대비 상황 지속 모니터링 필요, 재난 정보 확인 결과 공유'
  END,
  CASE 
    WHEN RANDOM() > 0.8 THEN 95
    WHEN RANDOM() > 0.6 THEN 90
    WHEN RANDOM() > 0.3 THEN 85
    ELSE 80
  END
FROM public.duty_assignments da
WHERE da.assignment_date >= '2024-06-01' AND da.assignment_date <= '2024-06-30';
