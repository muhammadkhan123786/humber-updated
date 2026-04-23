
export interface GenerateEmailParams {
  eventName: string;
  eventDescription?: string;
  channelName?: string;
  additionalContext?: string;
}

export interface EmailColors {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface GeneratedEmailData {
  subject: string;
  templateBody: string;
  colors: EmailColors;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export const generateEmailTemplate = async (params: GenerateEmailParams): Promise<GeneratedEmailData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-templates/generate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result: ApiResponse<GeneratedEmailData> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate email template');
    }

    if (!result.data) {
      throw new Error('No data received from AI service');
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};