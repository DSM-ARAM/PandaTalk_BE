import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import { request } from 'express';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { AuthService } from './auth.service';
import { userLogDto } from './dto/userLog.dto';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {
        this.authService = authService;
    }

    @Post() // POST : 로그인 기능
    async logIn(@Body() userLogDto: userLogDto): Promise<void> {
        const log = await this.authService.logIn(userLogDto); // 로그인 기능 함수에 userLogDto 담아 함수 호출

        return Object.assign({
            data: log, // 로그인 함수의 결과를 담음
            statusCode: 201, // POST 성공 -> 201
            statusMsg: "로그인에 성공했습니다."
        })
    }
}
