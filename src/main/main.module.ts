import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/auth/entity/auth.entity';
import { groupEntity } from 'src/people/entity/group.entity';
import { peopleEntity } from 'src/people/entity/people.entity';
import { noticeEntity } from 'src/notice/entity/notice.entity';
import { noticeAdditionalEntity } from 'src/notice/entity/noticeAdditional.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      authEntity,
      noticeEntity,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRETORPRIVATE'),
        signOptions: {
          expiresIn: '4h'
        },
        verifyOptions: {
          complete: false,
        }
      })
    })
  ],
  providers: [AuthService, MainService],
  controllers: [MainController]
})
export class MainModule {}
