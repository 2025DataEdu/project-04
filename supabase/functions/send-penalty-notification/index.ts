
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PenaltyNotificationRequest {
  workerEmail: string;
  workerName: string;
  penaltyInfo: {
    violation_type: string;
    violation_details: string;
    violation_date: string;
    reported_by: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workerEmail, workerName, penaltyInfo }: PenaltyNotificationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "당직관리시스템 <onboarding@resend.dev>",
      to: [workerEmail],
      subject: "벌당직 통보 - 보안 위반 사항 알림",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #ec4899); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⚠️ 벌당직 통보</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">보안 위반 사항에 대한 벌당직이 부여되었습니다.</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">안녕하세요, ${workerName}님</h2>
            
            <p style="color: #666; line-height: 1.6;">
              순찰 중 발견된 보안 위반 사항으로 인해 벌당직이 부여되었음을 알려드립니다.
            </p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">위반 사항 상세</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">위반 일자:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${penaltyInfo.violation_date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">위반 유형:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${penaltyInfo.violation_type}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">상세 내용:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${penaltyInfo.violation_details}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">지적자:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${penaltyInfo.reported_by}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">📋 조치 안내</h3>
              <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>벌당직 일정은 별도로 통보될 예정입니다.</li>
                <li>향후 이러한 위반 사항이 재발하지 않도록 주의하시기 바랍니다.</li>
                <li>보안 규정을 준수하여 안전한 근무 환경 조성에 협조해 주세요.</li>
                <li>문의사항이 있으시면 당직 관리부서로 연락 바랍니다.</li>
              </ul>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
              이 메일은 당직관리시스템에서 자동으로 발송된 메일입니다.<br>
              문의사항이 있으시면 당직 관리부서로 연락하시기 바랍니다.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Penalty notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-penalty-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
