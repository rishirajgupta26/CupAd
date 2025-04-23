const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors')
const fs = require('fs')
const multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'public/uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage });

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

// POST /customize - handle form submission
app.post("/customize", upload.single("design-file"), (req, res) => {
  const {
    "customer-name": customerName,
    "customer-contact": contactNumber,
    "customer-address": deliveryAddress,
    "cup-size": cupSize,
    "design-coverage": designCoverage,
    "primary-color": primaryColor,
    features, // this can be an array if multiple checkboxes
  } = req.body;

  const fileInfo = req.file ? `<p><strong>Design File:</strong> ${req.file.originalname}</p>` : "<p>No file uploaded.</p>";
  const featureList = Array.isArray(features)
    ? features.join(", ")
    : features || "None";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const attachments = req.file
    ? [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ]
    : [];

  const mailOptions = {
    from: `"CupAd Order Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Cup Customization Order - ${customerName}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Contact Number:</strong> ${contactNumber}</p>
      <p><strong>Delivery Address:</strong><br>${deliveryAddress}</p>
      <hr>
      <h3>Customization Details:</h3>
      <p><strong>Cup Size:</strong> ${cupSize}</p>
      <p><strong>Design Coverage:</strong> ${designCoverage}</p>
      <p><strong>Primary Color:</strong> ${primaryColor}</p>
      <p><strong>Additional Features:</strong> ${featureList}</p>
      ${fileInfo}
    `,
    attachments: attachments
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).send("Something went wrong.");
    }
    fs.unlinkSync(req.file.path)
    res.status(200).send("Message sent successfully!");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
