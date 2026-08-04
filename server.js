const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const nodemailer = require('nodemailer');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/send-email') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const name = payload.name || 'Unknown';
        const fromEmail = payload.email || '';
        const message = payload.message || '';

        // Configure transporter using environment variables. If SMTP is not configured,
        // create a test account (Ethereal) so developers can preview messages locally.
        let transporter;
        const smtpUser = process.env.SMTP_USER || '';
        const smtpHost = process.env.SMTP_HOST || '';

        if (smtpUser && smtpHost && !smtpHost.includes('example')) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          });
        } else {
          // No SMTP configured: create an Ethereal test account
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass
            }
          });
          console.log('Using Ethereal test account. Preview messages at runtime URL provided in the server log.');
        }

        const mailOptions = {
          from: process.env.SMTP_USER || 'no-reply@example.com',
          to: 'huntersbuis@gmail.com',
          subject: `Portfolio Contact from ${name}`,
          text: `Name: ${name}\nEmail: ${fromEmail}\n\n${message}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${fromEmail}</p><p>${message}</p>`,
          replyTo: fromEmail || undefined
        };

        const info = await transporter.sendMail(mailOptions);

        // If using Ethereal, provide preview URL to help local testing
        const previewUrl = nodemailer.getTestMessageUrl(info) || null;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, previewUrl }));
      } catch (err) {
        console.error('Email send error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
