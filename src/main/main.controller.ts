import { Body, Controller, Get, Header, Headers, Post, UseFilters } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { noticeDto } from 'src/notice/dto/notice.dto';
import { getHeaderResultDto } from './dto/getHeaderResult.dto';
import { getMainResultDto } from './dto/getMainResult.dto';
import { MainService } from './main.service';

@ApiTags('Main')
@UseFilters(new HttpExceptionFilter())
@Controller('main')
export class MainController {
    constructor(
        private mainService: MainService,
    ) {
        this.mainService = mainService;
    }

    @ApiOperation({ summary: "메인 페이지", description: "메인 페이지 접속 시 보이는 화면" })
    @ApiHeader({ name: "accesstoken", required: true})
    @ApiHeader({ name: "refreshtoken", required: true })
    @ApiOkResponse({
        status: 200,
        description: "메인 페이지에 접속 성공하였습니다.",
        type: getMainResultDto
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "로그인 없이 접속 시도"
    })
    @Get('')
    async getMainPage(@Headers('authorization') accesstoken: string): Promise<void> {
        const data = await this.mainService.getMainPage(accesstoken);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "메인 페이지에 접속 성공하였습니다."
        })
    }
    
    @ApiOperation({ summary: "헤더", description: "유저 정보" })
    @ApiHeader({ name: "accesstoken", required: true })
    @ApiHeader({ name: "refreshtoken", required: true })
    @ApiOkResponse({
        status: 200,
        description: "헤더 데이터를 성공적으로 가져왔습니다.",
        type: getHeaderResultDto
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "로그인하지 않고 접속 시도"
    })
    @Get('header')
    async getHeader(@Headers('authorization') accesstoken: string) {
        const data = await this.mainService.getHeader(accesstoken);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "헤더 데이터를 성공적으로 가져왔습니다."
        })
    }

    @ApiOperation({summary:"임시 글 작성 Api", description: "알림발송 미구현 상태에서 임시로 글 작성 가능하도록 함"})
    @ApiCreatedResponse({
        status: 201,
        description: "작성 완료",
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "로그인하지 않은 상태로 접속 시도"
    })
    @ApiConflictResponse({
        status: 409,
        description: "올바르지 않은 상태 입력"
    })
    @Post('notice')
    async notice(@Headers('authorization') accesstoken: string, @Body() noticeDto: noticeDto) {
        const data = await this.mainService.Board(accesstoken, noticeDto);

        return Object.assign({
            data, 
            statusCode: 201,
            statusMsg: "작성 완료"
        })
    }
}
