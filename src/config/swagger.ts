/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const schemas: Record<string, any> = {};

// Dynamically read all schema files
const schemaFiles = fs.readdirSync(path.resolve(__dirname, 'schemas'));
schemaFiles.forEach((file) => {
  try {
    if (file.endsWith('.ts')) {
      const schemaName = path.basename(file, '.ts');
      schemas[schemaName] = require(`./schemas/${file}`).default;
    }
  } catch (err) {
    console.error(`Error loading schema file ${file}:`, err);
  }
});

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description:
        'API documentation for Vocational Placement Management server.',
      contact: {
        name: 'Gaurav Shrestha',
        email: 'gauravshresthh@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
