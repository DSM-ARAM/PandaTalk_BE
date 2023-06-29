import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/auth/entity/auth.entity';
import { groupEntity } from 'src/people/entity/group.entity';
import { peopleEntity } from 'src/people/entity/people.entity';
import { noticeEntity } from 'src/notice/entity/notice.entity';
import { noticeAdditionalEntity } from 'src/notice/entity/noticeAdditional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      authEntity,
      groupEntity,
      peopleEntity,
      noticeEntity,
      noticeAdditionalEntity,
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
  providers: [AuthService, ResultService],
  controllers: [ResultController]
})
export class ResultModule {}
