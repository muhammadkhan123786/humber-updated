// // // src/controllers/aiEmailController.ts
// // import { Request, Response } from 'express';
// // import { AIEmailService } from '../services/aiTemplate.service';
// // import { GenerateEmailRequest, ApiResponse } from '../../../common/IAiEmail.interface';

// // class AIEmailController {
// //   private aiService: AIEmailService;

// //   constructor() {
// //     this.aiService = new AIEmailService(process.env.GEMINI_API_KEY!);
// //   }

// //   generateEmailTemplate = async (req: Request, res: Response): Promise<void> => {
// //     try {
// //       const { 
// //         eventName, 
// //         eventDescription, 
// //         channelName, 
// //         additionalContext 
// //       }: GenerateEmailRequest = req.body;

// //       if (!eventName) {
// //         res.status(400).json({
// //           success: false,
// //           error: 'Event name is required'
// //         } as ApiResponse);
// //         return;
// //       }

// //       const result = await this.aiService.generateEmail({
// //         eventName,
// //         eventDescription,
// //         channelName,
// //         additionalContext
// //       });

// //       if (result.success) {
// //         res.status(200).json(result);
// //       } else {
// //         res.status(500).json({
// //           success: false,
// //           error: result.error || 'Failed to generate template'
// //         } as ApiResponse);
// //       }
// //     } catch (error) {
// //       console.error('AI Generate Error:', error);
// //       res.status(500).json({
// //         success: false,
// //         error: error instanceof Error ? error.message : 'Failed to generate email template'
// //       } as ApiResponse);
// //     }
// //   };
// // }

// // export default new AIEmailController();


// // src/controllers/aiTemplate.controller.ts
// import { Request, Response } from 'express';
// import AITemplateService from '../services/aiTemplate.service';
// import { GenerateTemplateRequest, ApiResponse } from '../../../common/IAiEmail.interface';

// class AITemplateController {
//   private aiService: AITemplateService;

//   constructor() {
//     this.aiService = new AITemplateService(process.env.GEMINI_API_KEY!);
//   }

//   // POST /api/ai-templates/generate
//   generateTemplate = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const {
//         channelType,
//         eventName,
//         eventDescription,
//         variables,
//         additionalContext,
//         companyName,
//         companyColor,
//         companyWebsite,
//         companyAddress,
//         companyLogoUrl,
//       }: GenerateTemplateRequest = req.body;

//       // ── Validation ────────────────────────────────────────
//       if (!eventName) {
//         res.status(400).json({
//           success: false,
//           error: 'eventName is required',
//         } as ApiResponse);
//         return;
//       }

//       if (!channelType || !['email', 'sms', 'whatsapp'].includes(channelType)) {
//         res.status(400).json({
//           success: false,
//           error: 'channelType must be one of: email, sms, whatsapp',
//         } as ApiResponse);
//         return;
//       }

//       console.log("companyColor", companyColor)
//       // ── Generate ──────────────────────────────────────────
//       const result = await this.aiService.generateTemplate({
//         channelType,
//         eventName,
//         eventDescription,
//         variables: variables || [],
//         additionalContext,
//         companyName: companyName || process.env.COMPANY_NAME || 'Our Company',
//         companyColor: companyColor || process.env.COMPANY_COLOR || '#4F46E5',
//         companyWebsite: companyWebsite || process.env.COMPANY_WEBSITE || '#',
//         companyAddress: companyAddress || process.env.COMPANY_ADDRESS || '',
//         companyLogoUrl: companyLogoUrl || process.env.COMPANY_LOGO_URL || '',
//       });

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           data: result.data,
//         } as ApiResponse);
//       } else {
//         res.status(500).json({
//           success: false,
//           error: result.error || 'Generation failed',
//         } as ApiResponse);
//       }
//     } catch (error) {
//       console.error('[AITemplateController] Error:', error);
//       res.status(500).json({
//         success: false,
//         error: error instanceof Error ? error.message : 'Internal server error',
//       } as ApiResponse);
//     }
//   };
// }

// export default new AITemplateController();


// src/controllers/aiTemplate.controller.ts
// import { Request, Response } from 'express';
// import AITemplateService from '../services/aiTemplate.service';
// import { GenerateTemplateRequest, ApiResponse } from '../../../common/IAiEmail.interface';
// class AITemplateController {
//   private aiService = new AITemplateService(process.env.GEMINI_API_KEY!);

//   generateTemplate = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const {
//         channelType,
//         eventKey,           // ✅ from frontend
//         eventName,
//         eventDescription,
//         variables,
//         additionalContext,
//       }: GenerateTemplateRequest = req.body;

//       if (!eventName) {
//         res.status(400).json({ success: false, error: 'eventName is required' });
//         return;
//       }
//       if (!channelType || !['email', 'sms', 'whatsapp'].includes(channelType)) {
//         res.status(400).json({ success: false, error: 'channelType must be email | sms | whatsapp' });
//         return;
//       }

//       // ✅ Company settings read from DB — no need to send from frontend
//       const userId = (req as any).user?.id || (req as any).user?._id;
//       // const company = await companySettingsService.getSettings(userId);

//       const result = await this.aiService.generateTemplate({
//         channelType,
//         eventKey: eventKey || eventName.toUpperCase().replace(/\s+/g, '_'),
//         eventName,
//         eventDescription,
//         variables: (variables || []).map((v: any) => ({
//           key: v.key,
//           label: v.label || v.key,
//           description: v.description || v.label || v.key,
//         })),
//         additionalContext,
//         // ✅ All from DB
//         // companyName:           company.companyName,
//         // companyColor:          company.companyColor,
//         // companyWebsite:        company.companyWebsite,
//         // companyAddress:        company.companyAddress,
//         // companyLogoUrl:        company.companyLogoUrl,
//       });

//       res.status(result.success ? 200 : 500).json(result);
//     } catch (error) {
//       console.error('[AITemplateController]', error);
//       res.status(500).json({
//         success: false,
//         error: error instanceof Error ? error.message : 'Internal server error',
//       });
//     }
//   };
// }

// export default new AITemplateController();






// src/controllers/aiTemplate.controller.ts
import { Request, Response } from 'express';
import AITemplateService from '../services/aiTemplate/index';
import { GenerateTemplateRequest, ApiResponse } from '../../../common/IAiEmail.interface';

class AITemplateController {
  private aiService: AITemplateService;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.aiService = new AITemplateService(apiKey);
  }

  generateTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        channelType,
        eventName,
        eventDescription,
        variables,
        additionalContext,
      }: GenerateTemplateRequest = req.body;

      if (!eventName) {
        res.status(400).json({
          success: false,
          error: 'eventName is required',
        });
        return;
      }

      if (!channelType || !['email', 'sms', 'whatsapp'].includes(channelType)) {
        res.status(400).json({
          success: false,
          error: 'channelType must be one of: email, sms, whatsapp',
        });
        return;
      }

      console.log(`📧 Generating ${channelType} template for: ${eventName}`);

      const result = await this.aiService.generateTemplate({
        channelType,
        eventName,
        eventDescription: eventDescription || '',
        variables: variables || [],
        additionalContext: additionalContext || '',
      });

      if (result.success && result.data) {
        res.status(200).json({
          success: true,
          data: result.data,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Generation failed',
        });
      }
    } catch (error: any) {
      console.error('[AITemplateController] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  };
}

export default new AITemplateController();