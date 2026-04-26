// Sends transactional email via Resend.
// If RESEND_API_KEY is unset (local dev), the URL is logged to the console
// instead so the flow can be tested without a Resend account.

const RESEND_API_URL = 'https://api.resend.com/emails'

function buildHtml({ name, resetUrl }) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0d1526;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#e5e7eb;">
    <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="font-size:40px;margin-bottom:8px;">🔥</div>
        <h1 style="margin:0;font-size:24px;font-weight:800;background:linear-gradient(90deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#fbbf24;">FitEthio</h1>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:28px;">
        <h2 style="margin:0 0 12px 0;font-size:18px;color:#ffffff;">Reset your password</h2>
        <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#cbd5e1;">${greeting}</p>
        <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#cbd5e1;">
          We received a request to reset your FitEthio password. Click the button below to choose a new one. The link expires in 30 minutes.
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#d97706,#fbbf24);color:#0b1220;font-weight:700;font-size:15px;text-decoration:none;border-radius:14px;">Reset password</a>
        </div>
        <p style="margin:0 0 8px 0;font-size:12px;line-height:1.6;color:#94a3b8;">Or copy and paste this link into your browser:</p>
        <p style="margin:0 0 16px 0;font-size:12px;line-height:1.6;word-break:break-all;color:#94a3b8;">${resetUrl}</p>
        <p style="margin:18px 0 0 0;font-size:12px;line-height:1.6;color:#94a3b8;">If you didn't request this, you can safely ignore this email — your password will not change.</p>
      </div>
      <p style="text-align:center;margin:20px 0 0 0;font-size:11px;color:#64748b;">FitEthio — your personal weight loss companion</p>
    </div>
  </body>
</html>`
}

function buildText({ name, resetUrl }) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  return `${greeting}

We received a request to reset your FitEthio password. Open the link below to choose a new one. The link expires in 30 minutes.

${resetUrl}

If you didn't request this, you can safely ignore this email — your password will not change.

— FitEthio`
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || 'FitEthio <onboarding@resend.dev>'

  if (!apiKey) {
    console.log(`\n[mailer-dev] Reset link for ${to}: ${resetUrl}\n`)
    return { delivered: false, dev: true }
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Reset your FitEthio password',
      html: buildHtml({ name, resetUrl }),
      text: buildText({ name, resetUrl }),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[mailer] Resend failed:', res.status, body)
    throw new Error('Failed to send email')
  }
  return { delivered: true }
}
