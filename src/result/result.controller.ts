import { Controller, Get, Headers, Param, Query, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiHeader, ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { ResultService } from './result.service';

@ApiTags('')
@UseFilters(new HttpExceptionFilter())
@Controller('result')
export class ResultController {
    constructor(
        private resultService: ResultService,
    ) {
        this.resultService = resultService;
    }
    @ApiOperation({ summary: "발송 결과 리스트 조회 API", description: "발송 결과를 게시판 형태로 하여금 10개 단위로 조회" })
    @ApiOkResponse({
        status: 200,
        description: "발송 결과 조회에 성공했습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiQuery({ name: 'cal', required: true })
    @ApiQuery({ name: 'pgNum', required: true })
    @Get('?')
    async getNoticeResult(
        @Headers() tokenDto: tokenDto,
        @Query('cal') cal: string,
        @Query('pgNum') pgNum: number
    ): Promise<void> {
        const data = await this.resultService.getNoticeResult(tokenDto, cal, pgNum);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "발송 결과 조회에 성공했습니다."
        })
    }

    @ApiOperation({ summary: "결과 상세 조회 API", description: "발송 내용과 결과를 상세히 조회" })
    @ApiOkResponse({
        status: 200,
        description: "발송 결과 상세 조회에 성공했습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiParam({ name: 'noticeID', type: 'number' })
    @Get(':noticeID')
    async getMoreInfoNotice(@Headers() tokenDto: tokenDto, @Param('noticeID') noticeID: number): Promise<void>{
        const data = await this.resultService.getMoreInfoNotice(tokenDto, noticeID);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "발송 결과 상세 조회에 성공했습니다."
        })
    }
}
