import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Sequelize and PostgreSQL Developed by Zettabyte Team',
    version: '1.0.0',
    description: 'This is a REST API application made with Express, Sequelize, and PostgreSQL.',
    license: {
      name: 'Licensed Under --',
      url: 'https://zettabyte.com.pk/',
    },
    contact: {
      name: 'API Support',
      url: 'https://zettabyte.com.pk/',
      email: 'akhlaqaltaf4@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Local Development server',
    },
    {
      url: 'https://ellista.habajumla.com',
      description: 'Production server',
    },
    {
      url: 'https://staging.api.com',
      description: 'Staging server',
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['email', 'name'],
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/user.routes.js'), // Only include user routes
  ],
};


const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;