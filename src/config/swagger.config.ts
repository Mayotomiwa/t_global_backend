import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('TGlobal Mock API')
  .setDescription('Mock backend for the React Native assignment')
  .setVersion('1.0')
  .build();