import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('The task manager API description')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/swagger', app, documentFactory, {
    jsonDocumentUrl: '/api/swagger/json',
  });

  const outputPath = join(process.cwd(), 'swagger-spec.json');
  writeFileSync(outputPath, JSON.stringify(documentFactory, null, 2));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
