import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import tokenConfig from 'src/config/token.config';
import { Group } from './entity/group.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forFeature( tokenConfig ),
    TypeOrmModule.forFeature(
      [Group, User]
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET_KEY
    }),
  ],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
