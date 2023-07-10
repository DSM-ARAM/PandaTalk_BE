import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { validateDto } from 'src/auth/dto/validate.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { noticeDto } from 'src/notice/dto/notice.dto';
import { noticeEntity, noticeStat } from 'src/notice/entity/notice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainService {
    constructor (
        private authService: AuthService,
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        @InjectRepository(noticeEntity) private noticeEntity: Repository<noticeEntity>,
    ) {
        this.authService = authService;
    }
    /**
     * @param tokenDto
     * 
     * @returns recentlyNoticeList, myNoticeList
     */
    async getMainPage(accesstoken: string): Promise<object> {
        const { userID } = await this.authService.accessValidate(accesstoken);

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();

        const recentlyNoticeList = await this.noticeEntity.find({
            order: {
                createdAt: 'ASC'
            },
            take: 4,
        })

        const myNoticeList = await this.noticeEntity.find({
            where: {
                noticeBy: userID,
            },
            order: {
                createdAt: 'ASC'
            },
            take: 4
        })

        return {
            recently: recentlyNoticeList,
            my: myNoticeList
        }
    }

    async getHeader(accesstoken: string): Promise<object> {
        const { userID } = await this.authService.accessValidate(accesstoken);

        const thisUser = await this.authEntity.findOne({ 
            where: { userID },
            select: ['userID', 'userName', 'userDepartment']
         });

        if (!thisUser) throw new UnauthorizedException();

        return thisUser;
    }

    async Board(accesstoken: string, noticeDto: noticeDto) {
        const { userID } = await this.authService.accessValidate(accesstoken);

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();

        if (noticeDto.noticeStat != noticeStat.b && noticeStat.c ) throw new ConflictException();

        const newNotice = await this.noticeEntity.save({
            noticeHead: noticeDto.noticeHead,
            noticeContent: noticeDto.noticeContent,
            noticeBy: noticeDto.noticeBy,
            noticeStat: noticeDto.noticeStat,
            noticeFor: noticeDto.noticeFor,
            noticeChecked: noticeDto.noticeChecked,
            createAt: noticeDto.createdAt,
        })

        return newNotice;
    }
}
