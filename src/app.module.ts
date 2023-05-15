import { Module } from '@nestjs/common';
import { TeacherModule } from './teacher/teacher.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher/entity/teacher.entity';
import { TeacherController } from './teacher/teacher.controller';

const port = process.env.DB_PORT

@Module({
  imports: [
    TeacherModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Teacher],
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
    }),
  ],
  controllers: [TeacherController],
  providers: [],
})
export class AppModule {}
