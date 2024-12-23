import nodemailer, { Transporter } from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import { config } from '../config/config';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  htmlContent?: string;
}

const validateEnvVars = () => {
  const requiredVars = ['NODEJS_GMAIL_APP_USER', 'NODEJS_GMAIL_APP_PASSWORD'];
  requiredVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is not set.`);
    }
  });
};

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    validateEnvVars();

    // const transporter: Transporter = nodemailer.createTransport({
    //   host: 'live.smtp.mailtrap.io',
    //   port: 587,
    //   secure: false, // use SSL
    //   auth: {
    //     user: config.gmailAppUsername,
    //     pass: config.gmailAppPassword,
    //   }
    // });
    const transporter: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmailAppUsername,
        pass: config.gmailAppPassword,
      },
    });

    const mailOptions: SendMailOptions = {
      from: 'Queensford Education <noreply@queenford.edu.au>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed. Please try again later.');
  }
};

const emailService = {
  sendEmail,
};

export default emailService;
