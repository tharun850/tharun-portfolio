import { Router } from 'express';
import { Resend } from 'resend';
import { logger, maskEmail } from '../utils/logger.js';
import { verifyTurnstile } from '../middleware/verifyTurnstile.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

router.post('/', contactRateLimiter, verifyTurnstile, async (req, res) => {
  const { name, email, message, company } = req.body ?? {};

  // Honeypot: if this hidden field is filled, silently pretend success
  // so bots don't learn the form is being filtered.
  if (company) {
    logger.warn('honeypot_triggered', { ip: req.ip });
    return res.json({ ok: true, message: 'Message sent.' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || message.length < 10 || message.length > 5000) {
    return res.status(400).json({ ok: false, message: 'Invalid input.' });
  }

  const safeName = escapeHtml(name).slice(0, 200);
  const safeMessage = escapeHtml(message).slice(0, 5000);
  const apiKey = process.env.RESEND_API_KEY;

  // Development mode fallback when RESEND_API_KEY is not yet configured
  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('re_xxxx')) {
    logger.info('dev_mode_email_simulated', {
      to: process.env.TO_EMAIL || 'you@example.com',
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      replyTo: email,
      visitorName: safeName,
      visitorEmail: maskEmail(email),
      messagePreview: safeMessage.slice(0, 100),
    });
    return res.json({
      ok: true,
      message: 'Message sent! (Development Mode: simulated without Resend API key)',
    });
  }

  try {
    const resend = new Resend(apiKey);

    // 1) Notify the site owner
    const notifyResult = await resend.emails.send({
      to: process.env.TO_EMAIL || email,
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      replyTo: email,
      subject: `New portfolio contact from ${safeName}`,
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br/>')}</p>
      `,
    });
    if (notifyResult.error) throw new Error(notifyResult.error.message);

    // 2) Send the visitor a confirmation copy of what they submitted
    try {
      const confirmResult = await resend.emails.send({
        to: email,
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        subject: 'Thanks for reaching out!',
        html: `
          <p>Hi ${safeName},</p>
          <p>Thanks for your message — here's a copy for your records:</p>
          <blockquote>${safeMessage.replace(/\n/g, '<br/>')}</blockquote>
          <p>I'll get back to you soon.</p>
        `,
      });
      if (confirmResult.error) {
        logger.warn('resend_visitor_confirmation_warn', {
          error: confirmResult.error.message,
          note: 'Visitor confirmation skipped (common in sandbox mode before domain verification)',
        });
      }
    } catch (confirmErr) {
      logger.warn('resend_visitor_confirmation_failed', { error: confirmErr.message });
    }

    logger.info('contact_email_sent', { email: maskEmail(email), ip: req.ip });
    return res.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err) {
    logger.error('resend_error', { error: err.message, ip: req.ip });
    return res.status(502).json({
      ok: false,
      message: `Could not send email: ${err.message}`,
    });
  }
});

export default router;
