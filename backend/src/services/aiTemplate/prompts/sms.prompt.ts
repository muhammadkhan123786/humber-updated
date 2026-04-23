// src/services/aiTemplate/prompts/sms.prompt.ts
import { GenerateTemplateRequest } from '../../../../../common/IAiEmail.interface';

export function buildSMSPrompt(params: GenerateTemplateRequest): string {
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