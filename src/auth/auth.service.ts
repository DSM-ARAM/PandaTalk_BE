import { ConflictException, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { authEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { userLogDto } from './dto/userLog.dto';
import { validateResultDto } from './dto/validateResult.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { userAccDto } from './dto/userAcc.dto';
import { tokenDto } from './dto/token.dto';

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
     * REQ : userLogID
     */
    async generateAccessToken(userID: number, userLogID: string): Promise<string>{
        const payload = {
            userID : userID[0],
            userLogID,
        }

        const accessToken = await this.jwtService.sign(payload, {
            secret: this.config.get<string>('process.env.JWT_SECRET_ACCESS')
        });

        return (`Bearer ${accessToken}`);
    }

    /** 
     *  리프레시 토큰 생성
     * 
     *  REQ : userLogID
     */
    async generateRefreshToken(userID: number): Promise<string>{
        const payload = {
            userID : userID[0]
        }
        
        const refreshToken = await this.jwtService.sign(payload, {
            secret: this.config.get<string>('process.env.JWT_SECRET_REFRESH'),
            expiresIn: '1d'
        })

        return (`Bearer ${refreshToken}`);
    }

    /**
     * 액세스토큰 유효성 확인하기
     * 
     * REQ : accessToken
     */
    async accessValidate(tokenDto: tokenDto): Promise<validateResultDto>{
        const accessSecret: string = this.config.get<string>('process.env.JWT_SECRET_ACCESS');
        const accesstoken: string = tokenDto.accesstoken.replace('Bearer ', '');
        const thisAccess = await this.jwtService.verify(accesstoken, { secret : accessSecret });

        if (!thisAccess) {
            const thisRefresh = await this.refreshValidate(tokenDto);
            if (!thisRefresh) {
                throw new UnauthorizedException(); // 리프레시토큰 없으면 401 에러
            }
            const newAccess = await this.generateAccessToken(thisRefresh.userID, thisRefresh.userLogID);
            const thisVerify = this.jwtService.verify(newAccess, { secret: accessSecret });
            await this.client.set(`${thisVerify.payload.userLogID}AccessToken`, newAccess);
            
            return thisVerify;
        };

        return thisAccess;
    }

    /**
     * 리프레시토큰 유효성 확인하기
     * 
     */
    async refreshValidate(tokenDto: tokenDto): Promise<validateResultDto> {
        const refreshSecret: string = process.env.JWT_SECRET_REFRESH;
        const refreshtoken: string = tokenDto.refreshtoken.replace('Bearer ', '')
        const thisRefresh = await this.jwtService.verify(refreshtoken, { secret: refreshSecret });

        if (!thisRefresh) {
            throw new UnauthorizedException();
        }
        
        return thisRefresh;
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

        const accessToken = await this.generateAccessToken(thisUser.userID, userLogID); // AccessToken 생성
        const refreshToken = await this.generateRefreshToken(thisUser.userID); // RefreshToken 생성

        await this.client.set(`${thisUser.userID}AccessToken`, accessToken); // redis에 accessToken 저장
        await this.client.set(`${thisUser.userID}RefreshToken`, refreshToken); // redis에 refreshToken 저장

        const token = {
            accessToken,
            refreshToken,
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
            ownGroups: null
        })

        console.log(thisUser)

        return thisUser;
    }

    /**
     * 로그아웃
     * 
     * REQ : accessToken, refreshToken
     */
    async logOut(token: tokenDto): Promise<string> { // 헤더가 통으로 들어감,,,

        const userLogID = (await this.accessValidate({
            accesstoken: token.accesstoken,
            refreshtoken: token.refreshtoken
        })).userLogID;

        const thisUser = await this.authEntity.findOneBy({ userLogID }); // 사용자 찾기
        if (!thisUser) {
            throw new NotFoundException();
        }

        await this.client.set(`${thisUser.userID}AccessToken`, null); // 액세스토큰 값 비우기

        return this.client.get(`${thisUser.userID}AccessToken`); // 데이터가 비었는지 확인 용도
    }
}