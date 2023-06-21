import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const port = process.env.PORT || 8000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PDT')
    .setDescription('PandaTalk : Daeduck Software Meister Highschool\'s notification service with allimtalk')
    .setVersion('1.0.0')
    .addTag('pandatalk')
    .build();
  const doc = SwaggerModule.createDocument(app, config) // 자동화 문서 생성

  SwaggerModule.setup('document', app, doc);

  await app.listen(port);
}
bootstrap();
