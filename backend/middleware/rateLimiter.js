import rateLimit from 'express-rate-limit';

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES ?? 15);
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 5);

// Basic abuse/spam mitigation, layered on top of the reCAPTCHA check below.
export const contactRateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many requests. Please try again later.',
  },
});
