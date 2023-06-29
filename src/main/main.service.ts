import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { tokenDto } from 'src/auth/dto/token.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { noticeEntity } from 'src/notice/entity/notice.entity';
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
    async getMainPage(tokenDto: tokenDto): Promise<object> {
        const { userID } = await this.authService.accessValidate(tokenDto);

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
            user: {
                userName: thisUser.userName,
                userDepartment: thisUser.userDepartment
            },
            notice: {
                recently: recentlyNoticeList,
                my: myNoticeList
            }
        }
    }
}
