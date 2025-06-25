
-- 벌당직 테이블 생성
CREATE TABLE public.penalty_duties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id BIGINT REFERENCES public.worker_list("일련번호") NOT NULL,
  violation_date DATE NOT NULL,
  violation_type TEXT NOT NULL,
  violation_details TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  penalty_status TEXT NOT NULL DEFAULT '대기' CHECK (penalty_status IN ('대기', '완료', '취소')),
  penalty_assigned_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX idx_penalty_duties_worker_id ON public.penalty_duties(worker_id);
CREATE INDEX idx_penalty_duties_status ON public.penalty_duties(penalty_status);
CREATE INDEX idx_penalty_duties_violation_date ON public.penalty_duties(violation_date);

-- Row Level Security 활성화
ALTER TABLE public.penalty_duties ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 생성
CREATE POLICY "Anyone can view penalty duties" 
  ON public.penalty_duties 
  FOR SELECT 
  USING (true);

-- 모든 사용자가 생성 가능하도록 정책 생성
CREATE POLICY "Anyone can create penalty duties" 
  ON public.penalty_duties 
  FOR INSERT 
  WITH CHECK (true);

-- 모든 사용자가 수정 가능하도록 정책 생성
CREATE POLICY "Anyone can update penalty duties" 
  ON public.penalty_duties 
  FOR UPDATE 
  USING (true);

-- 모든 사용자가 삭제 가능하도록 정책 생성
CREATE POLICY "Anyone can delete penalty duties" 
  ON public.penalty_duties 
  FOR DELETE 
  USING (true);
