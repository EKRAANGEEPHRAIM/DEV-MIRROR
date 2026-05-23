import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //global validation Dto

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // whitelist: true, remove any extra properties from the request body
      forbidNonWhitelisted: true, // forbidNonWhitelisted: true, throw an error if any extra properties are found
      transform: true, // transform: true, transform the request body to the DTO
    }),
  );

  // CORS
  app.enableCors({
    origin: 'http://localhost:4200', // frontend URL
    credentials: true, // allow credentials
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
