import crypto from "crypto";

/**
 * Generate a secure random token for email verification
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Get expiration date for verification token (24 hours from now)
 */
export function getTokenExpiration(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration;
}

/**
 * Check if a verification token has expired
 */
export function isTokenExpired(expirationDate: Date | null): boolean {
  if (!expirationDate) return true;
  return new Date() > expirationDate;
}

/**
 * Generate verification email HTML content
 */
export function generateVerificationEmailHtml(
  userName: string,
  verificationUrl: string,
  tier: string
): string {
  const tierName = tier === "elite" ? "Elite" : "Premium";
  const tierColor = tier === "elite" ? "#FFD700" : "#D4A574";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your IvyReader Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
              <h1 style="margin: 0; font-size: 28px; color: #11181C; font-weight: 700;">Welcome to IvyReader!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 20px; text-align: center;">
              <span style="display: inline-block; padding: 8px 16px; background-color: ${tierColor}; color: ${tier === "elite" ? "#000" : "#fff"}; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ${tierName} Member
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0; font-size: 16px; color: #687076; line-height: 1.6;">
                Hi ${userName || "Reader"},<br><br>
                Thank you for joining IvyReader ${tierName}! Please verify your email address to activate your account and start your reading journey.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 16px 32px; background-color: ${tierColor}; color: ${tier === "elite" ? "#000" : "#fff"}; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Verify Email Address
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #9BA1A6;">
                This link will expire in 24 hours.<br>
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9BA1A6;">
                © ${new Date().getFullYear()} IvyReader. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of verification email
 */
export function generateVerificationEmailText(
  userName: string,
  verificationUrl: string,
  tier: string
): string {
  const tierName = tier === "elite" ? "Elite" : "Premium";
  
  return `
Welcome to IvyReader ${tierName}!

Hi ${userName || "Reader"},

Thank you for joining IvyReader ${tierName}! Please verify your email address to activate your account.

Click the link below to verify your email:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

© ${new Date().getFullYear()} IvyReader. All rights reserved.
  `.trim();
}
