import express, { Request, Response } from 'express';
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

import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './config/swagger';
import { config } from './config/config';
import CustomError from './utils/CustomError';
import globalErrorHandler from './utils/globalErrorHandler';

const app = express();

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(mongoSanitize());
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: `Too many requests from this IP , please try again in a hour`,
});

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
  res.send('Hello! Welcome to Vocational Placement Management API.');
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

app.all('*', (req, res, next) => {
  return next(
    new CustomError(`Cant find ${req.originalUrl} on this server.`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
