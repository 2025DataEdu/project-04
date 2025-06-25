
import { PenaltyDuty, PenaltyDutyWithWorker } from '@/types/penalty';

export const penaltyDataUtils = {
  combinePenaltiesWithWorkers(penalties: PenaltyDuty[], workers: any[]): PenaltyDutyWithWorker[] {
    return penalties.map(penalty => {
      const worker = workers.find(w => w.일련번호 === penalty.worker_id);
      return {
        ...penalty,
        penalty_status: penalty.penalty_status as '대기' | '완료' | '취소',
        worker: worker ? {
          이름: worker.이름 || '',
          소속부서: worker.소속부서 || '',
          직급: worker.직급 || '',
          메일주소: worker.메일주소 || '',
          전화번호: worker.전화번호 || ''
        } : {
          이름: '',
          소속부서: '',
          직급: '',
          메일주소: '',
          전화번호: ''
        }
      };
    });
  }
};
