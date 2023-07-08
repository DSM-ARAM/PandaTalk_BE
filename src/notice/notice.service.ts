import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { authEntity } from 'src/auth/entity/auth.entity';
import { groupEntity } from 'src/people/entity/group.entity';
import { peopleEntity } from 'src/people/entity/people.entity';
import { Between, Like, Repository } from 'typeorm';
import { noticeEntity } from './entity/notice.entity';
import { noticeAdditionalEntity } from './entity/noticeAdditional.entity';

@Injectable()
export class NoticeService {
    constructor(){}
}
