import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entity/teacher.entity';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { JwtStrategy } from 'src/token/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Teacher]
    ),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '4h' },
      })
    }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, JwtStrategy],
  exports: [TeacherService],
})

export class TeacherModule {}
