import { ConflictException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { authEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { userLogDto } from './dto/userLog.dto';
import { generateAccessTokenDto } from './dto/generateAccessToken.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { userAccDto } from './dto/userAcc.dto';

@UseFilters(new HttpExceptionFilter()) // APP_FILTER
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>, // REPOSITORY 주입받기
        @InjectRedis() private readonly client: Redis,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {
        this.authEntity = authEntity;
        this.jwtService = jwtService;
    }

    /**
     * 액세스 토큰 생성
     * 
     * REQ : userID, userLogID
     */
    async generateAccessToken(generateAccessTokenDto: generateAccessTokenDto): Promise<string>{
        const payload: generateAccessTokenDto = {
            userID: generateAccessTokenDto.userID,
            userLogID: generateAccessTokenDto.userLogID
        }

        const accessToken = this.jwtService.signAsync(payload, {
            secret: this.config.get<string>('process.env.JWT_SECRET_ACCESS')
        });

        return accessToken;
    }

    /** 
     *  리프레시 토큰 생성
     * 
     *  REQ : userID, userLogID
     */
    async generageRefreshToken(generateAccessToken: generateAccessTokenDto): Promise<string>{
        const payload = {
            userID: generateAccessToken.userID,
            userLogID: generateAccessToken.userLogID,
        }
        
        const refreshToken = this.jwtService.signAsync({userID : payload.userID}, {
            secret: this.config.get<string>('process.env.JWT_SECRET_REFRESH'),
            expiresIn: '1d'
        })

        return refreshToken;
    }

    /**
     * 로그인, 액세스 & 리프레시 토큰 발급
     * 
     * REQ : userLogID, userPW
     */
    async logIn(userLogDto: userLogDto): Promise<object> { // 로그인
        const { userLogID, userPW } = userLogDto; // 아이디와 비밀번호 받아오기

        const thisUser = await this.authEntity.findOne({ where: {userLogID} }); // 아이디로 해당 유저 찾기

        if (!thisUser) { // 해당 아이디로 검색한 결과 유저가 없음 -> 404
            throw new NotFoundException();
        }

        if (!(await bcrypt.compare(userPW, thisUser.userPW))) { // 비밀번호가 일치하지 않는 경우 -> 409
            throw new ConflictException();
        }

        const accessToken = await this.generateAccessToken({userID: thisUser.userID, userLogID}); // AccessToken 생성
        const refreshToken = await this.generageRefreshToken({ userID: thisUser.userID, userLogID }); // RefreshToken 생성

        await this.client.set(`${thisUser.userID}AccessToken`, accessToken); // redis에 accessToken 저장
        await this.client.set(`${thisUser.userID}RefreshToken`, refreshToken); // redis에 refreshToken 저장

        const token = {
            accessToken,
            refreshToken
        }

        return token; // accessToken 반환
    }

    /**
     * 회원가입
     * 
     * REQ : userLogID, userPW, user
     */
    async createUserAccount(userAccDto: userAccDto): Promise<object>{
        const { userLogID, userPW, userName, userDepartment } = userAccDto;

        if (await this.authEntity.findOneBy({ userLogID })) {
            throw new ConflictException();
        }

        const hashedUserPW: string = await bcrypt.hash(userPW, 10);

        const thisUser = await this.authEntity.save({
            userLogID,
            userPW: hashedUserPW,
            userName,
            userDepartment,
        })

        return thisUser;
    }
}
