// // src/services/aiEmailService.ts
// import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
// import {
//   GenerateEmailRequest,
//   GeneratedEmailData,
//   GeminiResponse,
//   EmailColors,
// } from "../../../common/IAiEmail.interface";

// export class AIEmailService {
//   private genAI: GoogleGenerativeAI;
//   private model: GenerativeModel;

//   constructor(apiKey: string) {
//     if (!apiKey) {
//       throw new Error("GEMINI_API_KEY is required");
//     }
//     this.genAI = new GoogleGenerativeAI(apiKey);
//     this.model = this.genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",
//     });
//   }

//   async generateEmail(
//     params: GenerateEmailRequest,
//   ): Promise<{ success: boolean; data?: GeneratedEmailData; error?: string }> {
//     const { eventName, eventDescription, channelName, additionalContext } =
//       params;

//     const prompt = this.buildPrompt(
//       eventName,
//       eventDescription || "",
//       channelName || "Email",
//       additionalContext || "",
//     );

//     try {
//       const result = await this.model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();

//       const parsedResponse = this.parseAIResponse(text);

//       if (parsedResponse) {
//         const wrappedTemplate = this.wrapWithStaticTemplate(
//           parsedResponse.body,
//           parsedResponse.colors,
//         );

//         return {
//           success: true,
//           data: {
//             subject: parsedResponse.subject,
//             templateBody: wrappedTemplate,
//             colors: parsedResponse.colors,
//           },
//         };
//       }

//       return this.getFallbackTemplate(eventName);
//     } catch (error) {
//       console.error("AI Error:", error);
//       if (error.status === 503 ) {
//       console.warn("AI Service busy, switching to fallback template.");
//       return this.getFallbackTemplate(params.eventName);
//     }
//     if(error.status === 429){
//       console.warn("This is error about many request")
//     }
//      if(error.status === 500){
//       console.warn("Internal Server Error")
//     }
      
//       return this.getFallbackTemplate(eventName);
//     }
//   }

//   private buildPrompt(
//     eventName: string,
//     eventDescription: string,
//     channelName: string,
//     additionalContext: string,
//   ): string {
//     return `
//       You are a professional email template generator. Generate a COMPLETE email template for:
      
//       EVENT TYPE: ${eventName}
//       EVENT DESCRIPTION: ${eventDescription}
//       CHANNEL: ${channelName}
//       ${additionalContext ? `EXTRA CONTEXT: ${additionalContext}` : ""}
      
//       IMPORTANT RULES:
//       1. Generate ONLY the email BODY content (no header, no footer)
//       2. Use professional color scheme that matches the event type
//       3. Use inline CSS for email client compatibility
//       4. Make it responsive (mobile-friendly)
//       5. Include these placeholder variables: {{userName}}, {{userEmail}}, {{companyName}}
//       6. Add a clear call-to-action button
//       7. Keep the design modern and clean
      
//       Return ONLY valid JSON in this exact format:
//       {
//         "subject": "Compelling subject line here",
//         "body": "HTML email body with inline CSS",
//         "colors": {
//           "primary": "#hexcode",
//           "secondary": "#hexcode",
//           "accent": "#hexcode"
//         }
//       }
      
//       Generate now:
//     `;
//   }

//   private parseAIResponse(text: string): GeminiResponse | null {
//     try {
//       const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
//       const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

//       if (jsonMatch) {
//         return JSON.parse(jsonMatch[0]) as GeminiResponse;
//       }
//       return null;
//     } catch (error) {
//       console.error("Parse Error:", error);
//       return null;
//     }
//   }

//   private wrapWithStaticTemplate(content: string, colors: EmailColors): string {
//     const primaryColor = colors.primary || "#1E1F4B";
//     const secondaryColor = colors.secondary || "#6C63FF";

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Email Template</title>
//         <style>
//           @media only screen and (max-width: 600px) {
//             .container { width: 100% !important; }
//             .mobile-padding { padding: 20px !important; }
//             .btn { display: block !important; width: 100% !important; }
//           }
//         </style>
//       </head>
//       <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
//         <center style="width: 100%;">
//           <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
//             <tr>
//               <td align="center" style="padding: 20px;">
//                 <table width="600" class="container" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  
//                   <!-- STATIC HEADER with Logo -->
//                   <tr>
//   <td style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); padding: 30px 20px; text-align: center;">
    
//     <h1 style="color: #ffffff; margin: 10px 0 0; font-size: 24px; font-weight: 600;">companyName</h1>
//   </td>
// </tr>
                  
//                   <!-- DYNAMIC CONTENT (AI Generated) -->
//                   <tr>
//                     <td style="padding: 40px 30px;">
//                       ${content}
//                     </td>
//                   </tr>
                  
