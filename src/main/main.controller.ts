import { Controller, Get, Headers, UseFilters } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
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
        description: "메인 페이지에 접속 성공하였습니다."
    })
    @Get('')
    async getMainPage(@Headers() tokenDto: tokenDto): Promise<void> {
        const data = await this.mainService.getMainPage(tokenDto);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "메인 페이지에 접속 성공하였습니다."
        })
    }
    
}
