import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a transporter using your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendNotification = (toEmail, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL, // Your email address
    to: toEmail, // Recipient's email address
    subject: subject,
    text: message, // Email content in plain text
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendNotification;