//                   <!-- STATIC FOOTER with Signature -->
//                   <tr>
//                     <td style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
//                       <table width="100%" cellpadding="0" cellspacing="0">
//                         <tr>
//                           <td style="text-align: center;">
//                             <p style="color: #333333; margin: 0 0 10px; font-size: 14px;">
//                               Best regards,<br>
//                               <strong>{{companyName}} Team</strong>
//                             </p>
//                             <div style="margin: 20px 0;">
//                               <a href="#" style="color: ${secondaryColor}; text-decoration: none; margin: 0 10px; font-size: 12px;">Facebook</a>
//                               <a href="#" style="color: ${secondaryColor}; text-decoration: none; margin: 0 10px; font-size: 12px;">Twitter</a>
//                               <a href="#" style="color: ${secondaryColor}; text-decoration: none; margin: 0 10px; font-size: 12px;">LinkedIn</a>
//                             </div>
//                             <p style="color: #6c757d; margin: 0; font-size: 11px;">
//                               © 2024 {{companyName}}. All rights reserved.
//                             </p>
//                             <p style="margin: 10px 0 0;">
//                               <a href="#" style="color: ${secondaryColor}; text-decoration: none; font-size: 11px;">Privacy Policy</a> | 
//                               <a href="#" style="color: ${secondaryColor}; text-decoration: none; font-size: 11px;">Unsubscribe</a>
//                             </p>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
                  
//                   <!-- STATIC SIGNATURE LINE -->
//                   <tr>
//                     <td style="background-color: ${primaryColor}; padding: 12px; text-align: center;">
//                       <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 10px;">
//                         This email was sent to {{userEmail}}
//                       </p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </table>
//           </table>
//         </center>
//       </body>
//       </html>
//     `;
//   }

//   private getFallbackTemplate(eventName: string): {
//     success: boolean;
//     data?: GeneratedEmailData;
//     error?: string;
//   } {
//     const fallbackColors: EmailColors = {
//       primary: "#1E1F4B",
//       secondary: "#6C63FF",
//     };

//     const fallbackBody = `
//       <h2 style="color: #1E1F4B; margin-top: 0;">Dear {{userName}},</h2>
//       <p style="color: #333333; line-height: 1.6; margin-bottom: 20px;">
//         This is a notification regarding ${eventName}. We wanted to keep you informed about the latest updates getFallbackTemplate.
//       </p>
//       <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <p style="margin: 0; color: #1E1F4B;">For more details, please click the button below.</p>
//       </div>
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="#" class="btn" style="background: linear-gradient(135deg, #1E1F4B 0%, #6C63FF 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">View Details</a>
//       </div>
//       <p style="color: #333333; line-height: 1.6;">Thank you for your attention.</p>
//     `;

//     return {
//       success: true,
//       data: {
//         subject: `Important Update: ${eventName}`,
//         templateBody: this.wrapWithStaticTemplate(fallbackBody, fallbackColors),
//         colors: fallbackColors,
//       },
//     };
//   }
// }

// export default AIEmailService;


// src/services/aiTemplate.service.ts
// src/services/aiTemplate.service.ts
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  GenerateTemplateRequest,
  GeneratedTemplateData,
  GeminiParsedResponse,
  EmailColors,
  TemplateChannel,
} from '../../../common/IAiEmail.interface';

