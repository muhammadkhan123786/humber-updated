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
Analyze all provided product images as a single product collection.
Look for details like color, material, brand, usage, and style across ALL images.

Return ONLY valid JSON in this exact structure:
{
  "shortDescription": "Summarize the product briefly based on all views.",
  "description": "Provide a detailed description combining features seen in all images.",
  "tags": ["Provide 8-10 UNIQUE, diverse tags (e.g., category, material, color, style)"],
  "keywords": "comma, separated, unique, keywords"
}

Constraints: 
- Do NOT repeat the same word in the tags array.
- Ensure tags are relevant to the specific product shown.
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
