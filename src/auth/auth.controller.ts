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

    @Post()
    async logIn(@Body() userLogDto: userLogDto): Promise<void> {
        const log = await this.authService.logIn(userLogDto);

        return Object.assign({
            data: log,
            statusCode: 201,
            statusMsg: "로그인에 성공했습니다."
        })
    }
}