export class AITemplateService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.GEMINI_API_MODEL || 'gemini-1.5-flash' 
    });
  }

  async generateTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    try {
      switch (params.channelType) {
        case 'email':    return await this.generateEmailTemplate(params);
        case 'sms':      return await this.generateSMSTemplate(params);
        case 'whatsapp': return await this.generateWhatsAppTemplate(params);
        default:         return await this.generateEmailTemplate(params);
      }
    } catch (error: any) {
      console.error(`[AITemplateService] Error:`, error);
      return { success: false, error: error.message || 'Generation failed' };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // EMAIL TEMPLATE - AI generates everything except logo/social
  // ─────────────────────────────────────────────────────────────
  private async generateEmailTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = this.buildEmailPrompt(params);

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const parsed = this.parseJSONResponse(text);

      if (!parsed || !parsed.body || !parsed.subject) {
        throw new Error('Invalid AI response');
      }

      // Use AI-generated colors directly
      const colors: EmailColors = {
        primary: parsed.colors?.primary || '#1E1F4B',
        secondary: parsed.colors?.secondary || '#6C63FF',
        accent: parsed.colors?.accent || '#F59E0B',
      };

      // Wrap with dynamic template (logo & social come from frontend)
      const fullHTML = this.buildEmailHTML(parsed.body, colors, params);

      return {
        success: true,
        data: {
          subject: parsed.subject,
          templateBody: fullHTML,
          channelType: 'email',
          colors,
        },
      };
    } catch (error: any) {
      console.error('Email generation error:', error);
      return { success: false, error: error.message || 'Failed to generate email' };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SMS TEMPLATE
  // ─────────────────────────────────────────────────────────────
  private async generateSMSTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = this.buildSMSPrompt(params);

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();

      const cleanText = text
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .replace(/^["']|["']$/g, '')
        .trim();

      if (!cleanText) throw new Error('Empty SMS response');

      return {
        success: true,
        data: {
          subject: `SMS: ${params.eventName}`,
          templateBody: cleanText,
          channelType: 'sms',
        },
      };
    } catch (error: any) {
      console.error('SMS generation error:', error);
      return { success: false, error: error.message || 'Failed to generate SMS' };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // WHATSAPP TEMPLATE
  // ─────────────────────────────────────────────────────────────
  private async generateWhatsAppTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = this.buildWhatsAppPrompt(params);

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();

      const cleanText = text
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();

      if (!cleanText) throw new Error('Empty WhatsApp response');

      return {
        success: true,
        data: {
          subject: `WhatsApp: ${params.eventName}`,
          templateBody: cleanText,
          channelType: 'whatsapp',
        },
      };
    } catch (error: any) {
      console.error('WhatsApp generation error:', error);
      return { success: false, error: error.message || 'Failed to generate WhatsApp message' };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // AI PROMPT BUILDER - Let AI decide everything
  // ─────────────────────────────────────────────────────────────
  private buildEmailPrompt(params: GenerateTemplateRequest): string {
    const variableList = params.variables
      .map((v) => `{{${v.key}}} — ${v.description || v.label || v.key}`)
      .join('\n');

    return `You are a world-class HTML email designer for a professional business.

Generate a COMPLETE email body for:
- Event Name: ${params.eventName}
- Event Description: ${params.eventDescription || 'Not provided'}
- Company Name: ${params.companyName || 'Our Company'}
${params.additionalContext ? `- Extra Context: ${params.additionalContext}` : ''}

AVAILABLE VARIABLES (use ALL of them naturally):
${variableList}

REQUIREMENTS:
1. Create a UNIQUE design for this specific event
2. Use inline CSS only (email client compatible)
3. Make it responsive and mobile-friendly
4. Professional, modern, and visually appealing
5. Use ALL variables naturally in the content
6. Include a clear call-to-action button
7. Choose appropriate colors for this event type

Return ONLY valid JSON:
{
  "subject": "compelling, personalized subject line for ${params.eventName}",
  "body": "HTML email body with inline CSS (no header/footer, just the content)",
  "colors": {
    "primary": "#hexcode",
    "secondary": "#hexcode", 
    "accent": "#hexcode"
  }
}`;
  }

  private buildSMSPrompt(params: GenerateTemplateRequest): string {
    const variableList = params.variables.map((v) => `{{${v.key}}}`).join(', ');

    return `Generate an SMS message for:
- Event: ${params.eventName}
- Description: ${params.eventDescription || ''}
${params.additionalContext ? `- Context: ${params.additionalContext}` : ''}

Available variables: ${variableList}

REQUIREMENTS:
1. MAXIMUM 160 characters
2. Start with [${params.companyName || 'Company'}]
3. Use relevant variables
4. Clear call to action
5. Return ONLY the plain text message

SMS message:`;
  }

  private buildWhatsAppPrompt(params: GenerateTemplateRequest): string {
    const variableList = params.variables.map((v) => `{{${v.key}}}`).join(', ');

    return `Generate a WhatsApp message for:
- Event: ${params.eventName}
- Description: ${params.eventDescription || ''}
${params.additionalContext ? `- Context: ${params.additionalContext}` : ''}

Available variables: ${variableList}

REQUIREMENTS:
1. Use *bold*, _italic_, ~strikethrough~
2. Use 2-3 relevant emojis
3. Professional yet friendly tone
4. Return ONLY the message text

WhatsApp message:`;
  }

  // ─────────────────────────────────────────────────────────────
  // HTML WRAPPER - Only logo, social icons, website URLs from frontend
  // NO static colors, NO static design decisions
  // ─────────────────────────────────────────────────────────────
  private buildEmailHTML(
    bodyContent: string,
    colors: EmailColors,
    params: GenerateTemplateRequest,
  ): string {
    const {
      companyName = process.env.COMPANY_NAME || "Humber Mobility",
      companyWebsite = process.env.COMPANY_WEBSITE || "https://onyxtech.co.uk/",
      companyAddress = process.env.COMPANY_ADDRESS || "123 Business Street, London, UK",
      companyLogoUrl = `${process.env.DEV_BASE_URL}/logo.png`,
      socialLinks = {},
    } = params;

    const primary = colors.primary;
    const secondary = colors.secondary;
    const accent = colors.accent || '#F59E0B';
    const headerGradient = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;

    // Logo section - from frontend
    const logoSrc = companyLogoUrl || '';
    const logoSection = logoSrc
      ? `<img src="${logoSrc}" alt="${companyName}" 
           style="max-width:140px; height:auto; display:block; margin:0 auto 16px auto; border-radius:12px;">`
      : `<div style="display:inline-block; background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.4); border-radius:16px; padding:10px 28px; margin-bottom:16px;">
           <span style="font-family:'Segoe UI',Arial,sans-serif; font-size:22px; font-weight:800; color:#ffffff;">${companyName}</span>
         </div>`;

    // Social links - from frontend
    const facebookUrl = (socialLinks as any)?.facebook || companyWebsite;
    const linkedinUrl = (socialLinks as any)?.linkedin || companyWebsite;
    const twitterUrl = (socialLinks as any)?.twitter || companyWebsite;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${companyName} - ${params.eventName}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .social-icons td { padding: 0 8px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="container"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);">

        <!-- Top Accent Bar -->
        <tr>
          <td style="background:${accent};height:5px;font-size:0;line-height:0;">&nbsp;<\/td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="background:${headerGradient};padding:40px 40px 36px;text-align:center;">
            ${logoSection}
            <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:500;letter-spacing:2px;text-transform:uppercase;">
              ${params.eventName}
            </p>
          <\/td>
        </tr>

        <!-- Wave Divider -->
        <tr>
          <td style="background:${primary};padding:0;line-height:0;font-size:0;">
            <svg viewBox="0 0 600 28" preserveAspectRatio="none" style="width:100%;height:28px;display:block;">
              <path d="M0,28 C200,0 400,0 600,28 L600,28 L0,28 Z" fill="#ffffff"/>
            </svg>
          <\/td>
        </tr>

        <!-- AI Generated Content -->
        <tr>
          <td style="padding:40px 30px;background:#ffffff;">
            ${bodyContent}
          <\/td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background:#e8ecf0;"><\/div>
          <\/td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:32px 40px;text-align:center;">

            <!-- Social Icons - Centered -->
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px auto;">
              <tr>
                <td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" align="center" class="social-icons">
                    <tr>
                      <td style="padding:0 10px;">
                        <a href="${facebookUrl}" target="_blank" 
                          style="display:inline-block;width:38px;height:38px;border-radius:50%;background:${primary};
                                 color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;line-height:38px;">
                          f
                        </a>
                      <\/td>
                      <td style="padding:0 10px;">
                        <a href="${linkedinUrl}" target="_blank"
                          style="display:inline-block;width:38px;height:38px;border-radius:50%;background:${primary};
                                 color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;line-height:38px;">
                          in
                        </a>
                      <\/td>
                      <td style="padding:0 10px;">
                        <a href="${twitterUrl}" target="_blank"
                          style="display:inline-block;width:38px;height:38px;border-radius:50%;background:${primary};
                                 color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;line-height:38px;">
                          𝕏
                        </a>
                      <\/td>
                    </tr>
                  </table>
                <\/td>
              </tr>
            </table>

            <!-- Company Name -->
            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:${primary};">${companyName}</p>
            
            <!-- Address (if provided) -->
            ${companyAddress ? `<p style="margin:0 0 20px;font-size:13px;color:#64748b;">${companyAddress}</p>` : ''}
            
            <!-- Footer Links -->
            <p style="margin:0 0 20px;font-size:13px;">
              <a href="${companyWebsite}" target="_blank" style="color:${secondary};text-decoration:none;font-weight:600;margin:0 8px;">Visit Website</a>
              <span style="color:#cbd5e1;">|</span>
              <a href="${companyWebsite}/privacy" target="_blank" style="color:${secondary};text-decoration:none;font-weight:600;margin:0 8px;">Privacy Policy</a>
              <span style="color:#cbd5e1;">|</span>
              <a href="${companyWebsite}/unsubscribe" target="_blank" style="color:${secondary};text-decoration:none;font-weight:600;margin:0 8px;">Unsubscribe</a>
            </p>

            <!-- Copyright -->
            <p style="margin:0;font-size:11px;color:#94a3b8;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          <\/td>
        </tr>

        <!-- Bottom Bar -->
        <tr>
          <td style="background:${headerGradient};padding:14px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.65);font-size:11px;">
              Sent to {{email}} &bull; 
              <a href="${companyWebsite}/unsubscribe" style="color:rgba(255,255,255,0.85);text-decoration:underline;">Unsubscribe</a>
            </p>
          <\/td>
        </tr>

      </table>
    <\/td>
  </tr>
</table>

</body>
</html>`;
  }

  // ─────────────────────────────────────────────────────────────
  // JSON Parser
  // ─────────────────────────────────────────────────────────────
  private parseJSONResponse(text: string): GeminiParsedResponse | null {
    try {
      const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return null;
    } catch (err) {
      console.error('[AITemplateService] JSON parse failed:', err);
      return null;
    }
  }
}

export default AITemplateService;