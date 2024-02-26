import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'; // Updated import
import { Express } from 'express';

export function setupSwagger(app: Express): void {
  const options: swaggerJsdoc.Options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Title',
        description: 'Your API Description',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:4000/api/v1',
        },
      ],
    },
    apis: ['./src/presentation/utils/swaggerDocx/*.yaml'], // Adjust the path to your route files accordingly
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Updated usage
}
