# Tharun Kumar Doddi — Full-Stack Portfolio Application

Live Page: https://tharun-portfolio-rho.vercel.app/

A modern, high-performance single-page portfolio engineered with **Angular 22** (Zoneless + Signals), **Vercel Serverless Functions / Express.js**, **Resend Email Service**, and **Cloudflare Turnstile** spam protection.

---

## 1. Quick Start (Local Development)

### Single-Server Mode
Builds the Angular frontend into `dist/` and runs the backend server on a single port hosting both the UI and email service:

```bash
# 1. Install root dependencies (first time only)
npm install

# 2. Build and start the full-stack server
npm start
```

Open **[http://localhost:4000](http://localhost:4000)** in your browser.

---

### Hot-Reload Development Mode
Runs the Angular live development server (`localhost:4200` with instant hot-reload) and the Express backend (`localhost:4000`) concurrently:

```bash
npm run dev
```

---

## 2. 1-Click Free Deployment on Vercel (Frontend + Serverless API)

Your entire application (Angular UI + `/api/contact` Serverless Email API) deploys **100% free with 0 cold starts** directly on **Vercel**:

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Tharun Kumar Doddi Portfolio"
   git branch -M main
   git remote add origin https://github.com/tonitharun/portfolio-app.git
   git push -u origin main
   ```
2. Log into **[Vercel.com](https://vercel.com)** with your GitHub account.
3. Click **Add New…** &rarr; **Project** &rarr; select `portfolio-app`.
4. Under **Environment Variables**, add:
    - `RESEND_API_KEY` = `re_your_resend_api_key_here`
    - `TURNSTILE_SECRET_KEY` = `0x4_your_turnstile_secret_key_here`
    - `TO_EMAIL` = `your_email@example.com`
    - `FROM_EMAIL` = `onboarding@resend.dev`
5. Click **Deploy**.
   - Your site will be live globally at `https://your-name.vercel.app` with instant Edge CDN and serverless email delivery!

---

## 3. Available Scripts (From Project Root)

| Command | Description |
| :--- | :--- |
| `npm start` | Builds the Angular bundle and launches the single web server on **[http://localhost:4000](http://localhost:4000)** |
| `npm run serve` | Alias for `npm start` |
| `npm run dev` | Runs the Angular development server (`http://localhost:4200` with live reload) and Express backend concurrently |
| `npm run build` | Compiles the production Angular bundle into `frontend/dist/portfolio-frontend` |
| `npm run logs` | Prints the last 30 log lines from `backend/logs/combined.log` |
| `npm run logs:live` | Follows and tails backend log events in real-time |
| `npm run logs:errors` | Inspects error logs in `backend/logs/error.log` |
| `npm run logs:clear` | Clears all log files |

---

## 4. Project Architecture

```text
portfolio-app/
├── api/                  # Vercel Serverless Function (contact.js) with Resend & Turnstile
├── backend/
│   ├── logs/             # combined.log & error.log (auto-rotated at 5MB)
│   ├── middleware/       # Rate limiting & Cloudflare Turnstile token validation
│   ├── routes/           # /api/contact Express route for local dev
│   ├── utils/            # Winston structured logger with email masking
│   ├── .env              # Resend API key, Turnstile secret, and recipient email
│   └── server.js         # Express web server for local single-server hosting
├── frontend/
│   ├── src/
│   │   ├── app/          # Standalone Angular components, signals, physics, models
│   │   ├── assets/       # Resume PDF (Tharun_Kumar_Doddi_Resume.pdf) & images
│   │   └── environments/ # Dev & Prod API URL configurations
│   ├── public/
│   │   ├── robots.txt    # Search engine crawler instructions
│   │   └── sitemap.xml   # Google Search indexing sitemap
│   ├── angular.json      # Angular 22 application builder configuration
│   └── vercel.json       # SPA routing rewrite rules for Vercel
├── vercel.json           # Root Vercel deployment configuration
└── package.json          # Root package scripts & dependencies
```
