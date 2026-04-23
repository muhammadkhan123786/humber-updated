// src/services/aiTemplate/utils/parser.ts
import { GeminiParsedResponse } from '../../../../../common/IAiEmail.interface';

export function parseJSONResponse(text: string): GeminiParsedResponse | null {
  try {
    const clean = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch (err) {
    console.error('[AITemplateService] JSON parse failed:', err);
    return null;
  }
}