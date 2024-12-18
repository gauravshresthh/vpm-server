import express, { Request, Response } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import path from 'path';

import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './config/swagger';

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
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: `Too many requests from this IP , please try again in a hour`,
});

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

export default app;
