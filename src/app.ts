import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import passport from './config/passport';
import session from 'express-session';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import systemAdminRoutes from './routes/systemAdminRoutes';
import providerRoutes from './routes/providerRoutes';
import documentRoutes from './routes/documentRoutes';
import documentCategoryRoutes from './routes/documentCategoryRoutes';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import invitationRoutes from './routes/invitationRoutes';

import swaggerUi from 'swagger-ui-express';

import { config } from './config/config';
import CustomError from './utils/CustomError';
import globalErrorHandler from './utils/globalErrorHandler';
import { swaggerDocs } from './swagger/swagger';
import { logger, requestLogger } from './utils/logger';
import userAgentBlock from './middlewares/userAgentBlock';
import attackDetection from './middlewares/attackDetection';
import forbiddenPathsMiddleware from './middlewares/forbiddenPaths';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.set('trust proxy', 1);
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

app.use(mongoSanitize());
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: `Too many requests from this IP , please try again in a hour`,
});

// Apply middlewares
app.use(userAgentBlock);
app.use(attackDetection);
app.use(forbiddenPathsMiddleware);
app.use(rateLimiter);

app.use(
  session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', limiter);
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello! Welcome to Vocational Placement Management API !',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/system-admin', systemAdminRoutes);
app.use('/api/v1/providers', providerRoutes);

// Document APIs
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/document-categories', documentCategoryRoutes);

// Inbox APIs
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/invitations', invitationRoutes);

app.all('*', (req, res, next) => {
  logger.warn(`Route not found: ${req.originalUrl}`, {
    ip: req.ip,
    method: req.method,
  });
  return next(
    new CustomError(`Cant find ${req.originalUrl} on this server.`, 404)
  );
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    statusCode: err.statusCode,
  });
  globalErrorHandler(err, req, res, next);
});

export default app;
