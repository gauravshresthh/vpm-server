import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/vpm',
  jwtSecret: process.env.JWT_SECRET || 'random_file',
  gmailAppUsername: process.env.NODEJS_GMAIL_APP_USER,
  gmailAppPassword:process.env.NODEJS_GMAIL_APP_PASSWORD
};

export { config };
