
-- 민원 접수 테이블 생성
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  complainant_name TEXT NOT NULL,
  complainant_contact TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT '일반',
  status TEXT NOT NULL DEFAULT '접수',
  assigned_to TEXT,
  resolution_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 민원 해결방법 추천 테이블 생성
CREATE TABLE public.complaint_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  solution_title TEXT NOT NULL,
  solution_content TEXT NOT NULL,
  priority_score INTEGER NOT NULL DEFAULT 1,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_complaints_category ON public.complaints(category);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_created_at ON public.complaints(created_at);
CREATE INDEX idx_complaint_solutions_category ON public.complaint_solutions(category);

-- RLS 정책 활성화
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_solutions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능한 정책 (공개 시스템으로 가정)
CREATE POLICY "Everyone can view complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Everyone can insert complaints" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update complaints" ON public.complaints FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete complaints" ON public.complaints FOR DELETE USING (true);

CREATE POLICY "Everyone can view solutions" ON public.complaint_solutions FOR SELECT USING (true);
CREATE POLICY "Everyone can insert solutions" ON public.complaint_solutions FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update solutions" ON public.complaint_solutions FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete solutions" ON public.complaint_solutions FOR DELETE USING (true);

-- 샘플 해결방법 데이터 삽입
INSERT INTO public.complaint_solutions (category, keywords, solution_title, solution_content, priority_score) VALUES
('시설관리', ARRAY['조명', '전등', '불빛'], '조명 관련 문제 해결방법', '조명 점검 후 교체 또는 수리 진행. 전기 안전 점검 포함.', 3),
('소음', ARRAY['소음', '시끄러움', '층간소음'], '소음 문제 해결방법', '소음 측정 후 관련 규정 확인. 필요시 방음 조치 및 당사자 간 조정 진행.', 4),
('청소', ARRAY['청소', '쓰레기', '더러움'], '청소 관련 문제 해결방법', '청소 일정 점검 후 추가 청소 실시. 청소업체와 협의하여 개선방안 마련.', 2),
('주차', ARRAY['주차', '차량', '주차장'], '주차 관련 문제 해결방법', '주차 현황 점검 후 주차 규칙 안내. 필요시 주차 구역 재배치 검토.', 3);
