# SMTP & API Email Debugging Copilot

A lightweight developer tool for debugging SMTP servers and HTTP/API email endpoints (such as Supabase Functions, SendGrid, Postmark, or custom email APIs).  
Built with Next.js, TypeScript, and Tailwind CSS.  
No accounts, no database, no AI — focused purely on developer troubleshooting.

<p>
  <a href="https://serene-macaron-6f50bc.netlify.app" target="_blank" style="font-size:18px; font-weight:600;">
    🚀 Live Demo
  </a>
</p>

---

## Features

### SMTP Debugger

Send a real test email using your SMTP provider. Supports:

- SMTP host, port, username, password
- SSL/TLS toggle
- From and To fields
- Backend test via `/api/test-smtp` using Nodemailer
- Raw SMTP errors for transparent debugging
- Clear explanations for common SMTP issues (535, ENOTFOUND, ETIMEDOUT, self-signed certificate, etc.)
- Auto-generated Node.js / Nodemailer code snippet

Compatible with:  
SMTP2GO, Gmail SMTP, Outlook/Office365, Mailgun, SendGrid (SMTP mode), and all major SMTP services.

---

### API Endpoint Debugger

Test any HTTP endpoint that performs email operations.

- URL input
- HTTP method (GET/POST)
- Optional API key sent as `Authorization: Bearer <key>`
- Raw JSON body support
- Backend test via `/api/test-api`
- Status code mapping with clear explanations
- Raw response or raw error output

Works with:  
Supabase Edge Functions, SendGrid API, Postmark API, Mailgun API, and custom backend email routes.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Next.js API Routes (Node.js backend)
- Nodemailer
- Custom neon color palette (amber_gold, blaze_orange, neon_pink, blue_violet, azure_blue)

---

## Project Structure

```
smtp-debugger/
│
├── app/
│   ├── api/
│   │   ├── test-smtp/
│   │   │   └── route.ts       # SMTP backend tester
│   │   └── test-api/
│   │       └── route.ts       # API backend tester
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # UI: SMTP tab + API tab
│
├── tailwind.config.ts         # Includes custom color palette
├── postcss.config.mjs
├── package.json
└── README.md
```

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/smtp-debugger
cd smtp-debugger
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open in browser:  
http://localhost:3000

---

## SMTP Usage Notes

To successfully send a test email, your provider may require:

- Correct SMTP host and port
- SMTP username and password
- SSL/TLS enabled depending on provider
- Verified sender address
- App Passwords for Gmail/Outlook if using personal accounts

A real message is delivered to the recipient you specify.

---

## API Usage Notes

Provide:

- Full URL of the endpoint
- HTTP method
- Optional API key
- Raw JSON body (for POST requests)

The result panel displays:

- Success or failure
- HTTP status code and explanation
- Raw server response or error details

Useful for debugging:

- Supabase HTTP functions
- Third-party email APIs
- Internal email-triggering services

---

## Security

This tool does **not** store:

- SMTP credentials
- API keys
- Email addresses
- JSON request bodies

All data is used only for the live test and discarded afterward.

---

## License

MIT License. Free for personal and commercial use.
