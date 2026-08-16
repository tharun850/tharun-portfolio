import { logger } from '../utils/logger.js';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verifies the Cloudflare Turnstile token server-side before any email is
 * sent. Turnstile is free with no assessment cap and no billing account,
 * making it a simpler and cheaper alternative to Google reCAPTCHA for a
 * low-traffic contact form.
 */
export async function verifyTurnstile(req, res, next) {
  const token = req.body?.turnstileToken;

  if (!token) {
    return res.status(400).json({ ok: false, message: 'Missing Turnstile token.' });
  }

  try {
    const secret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    const params = new URLSearchParams({
      secret,
      response: token,
      remoteip: req.ip,
    });

    const response = await fetch(VERIFY_URL, { method: 'POST', body: params });
    const data = await response.json();

    if (!data.success) {
      logger.warn('turnstile_rejected', { errorCodes: data['error-codes'], ip: req.ip });
      return res.status(400).json({ ok: false, message: 'Spam check failed. Please try again.' });
    }

    next();
  } catch (err) {
    logger.error('turnstile_verify_error', { error: err.message });
    return res.status(502).json({ ok: false, message: 'Could not verify request. Try again later.' });
  }
}
