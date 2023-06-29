import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { PeopleService } from 'src/people/people.service';
import { authEntity } from 'src/auth/entity/auth.entity';
import { groupEntity } from 'src/people/entity/group.entity';
import { peopleEntity } from 'src/people/entity/people.entity';
import { noticeEntity } from './entity/notice.entity';
import { noticeAdditionalEntity } from './entity/noticeAdditional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      authEntity,
      groupEntity,
      peopleEntity,
      noticeEntity,
      noticeAdditionalEntity
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
  providers: [AuthService, PeopleService, NoticeService],
  controllers: [NoticeController]
})
export class NoticeModule {}
