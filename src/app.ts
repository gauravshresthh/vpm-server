import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import { connectDB } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './config/swagger';

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: true })
  );

connectDB();

export default app;
