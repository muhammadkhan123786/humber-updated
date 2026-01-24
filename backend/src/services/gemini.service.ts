import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse } from '../../../common/ai.interface';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeImagesWithGemini = async (
  files: Express.Multer.File[]
): Promise<AIResponse> => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview'
  });

  const imageParts = files.map(file => ({
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype
    }
  }));

  const prompt = `
Analyze all provided product images carefully.
Combine details from all images.

Return ONLY valid JSON:
{
  "shortDescription": "string (max 15 words)",
  "description": "string",
  "tags": ["array", "of", "strings"],
  "keywords": "comma separated keywords"
}
`;

  const result = await model.generateContent([
    prompt,
    ...imageParts
  ]);

  const text = result.response
    .text()
    .replace(/```json|```/gi, '')
    .trim();

  return JSON.parse(text);
};
