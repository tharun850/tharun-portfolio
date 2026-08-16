import { Resend } from 'resend';

// Helper to escape HTML characters
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, message: `Method ${req.method} Not Allowed` });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const { name, email, message, company, turnstileToken } = body || {};

  // 1. Honeypot check: Bots usually fill the hidden company field
  if (company) {
    return res.status(200).json({ ok: true, message: 'Message received.' });
  }

  // 2. Validate input fields
  if (!name || !email || !message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({
      ok: false,
      message: 'Please provide your name, valid email, and a message of at least 10 characters.',
    });
  }

  // 3. Verify Cloudflare Turnstile token
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

  if (turnstileToken && secretKey) {
    try {
      const turnstileFormData = new URLSearchParams();
      turnstileFormData.append('secret', secretKey);
      turnstileFormData.append('response', turnstileToken);
      if (req.headers['x-forwarded-for']) {
        turnstileFormData.append('remoteip', req.headers['x-forwarded-for']);
      }

      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: turnstileFormData.toString(),
      });

      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return res.status(400).json({
          ok: false,
          message: 'Captcha verification failed. Please refresh and try again.',
        });
      }
    } catch (err) {
      console.warn('Turnstile verification network error, proceeding soft:', err.message);
    }
  }

  // 4. Send email using Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return res.status(200).json({
      ok: true,
      message: '[Dev Mode] Message simulated successfully (RESEND_API_KEY not set).',
    });
  }

  const resend = new Resend(resendApiKey);
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const toEmail = process.env.TO_EMAIL || 'tharuntoni850@gmail.com';

  const cleanName = escapeHtml(name.trim());
  const cleanEmail = escapeHtml(email.trim());
  const cleanMessage = escapeHtml(message.trim());

  try {
    // Send notification to site owner
    await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: email.trim(),
      subject: `New Portfolio Inquiry from ${name.trim()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #6c5ce7; margin-top: 0;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> <a href="mailto:${cleanEmail}" style="color: #00d1b2;">${cleanEmail}</a></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="white-space: pre-wrap; color: #333; line-height: 1.6;">${cleanMessage}</p>
        </div>
      `,
    });

    // Optional visitor receipt
    try {
      await resend.emails.send({
        from: `Tharun Kumar Doddi <${fromEmail}>`,
        to: [email.trim()],
        subject: `Thank you for reaching out, ${name.trim()}!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #6c5ce7; margin-top: 0;">Message Received!</h2>
            <p>Hi ${cleanName},</p>
            <p>Thank you for visiting my portfolio. I've received your message and will get back to you as soon as possible.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap; color: #555; line-height: 1.6;">${cleanMessage}</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="color: #888; font-size: 0.85rem;">Tharun Kumar Doddi &middot; Full-Stack Engineer</p>
          </div>
        `,
      });
    } catch (confErr) {
      console.warn('Visitor receipt skipped (normal on sandbox domain):', confErr.message);
    }

    return res.status(200).json({
      ok: true,
      message: 'Thanks for reaching out! I have received your message and will get back to you soon.',
    });
  } catch (emailErr) {
    console.error('Resend API error:', emailErr);
    return res.status(502).json({
      ok: false,
      message: emailErr?.message || 'Failed to deliver email. Please reach out directly at tonitharun@gmail.com.',
    });
  }
}
