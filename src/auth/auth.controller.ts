import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { AuthService } from './auth.service';
import { userLogDto } from './dto/userLog.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('사용자 계정 조작 API')
@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {
        this.authService = authService;
    }

    @ApiOperation({ summary: "로그인 API", description: "사용자 계정에 접속해 accessToken과 refreshToken을 발급" })
    @ApiCreatedResponse({
        status: 201,
        description: 'Created :: 로그인 성공',
      })
    @ApiBody({ type: userLogDto }) // API의 Body로 받는 userLogDto
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
