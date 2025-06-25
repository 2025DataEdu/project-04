
-- 당직 배정 테이블 생성
CREATE TABLE public.duty_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_date DATE NOT NULL,
  duty_type TEXT NOT NULL CHECK (duty_type IN ('평일야간', '주말주간', '주말야간')),
  primary_worker_id BIGINT REFERENCES public."근로자 리스트"("일련번호") NOT NULL,
  backup_worker_id BIGINT REFERENCES public."근로자 리스트"("일련번호") NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인덱스 생성 (성능 향상을 위해)
CREATE INDEX idx_duty_assignments_date ON public.duty_assignments(assignment_date);
CREATE INDEX idx_duty_assignments_type ON public.duty_assignments(duty_type);

-- 같은 날짜와 당직 유형에 중복 배정 방지
ALTER TABLE public.duty_assignments 
ADD CONSTRAINT unique_duty_per_date_type 
UNIQUE (assignment_date, duty_type);

-- Row Level Security 활성화 (공개 접근 허용)
ALTER TABLE public.duty_assignments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 생성
CREATE POLICY "Anyone can view duty assignments" 
  ON public.duty_assignments 
  FOR SELECT 
  USING (true);

-- 모든 사용자가 생성 가능하도록 정책 생성
CREATE POLICY "Anyone can create duty assignments" 
  ON public.duty_assignments 
  FOR INSERT 
  WITH CHECK (true);

-- 모든 사용자가 수정 가능하도록 정책 생성
CREATE POLICY "Anyone can update duty assignments" 
  ON public.duty_assignments 
  FOR UPDATE 
  USING (true);

-- 모든 사용자가 삭제 가능하도록 정책 생성
CREATE POLICY "Anyone can delete duty assignments" 
  ON public.duty_assignments 
  FOR DELETE 
  USING (true);
