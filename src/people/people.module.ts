import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { groupEntity } from './entity/group.entity';
import { peopleEntity } from './entity/people.entity';
import { AuthService } from 'src/auth/auth.service';
import { authEntity } from 'src/auth/entity/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      authEntity,
      groupEntity,
      peopleEntity,
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
  providers: [AuthService, PeopleService],
  controllers: [PeopleController]
})
export class PeopleModule {}
