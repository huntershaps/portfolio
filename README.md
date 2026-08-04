# Hunter Portfolio

This project serves static files with a contact form that sends emails via FormSubmit (free, no backend SMTP required).

Quick setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open `http://localhost:8000` and submit the contact form — messages are sent directly to `huntersbuis@gmail.com` via FormSubmit.

How it works

- The contact form uses FormSubmit, a free service that handles email delivery without needing SMTP configuration.
- No `.env` file or backend email setup required.
- Emails are sent in real-time to `hunter@sflinsider.com`.

Notes

- FormSubmit is free and reliable for personal use. If you need high-volume sending later, switch to SendGrid/Mailgun.
- To change the recipient email, edit `javascript/sendEmail.js` and update the FormSubmit endpoint URL (change `huntersbuis@gmail.com` to your preferred email).

