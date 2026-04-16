// src/services/aiTemplate/prompts/whatsapp.prompt.ts
import { GenerateTemplateRequest } from '../../../../../common/IAiEmail.interface';

export function buildWhatsAppPrompt(params: GenerateTemplateRequest): string {
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