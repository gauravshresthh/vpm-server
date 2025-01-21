import nodemailer, { Transporter } from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import { config } from '../config/config';
import CustomError from '../utils/CustomError';

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
      throw new CustomError(
        `Environment variable ${variable} is not set.`,
        400
      );
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
  }
};

const emailService = {
  sendEmail,
};

export default emailService;
