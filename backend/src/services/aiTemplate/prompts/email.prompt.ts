// src/services/aiTemplate/prompts/email.prompt.ts
import { GenerateTemplateRequest } from '../../../../../common/IAiEmail.interface';

export function buildEmailPrompt(params: GenerateTemplateRequest): string {
  const variableList = params.variables
    .map((v) => `{{${v.key}}} — ${v.description || v.label || v.key}`)
    .join('\n');

  return `You are a world-class HTML email designer for a professional business.

Generate a COMPLETE email body for:
- Event Name: ${params.eventName}
- Event Description: ${params.eventDescription || 'Not provided'}
- Company Name: ${params.companyName || process.env.COMPANY_NAME}
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
7. ✅ CRITICAL: Choose appropriate, professional colors for this event type
   - Primary: Main brand color for this event
   - Secondary: Complementary color for accents
   - Accent: Highlight color for buttons/CTAs

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