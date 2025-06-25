
import { supabase } from '@/integrations/supabase/client';
import { workerService } from './workerService';

export const penaltyEmailService = {
  async sendPenaltyNotificationEmail(workerId: number, penaltyInfo: {
    violation_type: string;
    violation_details: string;
    violation_date: string;
    reported_by: string;
  }) {
    try {
      const worker = await workerService.getWorkerById(workerId);

      if (!worker || !worker.메일주소) {
        console.error('Worker email not found');
        return;
      }

      const response = await supabase.functions.invoke('send-penalty-notification', {
        body: {
          workerEmail: worker.메일주소,
          workerName: worker.이름,
          penaltyInfo
        }
      });

      if (response.error) {
        console.error('Error sending email:', response.error);
      }
    } catch (error) {
      console.error('Error in sendPenaltyNotificationEmail:', error);
    }
  }
};
