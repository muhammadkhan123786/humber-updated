import { Request, Response } from 'express';
import { analyzeImagesWithGemini } from '../services/gemini.service';
import { parseSafeJSON } from '../utils/parseJson';

export const analyzeProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No images provided' });
      return;
    }

    const aiResponse = await analyzeImagesWithGemini(files);

    res.json({
      success: true,
      imageCount: files.length,
      ai: aiResponse
    });
  } catch (error: any) {
    console.error('❌ Controller Error:', error.message);
    res.status(500).json({ error: 'Image analysis failed' });
  }
};
