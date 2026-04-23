// src/services/aiTemplate/index.ts
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  GenerateTemplateRequest,
  GeneratedTemplateData,
} from '../../../../common/IAiEmail.interface';
import { buildEmailPrompt } from './prompts/email.prompt';
import { buildSMSPrompt } from './prompts/sms.prompt';
import { buildWhatsAppPrompt } from './prompts/whatsapp.prompt';
import { buildEmailHTML } from './builders/email.builder';
import { parseJSONResponse } from './utils/parser';

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
        case 'email': return await this.generateEmailTemplate(params);
        case 'sms': return await this.generateSMSTemplate(params);
        case 'whatsapp': return await this.generateWhatsAppTemplate(params);
        default: return await this.generateEmailTemplate(params);
      }
    } catch (error: any) {
      console.error(`[AITemplateService] Error:`, error);
      return { success: false, error: error.message || 'Generation failed' };
    }
  }

  private async generateEmailTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = buildEmailPrompt(params);

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const parsed = parseJSONResponse(text);

      if (!parsed || !parsed.body || !parsed.subject) {
        throw new Error('Invalid AI response');
      }

      // ✅ AI generates colors dynamically
      const colors = {
        primary: parsed.colors?.primary || '#1E1F4B',
        secondary: parsed.colors?.secondary || '#6C63FF',
        accent: parsed.colors?.accent || '#F59E0B',
      };

      const fullHTML = buildEmailHTML(parsed.body, colors, params);

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

  private async generateSMSTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = buildSMSPrompt(params);

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

  private async generateWhatsAppTemplate(
    params: GenerateTemplateRequest,
  ): Promise<{ success: boolean; data?: GeneratedTemplateData; error?: string }> {
    const prompt = buildWhatsAppPrompt(params);

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
      return { success: false, error: error.message || 'Failed to generate WhatsApp' };
    }
  }
}

export default AITemplateService;