
-- duty_reports 테이블의 외래 키 제약조건을 CASCADE DELETE로 변경
ALTER TABLE public.duty_reports 
DROP CONSTRAINT IF EXISTS duty_reports_assignment_id_fkey;

ALTER TABLE public.duty_reports 
ADD CONSTRAINT duty_reports_assignment_id_fkey 
FOREIGN KEY (assignment_id) 
REFERENCES public.duty_assignments(id) 
ON DELETE CASCADE;
