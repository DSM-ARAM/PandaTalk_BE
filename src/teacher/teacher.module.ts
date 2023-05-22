import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entity/teacher.entity';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { JwtStrategy } from 'src/token/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import tokenConfig from 'src/config/token.config';


@Module({
  imports: [
    ConfigModule.forFeature( tokenConfig ),
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
