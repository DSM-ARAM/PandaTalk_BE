import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entity/teacher.entity';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Teacher]
    )
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})

export class TeacherModule {}
