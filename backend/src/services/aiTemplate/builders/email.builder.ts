// src/services/aiTemplate/builders/email.builder.ts
import { EmailColors, GenerateTemplateRequest } from '../../../../../common/IAiEmail.interface';

export function buildEmailHTML(
  bodyContent: string,
  colors: EmailColors,
  params: GenerateTemplateRequest,
): string {
  const {
    companyName = process.env.COMPANY_NAME || "Humber Mobility",
    companyWebsite = process.env.COMPANY_WEBSITE || "https://onyxtech.co.uk/",
    companyAddress = process.env.COMPANY_ADDRESS || "123 Business Street, London, UK",
    companyLogoUrl = process.env.COMPANY_LOGO_URL || "/logo.png",
    socialLinks = {},
  } = params;

  const primary = colors.primary;
  const secondary = colors.secondary;
  const accent = colors.accent || '#F59E0B';
  const headerGradient = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;

  // ✅ Logo section - 80px rounded logo
  const logoSrc = companyLogoUrl || '';
  
  // Handle relative paths for logo
  const getLogoUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  const finalLogoUrl = getLogoUrl(logoSrc);
  
  const logoSection = finalLogoUrl
    ? `<img src="${finalLogoUrl}" alt="${companyName}" 
         style="width:80px; height:80px; display:block; margin:0 auto 16px auto; 
                border-radius:50%; object-fit:cover; border:2px solid rgba(255,255,255,0.3);">`
    : `<div style="display:inline-block; background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.4); border-radius:16px; padding:10px 28px; margin-bottom:16px;">
         <span style="font-family:'Segoe UI',Arial,sans-serif; font-size:22px; font-weight:800; color:#ffffff;">${companyName}</span>
       </div>`;

  // Social links
  const facebookUrl = (socialLinks as any)?.facebook || companyWebsite;
  const linkedinUrl = (socialLinks as any)?.linkedin || companyWebsite;
  const twitterUrl = (socialLinks as any)?.twitter || companyWebsite;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${companyName} - ${params.eventName}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .social-icons td { padding: 0 8px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="container"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);">

        <!-- Top Accent Bar (AI Generated Color) -->
        <tr>
          <td style="background:${accent};height:5px;font-size:0;line-height:0;">&nbsp;<\/td>
        </tr>

        <!-- Header (AI Generated Gradient) -->
        <tr>
          <td style="background:${headerGradient};padding:40px 40px 36px;text-align:center;">
            ${logoSection}
            <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:500;letter-spacing:2px;text-transform:uppercase;">
              ${params.eventName}
            </p>
          <\/td>
        </tr>

        <!-- Wave Divider -->
        <tr>
          <td style="background:${primary};padding:0;line-height:0;font-size:0;">
            <svg viewBox="0 0 600 28" preserveAspectRatio="none" style="width:100%;height:28px;display:block;">
              <path d="M0,28 C200,0 400,0 600,28 L600,28 L0,28 Z" fill="#ffffff"/>
            </svg>
          <\/td>
        </tr>

        <!-- AI Generated Content -->
        <tr>
          <td style="padding:40px 30px;background:#ffffff;">
            ${bodyContent}
          <\/td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background:#e8ecf0;"><\/div>
          <\/td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:32px 40px;text-align:center;">

            <!-- Social Icons - Centered -->
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px auto;">
              <tr>
                <td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" align="center" class="social-icons">
                    <tr>
                      <td style="padding:0 10px;">
                        <a href="${facebookUrl}" target="_blank" 
                          style="display:inline-block;width:38px;height:38px;border-radius:50%;background:${primary};
                                 color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;line-height:38px;">
                          f
                        </a>
                      <\/td>
                      <td style="padding:0 10px;">
                        <a href="${linkedinUrl}" target="_blank"
                          style="display:inline-block;width:38px;height:38px;border-radius:50%;background:${primary};
                                 color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;line-height:38px;">
                          in
                        </a>
                      <\/td>
                      <td style="padding:0 10px;">
                        <a href="${twitterUrl}" target="_blank"
                          style="display:inline-block;width:38px;height:38px;border-radius:50%;background:${primary};
                                 color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;line-height:38px;">
                          𝕏
                        </a>
                      <\/td>
                    </tr>
                  </table>
                <\/td>
              </tr>
            </table>

            <!-- Company Name -->
            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:${primary};">${companyName}</p>
            
            <!-- Address -->
            ${companyAddress ? `<p style="margin:0 0 20px;font-size:13px;color:#64748b;">${companyAddress}</p>` : ''}
            
            <!-- Footer Links -->
            <p style="margin:0 0 20px;font-size:13px;">
              <a href="${companyWebsite}" target="_blank" style="color:${secondary};text-decoration:none;font-weight:600;margin:0 8px;">Visit Website</a>
              <span style="color:#cbd5e1;">|</span>
              <a href="${companyWebsite}/privacy" target="_blank" style="color:${secondary};text-decoration:none;font-weight:600;margin:0 8px;">Privacy Policy</a>
              <span style="color:#cbd5e1;">|</span>
              <a href="${companyWebsite}/unsubscribe" target="_blank" style="color:${secondary};text-decoration:none;font-weight:600;margin:0 8px;">Unsubscribe</a>
            </p>

            <!-- Copyright -->
            <p style="margin:0;font-size:11px;color:#94a3b8;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          <\/td>
        </tr>

        <!-- Bottom Bar (AI Generated Colors) -->
        <tr>
          <td style="background:${headerGradient};padding:14px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.65);font-size:11px;">
            
              <a href="${companyWebsite}/unsubscribe" style="color:rgba(255,255,255,0.85);text-decoration:underline;">Unsubscribe</a>
            </p>
          <\/td>
        </tr>

      </table>
    <\/td>
  </tr>
</table>

</body>
</html>`;
}




  // Sent to {{email}} &bull; 