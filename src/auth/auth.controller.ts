import { Body, Controller, Delete, Header, Headers, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { AuthService } from './auth.service';
import { userLogDto } from './dto/userLog.dto';
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { userAccDto } from './dto/userAcc.dto';
import { tokenDto } from './dto/token.dto';

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
        description: '로그인에 성공했습니다.',
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

    @ApiOperation({ summary: "회원가입 API", description: "사용자 계정을 만들고 사용자 DB에 추가" })
    @ApiCreatedResponse({
        status: 201,
         description: '계정 생성에 성공했습니다.',
    })
    @ApiBody({ type: userAccDto }) // API의 Body로 userAccDto 받음
    @Post('signUp') // POST : 회원가입 기능
    async createAcc(@Body() userAccDto: userAccDto): Promise<void> {
        const acc = await this.authService.createUserAccount(userAccDto); // 회원가입 기능 함수에 userAccDto 담아 함수 호출

        return Object.assign({
            data: acc, // 회원가입 함수의 결과를 담음
            statusCode: 201, // POST 성공 -> 201
            statusMsg: "계정 생성에 성공했습니다."
        })
    }

    @ApiOperation({ summary: "로그아웃 API", description: "사용자의 액세스토큰 값을 삭제" })
    @ApiNoContentResponse({
        status: 204,
        description: "로그아웃에 성공했습니다.",
    })
    @ApiHeader({ name: 'accesstoken', required: true }) // accesstoken 필수
    @ApiHeader({ name: 'refreshtoken', required: true }) // refreshtoken 필수
    @Delete() // DELETE : 로그아웃 기능
    async logOut(@Headers() tokenDto: tokenDto): Promise<void> { // 헤더 전달
        const out = await this.authService.logOut(tokenDto); // 로그아웃 기능 함수에 헤더 담아 호출

        return Object.assign({
            data: out, // 빈 결과
            statusCode: 204, // DELETE 성공 -> 204
            statusMsg: "로그아웃에 성공했습니다."
        })
    }
}
