import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('Testing email transport...');
  console.log('User:', process.env.MAIL_USER);
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('Transport is ready!');
    
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: 'khangtdce181439@fpt.edu.vn',
      subject: 'Test OTP',
      text: 'Mã OTP của bạn là 123456',
    });
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email Test Failed:', error);
  }
}

testEmail();
