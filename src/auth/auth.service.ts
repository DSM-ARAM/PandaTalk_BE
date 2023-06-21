import { ConflictException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { authEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { userLogDto } from './dto/userLog.dto';

@UseFilters(new HttpExceptionFilter()) // APP_FILTER
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>, // REPOSITORY 주입받기
        private jwtService: JwtService // JWTService 주입받기
    ) {
        this.authEntity = authEntity;
        this.jwtService = jwtService;
    }

    async logIn(userLogDto: userLogDto): Promise<any> { // 로그인
        const { userLogID, userPW } = userLogDto; // 아이디와 비밀번호 받아오기

        const thisUser = await this.authEntity.findOne({ where: {userLogID} }); // 아이디로 해당 유저 찾기

        if (!thisUser) { // 해당 아이디로 검색한 결과 유저가 없음 -> 404
            throw new NotFoundException();
        }

        if (!(await bcrypt.compare(userPW, thisUser.userPW))) { // 비밀번호가 일치하지 않는 경우 -> 409
            throw new ConflictException();
        }

        const accessToken = this.jwtService.sign({ // accessToken에 sign하기
            userID: thisUser.userID,
            userLogID: userLogID,
        });

        return accessToken; // accessToken 반환
    }
}
