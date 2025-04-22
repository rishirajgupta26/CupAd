const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'index.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'contact.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'about.html')));
app.get('/partner', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'partner.html')));
app.get('/team', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'team.html')));
app.get('/customize', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'customize.html')));

// POST /contact - handle form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Your Gmail address
      pass: process.env.EMAIL_PASS   // App password
    }
  });

  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO, // Your destination email
    subject: 'New Contact Form Submission',
    html: `
      <h2>New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
      return res.status(500).send('Something went wrong.');
    }
    res.status(200).send('Message sent successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
