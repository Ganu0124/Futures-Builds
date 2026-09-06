import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { email, projectTitle, decision } = await req.json()

    if (!email || !projectTitle || !decision) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 })
    }
    if (!['accepted', 'rejected'].includes(decision)) {
      return NextResponse.json({ success: false, message: 'Invalid decision value.' }, { status: 400 })
    }
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Gmail credentials not configured in .env.local.' }, { status: 500 })
    }

    const isAccepted = decision === 'accepted'
    const accentColor  = isAccepted ? '#10B981' : '#F59E0B'
    const statusLabel  = isAccepted ? 'ACCEPTED' : 'NOT ACCEPTED'
    const statusBg     = isAccepted ? '#0d2b1f' : '#2b1f0d'
    const subject      = isAccepted
      ? 'Your Project Request Has Been Accepted — FutureBuilds'
      : 'Update on Your Project Request — FutureBuilds'
    const bodyText = isAccepted
      ? "We're excited to let you know that your project request has been <strong style=\"color:#10B981;\">accepted</strong> by the FutureBuilds team. Our team will be reaching out within <strong>24–48 hours</strong> to discuss the next steps, timeline, and project scope."
      : "Thank you for taking the time to submit your project. After careful review, we're currently unable to take on this particular project at this time. We appreciate your interest in FutureBuilds and encourage you to reach out again — we'd love to find the right opportunity to work together."

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

  <!-- Brand -->
  <tr><td align="center" style="padding-bottom:28px;">
    <span style="font-size:24px;font-weight:900;color:#F5F5F5;letter-spacing:-1px;">Future</span><span style="font-size:24px;font-weight:900;color:#10B981;letter-spacing:-1px;">Builds</span>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:#111111;border:1px solid #222222;border-radius:16px;overflow:hidden;">

    <!-- Top bar -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="height:4px;background:${accentColor};border-radius:16px 16px 0 0;"></td>
    </tr></table>

    <!-- Body -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:36px 36px 28px;">

      <!-- Badge -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr>
        <td style="background:${statusBg};border:1px solid ${accentColor};border-radius:999px;padding:5px 14px;">
          <span style="color:${accentColor};font-size:11px;font-weight:700;letter-spacing:2px;">${statusLabel}</span>
        </td>
      </tr></table>

      <!-- Headline -->
      <h1 style="margin:0 0 14px;font-size:22px;font-weight:800;color:#F5F5F5;line-height:1.25;">
        ${isAccepted ? 'Great news — your project is in! 🎉' : 'Thank you for your submission'}
      </h1>

      <!-- Project pill -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;"><tr>
        <td style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:12px 16px;">
          <div style="color:#6B7280;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Project</div>
          <div style="color:#F5F5F5;font-size:15px;font-weight:700;">${projectTitle}</div>
        </td>
      </tr></table>

      <!-- Body text -->
      <p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#A3A3A3;">${bodyText}</p>

      ${isAccepted ? `
      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:#10B981;border-radius:999px;">
          <a href="https://futurebuilds.vercel.app" style="display:inline-block;color:#0a0a0a;font-size:14px;font-weight:800;text-decoration:none;padding:12px 28px;">
            Visit FutureBuilds &rarr;
          </a>
        </td>
      </tr></table>` : ''}

    </td></tr></table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="height:1px;background:#1e1e1e;"></td>
    </tr></table>

    <!-- Footer note -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding:18px 36px;">
        <p style="margin:0;font-size:12px;color:#374151;line-height:1.6;">
          This email was sent regarding a project request submitted at FutureBuilds.
          If you did not submit this, please ignore this email.
        </p>
      </td>
    </tr></table>

  </td></tr>

  <!-- Bottom footer -->
  <tr><td align="center" style="padding:24px 0 0;">
    <p style="margin:0;font-size:12px;color:#374151;">&copy; ${new Date().getFullYear()} FutureBuilds &mdash; All rights reserved.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"FutureBuilds" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html,
    })

    return NextResponse.json({
      success: true,
      message: `${isAccepted ? 'Acceptance' : 'Rejection'} email sent to ${email}.`,
    })
  } catch (err: any) {
    console.error('[notify] Error:', err)
    return NextResponse.json({ success: false, message: err?.message || 'Failed to send email.' }, { status: 500 })
  }
}
