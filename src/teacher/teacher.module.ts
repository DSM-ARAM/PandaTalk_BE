import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entity/teacher.entity';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { JwtStrategy } from 'src/token/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Teacher]
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET_KEY
    }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, JwtStrategy],
  exports: [TeacherService],
})

export class TeacherModule {}
