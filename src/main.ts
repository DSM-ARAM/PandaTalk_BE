import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TeacherModule } from './teacher/teacher.module';

const port = process.env.PORT || 8000

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(port);
    console.log(`Success to link ${port}`)
  } catch (err) {
    console.error(err)
  }
}
bootstrap();
