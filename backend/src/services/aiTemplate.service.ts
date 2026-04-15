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
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  GenerateTemplateRequest,
  GeneratedTemplateData,
  GeminiParsedResponse,
  EmailColors,
  TemplateChannel,
  VariableItem,
} from '../../../common/IAiEmail.interface';

export class AITemplateService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model:  'gemini-2.5-flash',
      

    });
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC: Main entry point
  // ─────────────────────────────────────────────────────────────
  async generateTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const { channelType } = params;

    try {
      switch (channelType) {
        case 'email':
          return await this.generateEmailTemplate(params);
        case 'sms':
          return await this.generateSMSTemplate(params);
        case 'whatsapp':
          return await this.generateWhatsAppTemplate(params);
        default:
          return await this.generateEmailTemplate(params);
      }
    } catch (error) {
      console.error(`[AITemplateService] Error generating ${channelType} template:`, error);
      return this.getFallbackTemplate(channelType, params.eventName);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // EMAIL TEMPLATE GENERATOR - UPDATED WITH EVENT-BASED DESIGN
  // ─────────────────────────────────────────────────────────────
  private async generateEmailTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = this.buildEmailPrompt(params);

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const parsed = this.parseJSONResponse(text);

      if (!parsed) return this.getEmailFallback(params);

      // Get event-based colors
      const colors = this.getEventBasedColors(params.eventName, parsed.colors);

      // Get event-based design layout
      const designLayout = this.getEventBasedDesign(params.eventName);

      const fullHTML = this.buildEmailHTML(parsed.body, colors, params, designLayout);

      return {
        success: true,
        data: {
          subject: parsed.subject || `${params.eventName} Notification`,
          templateBody: fullHTML,
          channelType: 'email',
          colors,
        },
      };
    } catch (error) {
      if(error.status === 429){
         console.warn("This is error about many request")
      }
      if(error.status === 503) {
        console.warn("AI Service busy, switching to fallback template.");
      }
      if(error.status === 500){
        console.warn("Internal server error")
      }
      console.error('Email generation error:', error);
      return this.getEmailFallback(params);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // NEW: Get event-based color scheme
  // ─────────────────────────────────────────────────────────────
  private getEventBasedColors(eventName: string, aiColors?: any): EmailColors {
    const eventLower = eventName.toLowerCase();
    
    // Predefined color schemes for different event types
    const colorSchemes: Record<string, EmailColors> = {
      // Welcome & Registration Events
      welcome: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#F59E0B' },
      register: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#F59E0B' },
      signup: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#F59E0B' },
      
      // Payment & Invoice Events
      payment: { primary: '#047857', secondary: '#10B981', accent: '#FBBF24' },
      invoice: { primary: '#047857', secondary: '#10B981', accent: '#FBBF24' },
      transaction: { primary: '#047857', secondary: '#10B981', accent: '#FBBF24' },
      
      // Support & Complaint Events
      support: { primary: '#B45309', secondary: '#F59E0B', accent: '#EF4444' },
      complaint: { primary: '#B45309', secondary: '#F59E0B', accent: '#EF4444' },
      issue: { primary: '#B45309', secondary: '#F59E0B', accent: '#EF4444' },
      
      // Promotional & Marketing Events
      promo: { primary: '#6D28D9', secondary: '#8B5CF6', accent: '#EC4899' },
      marketing: { primary: '#6D28D9', secondary: '#8B5CF6', accent: '#EC4899' },
      offer: { primary: '#6D28D9', secondary: '#8B5CF6', accent: '#EC4899' },
      
      // Reminder Events
      reminder: { primary: '#3730A3', secondary: '#6366F1', accent: '#F59E0B' },
      alert: { primary: '#3730A3', secondary: '#6366F1', accent: '#F59E0B' },
      notification: { primary: '#3730A3', secondary: '#6366F1', accent: '#F59E0B' },
      
      // Security Events
      security: { primary: '#991B1B', secondary: '#DC2626', accent: '#F97316' },
      password: { primary: '#991B1B', secondary: '#DC2626', accent: '#F97316' },
      login: { primary: '#991B1B', secondary: '#DC2626', accent: '#F97316' },
      
      // Birthday & Celebration
      birthday: { primary: '#BE185D', secondary: '#EC4899', accent: '#FBBF24' },
      celebration: { primary: '#BE185D', secondary: '#EC4899', accent: '#FBBF24' },
      anniversary: { primary: '#BE185D', secondary: '#EC4899', accent: '#FBBF24' },
      
      // Default
      default: { primary: '#1E1F4B', secondary: '#6C63FF', accent: '#F59E0B' }
    };
    
    // Find matching color scheme
    let scheme = colorSchemes.default;
    for (const [key, colors] of Object.entries(colorSchemes)) {
      if (eventLower.includes(key)) {
        scheme = colors;
        break;
      }
    }
    
    // If AI provided colors, use them but with event-based primary
    if (aiColors) {
      return {
        primary: scheme.primary,
        secondary: aiColors.secondary || scheme.secondary,
        accent: aiColors.accent || scheme.accent,
      };
    }
    
    return scheme;
  }

  // ─────────────────────────────────────────────────────────────
  // NEW: Get event-based design layout
  // ─────────────────────────────────────────────────────────────
  private getEventBasedDesign(eventName: string): {
    headerStyle: string;
    buttonStyle: string;
    layout: string;
    icon: string;
  } {
    const eventLower = eventName.toLowerCase();
    
    if (eventLower.includes('welcome') || eventLower.includes('register')) {
      return {
        headerStyle: 'celebration',
        buttonStyle: 'rounded-full',
        layout: 'centered',
        icon: '🎉'
      };
    } else if (eventLower.includes('payment') || eventLower.includes('invoice')) {
      return {
        headerStyle: 'professional',
        buttonStyle: 'rounded-lg',
        layout: 'standard',
        icon: '💰'
      };
    } else if (eventLower.includes('support') || eventLower.includes('complaint')) {
      return {
        headerStyle: 'supportive',
        buttonStyle: 'rounded-md',
        layout: 'standard',
        icon: '🤝'
      };
    } else if (eventLower.includes('promo') || eventLower.includes('offer')) {
      return {
        headerStyle: 'promotional',
        buttonStyle: 'rounded-full',
        layout: 'centered',
        icon: '✨'
      };
    } else if (eventLower.includes('reminder')) {
      return {
        headerStyle: 'minimal',
        buttonStyle: 'rounded-lg',
        layout: 'standard',
        icon: '⏰'
      };
    } else if (eventLower.includes('security')) {
      return {
        headerStyle: 'serious',
        buttonStyle: 'rounded-md',
        layout: 'standard',
        icon: '🔒'
      };
    } else if (eventLower.includes('birthday') || eventLower.includes('celebration')) {
      return {
        headerStyle: 'festive',
        buttonStyle: 'rounded-full',
        layout: 'centered',
        icon: '🎂'
      };
    }
    
    return {
      headerStyle: 'professional',
      buttonStyle: 'rounded-lg',
      layout: 'standard',
      icon: '📧'
    };
  }

  // ─────────────────────────────────────────────────────────────
  // UPDATED PROMPT - More specific about design variation
  // ─────────────────────────────────────────────────────────────
  private buildEmailPrompt(params: GenerateTemplateRequest): string {
    const variableList = params.variables
      .map((v) => `{{${v.key}}} — ${v.label || v.key}`)
      .join('\n');

    // Get design style based on event
    const designStyle = this.getDesignStyleDescription(params.eventName);

    return `
You are a world-class HTML email designer and copywriter for a professional business.

Generate a UNIQUE and DIFFERENT email template for:
- Event: ${params.eventName}
- Description: ${params.eventDescription || 'Not provided'}
- Company: ${params.companyName || 'Our Company'}
${params.additionalContext ? `- Extra Context: ${params.additionalContext}` : ''}

DESIGN STYLE REQUIRED: ${designStyle}

AVAILABLE VARIABLES (you MUST use these exactly as shown — wrap in double curly braces):
${variableList}

CRITICAL REQUIREMENTS FOR UNIQUE DESIGN:
1. Create a COMPLETELY DIFFERENT layout for this event type - DO NOT reuse the same structure
2. Change the arrangement of elements based on event type:
   - Welcome events: Put greeting first, then benefits, then CTA
   - Payment events: Put amount/details first, then confirmation, then CTA
   - Support events: Put empathy statement first, then solution, then action
   - Promo events: Put offer first, then excitement, then CTA button
   - Reminder events: Put time/date first, then what to do, then CTA

3. Vary the visual elements:
   - Use different card layouts (single column, two column, grid)
   - Change button styles (rounded, pill, outlined)
   - Vary spacing and padding
   - Use different divider styles (dots, lines, waves)

4. Content tone must match event type:
   - Welcome: Warm, excited, appreciative
   - Payment: Professional, clear, reassuring
   - Support: Empathetic, helpful, solution-oriented
   - Promo: Energetic, urgent, benefit-focused
   - Reminder: Clear, concise, action-oriented

5. Use inline CSS only
6. Must include ALL provided variables naturally
7. Include clear CTA button with appropriate text for the event

Return ONLY this JSON structure:
{
  "subject": "compelling subject line that matches ${params.eventName} and will drive opens",
  "body": "complete HTML body content with unique layout and inline CSS",
  "colors": {
    "primary": "#hexcode (main brand color matching event type)",
    "secondary": "#hexcode (complementary color)",
    "accent": "#hexcode (highlight color)"
  }
}`;
  }

  private getDesignStyleDescription(eventName: string): string {
    const eventLower = eventName.toLowerCase();
    
    if (eventLower.includes('welcome') || eventLower.includes('register')) {
      return `WELCOME/REGISTRATION STYLE: Create a warm, celebratory layout with a hero image area, centered greeting, bullet points of benefits, and a prominent "Get Started" button. Use rounded corners and soft gradients.`;
    } else if (eventLower.includes('payment') || eventLower.includes('invoice')) {
      return `PAYMENT/INVOICE STYLE: Create a professional, financial layout with a clear amount box, transaction details table, due date highlighted, and a "Pay Now" button. Use clean lines and subtle shadows.`;
    } else if (eventLower.includes('support') || eventLower.includes('complaint')) {
      return `SUPPORT STYLE: Create an empathetic, helpful layout with a personal message from support, solution steps numbered, contact information box, and a "Contact Support" button. Use calming colors.`;
    } else if (eventLower.includes('promo') || eventLower.includes('offer')) {
      return `PROMOTIONAL STYLE: Create an exciting, urgent layout with a discount badge, countdown timer feel, testimonial quote, and a large "Shop Now" button. Use vibrant colors and bold typography.`;
    } else if (eventLower.includes('reminder')) {
      return `REMINDER STYLE: Create a clean, direct layout with date/time prominently displayed, preparation checklist, and a "Confirm Attendance" button. Use clear spacing and high contrast.`;
    } else if (eventLower.includes('security')) {
      return `SECURITY STYLE: Create a serious, trustworthy layout with security badge icon, IP address/location info, action verification steps, and "Secure Account" button. Use trustworthy blue/red colors.`;
    } else if (eventLower.includes('birthday') || eventLower.includes('celebration')) {
      return `CELEBRATION STYLE: Create a festive, joyful layout with confetti elements, personalized greeting, special offer box, and a "Claim Gift" button. Use warm, celebratory colors.`;
    }
    
    return `PROFESSIONAL STYLE: Create a balanced, professional layout with clean typography, subtle borders, proper spacing, and a clear hierarchy. Use a standard card-based design.`;
  }

  // ─────────────────────────────────────────────────────────────
  // SMS & WhatsApp methods remain the same
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

      return {
        success: true,
        data: {
          subject: `SMS: ${params.eventName}`,
          templateBody: cleanText,
          channelType: 'sms',
        },
      };
    } catch (error) {
      return {
        success: true,
        data: {
          subject: `SMS: ${params.eventName}`,
          templateBody: `[${params.companyName || 'Company'}] ${params.eventName}: ${params.eventDescription?.substring(0, 100) || 'Important update'}. ${params.companyWebsite || ''}`,
          channelType: 'sms',
        },
      };
    }
  }

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

      return {
        success: true,
        data: {
          subject: `WhatsApp: ${params.eventName}`,
          templateBody: cleanText,
          channelType: 'whatsapp',
        },
      };
    } catch (error) {
      const eventIcon = this.getEventIcon(params.eventName);
      return {
        success: true,
        data: {
          subject: `WhatsApp: ${params.eventName}`,
          templateBody: `${eventIcon} *${params.companyName || 'Company'} Update*\n\nHello *{{customerName}}*,\n\n📌 *${params.eventName}*\n${params.eventDescription || 'We have an important update for you.'}\n\n🔗 ${params.companyWebsite || ''}\n\n_Thank you_`,
          channelType: 'whatsapp',
        },
      };
    }
  }

  private getEventIcon(eventName: string): string {
    const eventLower = eventName.toLowerCase();
    if (eventLower.includes('welcome')) return '👋';
    if (eventLower.includes('payment')) return '💰';
    if (eventLower.includes('support')) return '🤝';
    if (eventLower.includes('promo')) return '✨';
    if (eventLower.includes('reminder')) return '⏰';
    if (eventLower.includes('security')) return '🔒';
    if (eventLower.includes('birthday')) return '🎂';
    return '📧';
  }

  // ─────────────────────────────────────────────────────────────
  // SMS and WhatsApp Prompts remain the same
  // ─────────────────────────────────────────────────────────────
  private buildSMSPrompt(params: GenerateTemplateRequest): string {
    const variableList = params.variables.map((v) => `{{${v.key}}}`).join(', ');

    return `
You are an SMS marketing expert writing professional business messages.

Generate an SMS template for:
- Event: ${params.eventName}
- Company: ${params.companyName || 'Our Company'}
- Description: ${params.eventDescription || ''}
${params.additionalContext ? `- Context: ${params.additionalContext}` : ''}

Available variables to use: ${variableList}

STRICT REQUIREMENTS:
1. MAXIMUM 160 characters total (count carefully)
2. Start with company name in brackets: [${params.companyName || 'Company'}]
3. Use {{customerName}} to personalize
4. Be direct and clear — one key message only
5. Include a short call to action
6. NO emojis (SMS compatibility)
7. Return ONLY the plain text message — absolutely nothing else, no quotes, no explanation

SMS message:`;
  }

  private buildWhatsAppPrompt(params: GenerateTemplateRequest): string {
    const variableList = params.variables
      .map((v) => `{{${v.key}}}`)
      .join(', ');

    return `
You are a WhatsApp Business messaging specialist.

Generate a professional WhatsApp message template for:
- Event: ${params.eventName}
- Company: ${params.companyName || 'Our Company'}
- Description: ${params.eventDescription || ''}
${params.additionalContext ? `- Context: ${params.additionalContext}` : ''}

Available variables: ${variableList}

REQUIREMENTS:
1. Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~
2. Use relevant emojis (${this.getEventIcon(params.eventName)} 📧 📞 👋 🔔 💼 etc.) — 3-5 max
3. Max 800 characters
4. Structure based on event type:
   - Welcome: Greeting → Welcome message → Benefits → Call to action
   - Payment: Confirmation → Amount → Next steps → Support contact
   - Reminder: Time/date → Location → Preparation → Action
   - Promo: Offer → Excitement → Code → Deadline
5. Use ALL available variables naturally
6. Professional yet friendly tone
7. Return ONLY the WhatsApp message text — no explanation, no code blocks

WhatsApp message:`;
  }

  // ─────────────────────────────────────────────────────────────
  // UPDATED HTML BUILDER with design variations
  // ─────────────────────────────────────────────────────────────
  private buildEmailHTML(
    bodyContent: string,
    colors: EmailColors,
    params: GenerateTemplateRequest,
    design?: { headerStyle: string; buttonStyle: string; layout: string; icon: string }
  ): string {
    const {
      companyName = 'Our Company',
      companyWebsite = '#',
      companyAddress = '123 Business Street, City, Country',
      companyLogoUrl,
    } = params;

    const primary = colors.primary;
    const secondary = colors.secondary;
    const accent = colors.accent || '#F59E0B';
    const designLayout = design || { headerStyle: 'professional', buttonStyle: 'rounded-lg', layout: 'standard', icon: '📧' };

    // Different button styles based on design
    const buttonBorderRadius = designLayout.buttonStyle === 'rounded-full' ? '9999px' : 
                               designLayout.buttonStyle === 'rounded-md' ? '6px' : '12px';
    
    // Different header heights based on style
    const headerPadding = designLayout.headerStyle === 'minimal' ? '20px 40px' :
                          designLayout.headerStyle === 'celebration' ? '50px 40px' : '40px 40px';
    
    // Layout variation
    const contentPadding = designLayout.layout === 'centered' ? '40px 30px' : '30px 40px';

    const headerGradient = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;

    const logoSection = companyLogoUrl
      ? `<img src="${companyLogoUrl}" alt="${companyName}" style="max-width:160px; height:auto; display:block; margin:0 auto 12px auto;">`
      : `<div style="display:inline-block; background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.4); border-radius:${designLayout.buttonStyle === 'rounded-full' ? '9999px' : '12px'}; padding:10px 24px; margin-bottom:12px;">
           <span style="font-family:'Segoe UI',Arial,sans-serif; font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">${designLayout.icon} ${companyName}</span>
         </div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${companyName} - ${params.eventName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;
               box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- Top Accent Bar -->
        <tr>
          <td style="background:${accent};height:4px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="background:${headerGradient};padding:${headerPadding};text-align:center;">
            ${logoSection}
            <p style="margin:0;color:rgba(255,255,255,0.80);font-size:13px;font-weight:500;
                      letter-spacing:1.5px;text-transform:uppercase;">
              ${params.eventName}
            </p>
          </td>
        </tr>

        <!-- Wave Shape -->
        <tr>
          <td style="background:${primary};padding:0;line-height:0;font-size:0;">
            <svg viewBox="0 0 600 30" preserveAspectRatio="none" style="width:100%;height:30px;display:block;">
              <path d="M0,30 C150,0 450,0 600,30 L600,30 L0,30 Z" fill="#ffffff"/>
            </svg>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:${contentPadding};background:#ffffff;">
            ${bodyContent}
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background:#e8ecf0;"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:32px 40px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:20px;">
              <tr>
                <td style="padding:0 8px;">
                  <a href="${companyWebsite}" style="display:inline-block;width:34px;height:34px;border-radius:50%;
                     background:${primary};color:#ffffff;text-decoration:none;font-size:14px;
                     font-weight:700;text-align:center;line-height:34px;">f</a>
                </td>
                <td style="padding:0 8px;">
                  <a href="${companyWebsite}" style="display:inline-block;width:34px;height:34px;border-radius:50%;
                     background:${primary};color:#ffffff;text-decoration:none;font-size:14px;
                     font-weight:700;text-align:center;line-height:34px;">in</a>
                </td>
                <td style="padding:0 8px;">
                  <a href="${companyWebsite}" style="display:inline-block;width:34px;height:34px;border-radius:50%;
                     background:${primary};color:#ffffff;text-decoration:none;font-size:14px;
                     font-weight:700;text-align:center;line-height:34px;">𝕏</a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${primary};">${companyName}</p>
            <p style="margin:0 0 16px;font-size:12px;color:#94a3b8;">${companyAddress}</p>
            <p style="margin:0 0 16px;font-size:12px;">
              <a href="${companyWebsite}" style="color:${secondary};text-decoration:none;font-weight:600;">Visit Website</a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="${companyWebsite}/privacy" style="color:${secondary};text-decoration:none;font-weight:600;">Privacy</a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="${companyWebsite}/unsubscribe" style="color:${secondary};text-decoration:none;font-weight:600;">Unsubscribe</a>
            </p>
            <p style="margin:0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </td>
        </tr>

        <!-- Bottom Bar -->
        <tr>
          <td style="background:${headerGradient};padding:14px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.65);font-size:11px;">
              Sent to {{email}} &bull; <a href="${companyWebsite}/unsubscribe" style="color:rgba(255,255,255,0.85);">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
  }

  // ─────────────────────────────────────────────────────────────
  // Parse JSON (unchanged)
  // ─────────────────────────────────────────────────────────────
  private parseJSONResponse(text: string): GeminiParsedResponse | null {
    try {
      const clean = text
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();

      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as GeminiParsedResponse;
      }
      return null;
    } catch (err) {
      console.error('[AITemplateService] JSON parse failed:', err);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Fallbacks (unchanged but updated with event-based colors)
  // ─────────────────────────────────────────────────────────────
  private getEmailFallback(
    params: GenerateTemplateRequest,
  ): { success: boolean; data?: GeneratedTemplateData } {
    const colors = this.getEventBasedColors(params.eventName);
    const design = this.getEventBasedDesign(params.eventName);

    const variableRows = params.variables
      .map(
        (v) =>
          `<tr>
            <td style="padding:8px 0;color:#64748b;font-size:13px;">${v.label || v.key}:</td>
            <td style="padding:8px 0;color:#1e293b;font-size:13px;font-weight:600;">{{${v.key}}}</td>
          </tr>`,
      )
      .join('');

    const body = `
      <div style="text-align:${design.layout === 'centered' ? 'center' : 'left'};">
        <h2 style="margin:0 0 12px;color:${colors.primary};font-size:26px;font-weight:700;">${design.icon} ${params.eventName}</h2>
        <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.5;">
          Hello <strong>{{customerName}}</strong>,<br>
          ${params.eventDescription || 'We have an important update for you.'}
        </p>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:28px;">
        <tr><td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${variableRows}
          </table>
        </td></tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" align="${design.layout === 'centered' ? 'center' : 'left'}">
        <tr>
          <td style="border-radius:${design.buttonStyle === 'rounded-full' ? '9999px' : '8px'};background:linear-gradient(135deg,${colors.primary},${colors.secondary});">
            <a href="#" style="display:inline-block;padding:14px 32px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;border-radius:${design.buttonStyle === 'rounded-full' ? '9999px' : '8px'};">
              ${this.getCTAButtonText(params.eventName)} &rarr;
            </a>
          </td>
        </tr>
      </table>`;

    return {
      success: true,
      data: {
        subject: this.getSubjectLine(params.eventName),
        templateBody: this.buildEmailHTML(body, colors, params, design),
        channelType: 'email',
        colors,
      },
    };
  }

  private getCTAButtonText(eventName: string): string {
    const eventLower = eventName.toLowerCase();
    if (eventLower.includes('welcome')) return 'Get Started';
    if (eventLower.includes('payment')) return 'Make Payment';
    if (eventLower.includes('support')) return 'Contact Support';
    if (eventLower.includes('promo')) return 'Claim Offer';
    if (eventLower.includes('reminder')) return 'Confirm Now';
    if (eventLower.includes('security')) return 'Secure Account';
    return 'View Details';
  }

  private getSubjectLine(eventName: string): string {
    const eventLower = eventName.toLowerCase();
    if (eventLower.includes('welcome')) return `🎉 Welcome to {{companyName}}, {{customerName}}!`;
    if (eventLower.includes('payment')) return `💰 Payment Confirmation: ${eventName}`;
    if (eventLower.includes('support')) return `🤝 We're here to help: ${eventName}`;
    if (eventLower.includes('promo')) return `✨ Special Offer Just for You, {{customerName}}!`;
    if (eventLower.includes('reminder')) return `⏰ Reminder: ${eventName}`;
    if (eventLower.includes('security')) return `🔒 Security Alert: ${eventName}`;
    return `${eventName} - Important Update`;
  }

  private getFallbackTemplate(
    channel: TemplateChannel,
    eventName: string,
  ): { success: boolean; data?: GeneratedTemplateData; error?: string } {
    const text =
      channel === 'sms'
        ? `[Company] ${eventName}: Important update for {{customerName}}. More info at website.com`
        : `${this.getEventIcon(eventName)} *${eventName}*\n\nHello *{{customerName}}*,\n\nWe have an important update for you.\n\n_Thank you_`;

    return {
      success: true,
      data: {
        subject: this.getSubjectLine(eventName),
        templateBody: text,
        channelType: channel,
      },
    };
  }
}

export default AITemplateService;