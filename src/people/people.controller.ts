import { Body, Controller, Get, Headers, Post, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { createGroupDto } from './dto/createGroup.dto';
import { groupIs } from './entity/group.entity';
import { PeopleService } from './people.service';

@ApiTags('구성원 관리 API')
@UseFilters(new HttpExceptionFilter())
@Controller('people')
export class PeopleController {
    constructor(
        private peopleService: PeopleService,
    ) {
        this.peopleService = peopleService;
    }

    @ApiOperation({ summary: "그룹 리스트 가져오기 API", description: "사용자가 권한을 가진 그룹 리스트를 가져옴" })
    @ApiOkResponse({
        status: 200,
        description: "그룹 리스트 가져오기에 성공했습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @Get('group?')
    async getGroupList(
        @Headers() tokenDto: tokenDto,
        @Query('group') group: groupIs,
    ): Promise<void> {
        const data = await this.peopleService.getGroupList(tokenDto, group);
        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "그룹 리스트 가져오기에 성공했습니다."
        })
    }

    @ApiOperation({ summary: "그룹 만들기 API", description: "사용자가 소유한 그룹 만들기" })
    @ApiCreatedResponse({
        status: 201,
        description: "그룹을 성공적으로 만들었습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiBody({ type: createGroupDto })
    @Post('new')
    async createGroup(@Headers() tokenDto: tokenDto, @Body() createGroupDto: createGroupDto): Promise<void>{
        const data = await this.peopleService.createGroup(tokenDto, createGroupDto);

        return Object.assign({
            data,
            statusCode: 201,
            statusMsg: "그룹을 성공적으로 만들었습니다."
        })
    }
}