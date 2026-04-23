// // src/services/aiTemplate/prompts/email.prompt.ts
// import { GenerateTemplateRequest } from '../../../../../common/IAiEmail.interface';

// export function buildEmailPrompt(params: GenerateTemplateRequest): string {
//   const variableList = params.variables
//     .map((v) => `{{${v.key}}} — ${v.description || v.label || v.key}`)
//     .join('\n');

//   return `You are a world-class HTML email designer for a professional business.

// Generate a COMPLETE email body for:
// - Event Name: ${params.eventName}
// - Event Description: ${params.eventDescription || 'Not provided'}
// - Company Name: ${params.companyName || process.env.COMPANY_NAME}
// ${params.additionalContext ? `- Extra Context: ${params.additionalContext}` : ''}

// AVAILABLE VARIABLES (use ALL of them naturally):
// ${variableList}

// REQUIREMENTS:
// 1. Create a UNIQUE design for this specific event
// 2. Use inline CSS only (email client compatible)
// 3. Make it responsive and mobile-friendly
// 4. Professional, modern, and visually appealing
// 5. Use ALL variables naturally in the content
// 6. Include a clear call-to-action button
// 7. ✅ CRITICAL: Choose appropriate, professional colors for this event type
//    - Primary: Main brand color for this event
//    - Secondary: Complementary color for accents
//    - Accent: Highlight color for buttons/CTAs

// Return ONLY valid JSON:
// {
//   "subject": "compelling, personalized subject line for ${params.eventName}",
//   "body": "HTML email body with inline CSS (no header/footer, just the content)",
//   "colors": {
//     "primary": "#hexcode",
//     "secondary": "#hexcode", 
//     "accent": "#hexcode"
//   }
// }`;
// }


// src/services/aiTemplate/prompts/email.prompt.ts
import { GenerateTemplateRequest } from '../../../../../common/IAiEmail.interface';

export function buildEmailPrompt(params: GenerateTemplateRequest): string {
  const variableList = params.variables
    .map((v) => `  • {{${v.key}}} — ${v.description || v.label || v.key}`)
    .join('\n');

  return `### ROLE
You are a Senior Product Designer and Communications Specialist. Your goal is to generate high-conversion, professional transactional email templates using a "Systemic Design" approach.

### CONTEXT
- **Company:** ${params.companyName || process.env.COMPANY_NAME}
- **Event Identity:** ${params.eventName} (${params.eventKey || 'General-Purpose'})
- **Intent:** ${params.eventDescription || 'Automated transactional communication'}
${params.additionalContext ? `- **Strategic Context:** ${params.additionalContext}` : ''}

### VARIABLES (Injection Required)
You must integrate these placeholders into the HTML naturally:
${variableList || '  (none provided)'}

### DESIGN GUIDELINES & COLOR THEORY
Analyze the Event Identity and apply the following color psychology:
1. **Psychological Mapping:** - Success/Growth: Emerald (#10b981) or Forest Greens.
   - Financial/Trust: Deep Navy (#1e293b) or Slate.
   - Alert/Action Required: Bold Indigo (#4f46e5) or Amber.
   - Error/Critical: Rose (#e11d48) or Crimson.
2. **Visual Hierarchy:** Use a clean, modern aesthetic (think Linear, Vercel, or Stripe). 
3. **Contrast:** Ensure the 'accent' color maintains a 4.5:1 contrast ratio against white text for WCAG accessibility.

### SYSTEM CONSTRAINTS
1. **Output Format:** Return EXCLUSIVELY a JSON object. No prose, no markdown code blocks.
2. **HTML Architecture:** - Use table-based layouts for maximum client compatibility (Outlook/Gmail).
   - All CSS MUST be inline. 
   - Use only 'Segoe UI', system-ui, sans-serif.
   - Exclude <html>, <head>, and <body> tags. Output the inner container only.
3. **Variable Usage:** Every variable listed above must be used at least once.

### EXPECTED JSON STRUCTURE
{
  "subject": "A concise, professional subject line including the company name",
  "body": "The minified HTML string with inline styles",
  "colors": {
    "primary": "The main brand color derived from the event's mood",
    "secondary": "A muted/lighter version of the primary for backgrounds/borders",
    "accent": "A high-contrast color for the Call to Action (CTA) button"
  },
  "design_rationale": "A one-sentence explanation of why these colors were chosen for this specific event"
}`;
}