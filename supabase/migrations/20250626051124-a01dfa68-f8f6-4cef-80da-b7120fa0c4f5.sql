
-- 민원 번호의 2024를 2025로 변경
UPDATE public.complaints 
SET complaint_number = REPLACE(complaint_number, '2024', '2025')
WHERE complaint_number LIKE '%2024%';
