import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Sequelize and PostgreSQL',
    version: '1.0.0',
    description: 'A simplified REST API with basic authentication endpoints.',
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
    path.join(__dirname, '../routes/user.routes.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;