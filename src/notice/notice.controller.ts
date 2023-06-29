import { Controller, Headers, UseFilters } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { NoticeService } from './notice.service';

@ApiTags('결과 조회 API')
@UseFilters(new HttpExceptionFilter())
@Controller('notice')
export class NoticeController {
    constructor(
        private noticeService: NoticeService,
    ) {
        this.noticeService = noticeService
    }

}