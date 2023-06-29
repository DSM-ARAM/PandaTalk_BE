import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { createGroupDto } from './dto/createGroup.dto';
import { peopleDto } from './dto/people.dto';
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

    @ApiOperation({ summary: "그룹 삭제하기 API", description: "사용자가 소유한 그룹 삭제하기" })
    @ApiNoContentResponse({
        status: 204,
        description: "그룹을 성공적으로 삭제했습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiParam({ name: 'groupID', type: 'number' })
    @Delete(':groupID')
    async deleteGroup(@Headers() tokenDto: tokenDto, @Param() groupID: number): Promise<void> {
        const data = await this.peopleService.deleteGroup(tokenDto, groupID);

        return Object.assign({
            data,
            statusCode: 204,
            statusMsg: "그룹을 성공적으로 삭제했습니다."
        })
    }

    @ApiOperation({ summary: "그룹 멤버 불러오기 API", description: "특정 그룹에 소속된 멤버 확인" })
    @ApiOkResponse({
        status: 200,
        description: "그룹 멤버를 성공적으로 불러왔습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiParam({ name: 'groupID', type: 'number' })
    @Get('member/:groupID')
    async getGroupMemberList(@Headers() tokenDto: tokenDto, @Param() groupID: number): Promise<void>{
        const data = await this.peopleService.getGroupMemberList(tokenDto, groupID);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "그룹 멤버를 성공적으로 불러왔습니다."
        })
    }

    @ApiOperation({ summary: "그룹 멤버 추가하기 API", description: "특정 그룹에 멤버 추가" })
    @ApiCreatedResponse({
        status: 201,
        description: "그룹 멤버를 성공적으로 추가하였습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiParam({ name: 'groupID', type: 'number' })
    @ApiBody({ type: [peopleDto] })
    @Post('member')
    async add(@Headers() tokenDto: tokenDto, @Body('peopleDto') peopleDto: peopleDto[]): Promise<void>{
        const data = await this.peopleService.addPeopleIntoGroup(tokenDto, peopleDto);

        return Object.assign({
            data,
            statusCode: 201,
            statusMsg: "그룹 멤버를 성공적으로 추가하였습니다."
        })
    }

    @ApiOperation({ summary: "그룹 멤버 개별 추가하기 API", description: "한 명만 멤버 추가" })
    @ApiCreatedResponse({
        status: 201,
        description: "그룹 멤버를 성공적으로 추가하였습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiParam({ name: 'groupID', type: 'number' })
    @ApiBody({ type: peopleDto })
    @Post('member/:groupID')
    async addOneMemberIntoGroup(
        @Headers() tokenDto: tokenDto,
        @Param('groupID') groupID: number,
        @Body() peopleDto: peopleDto): Promise<void> {
        const data = await this.peopleService.addOneGroupMember(tokenDto, groupID, peopleDto);
        
        return Object.assign({
            data,
            statusCode: 201,
            statusMsg: "그룹 멤버를 성공적으로 추가하였습니다."
        })
    }

    @ApiOperation({ summary: "그룹에서 멤버 삭제 API", description: "특정 그룹에서 특정 멤버 삭제" })
    @ApiNoContentResponse({
        status: 204,
        description: "그룹 멤버를 성공적으로 삭제하였습니다."
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @ApiParam({ name: 'groupID', type: 'number' })
    @ApiBody({ type: 'number[]' })
    @Delete('member/:groupID')
    async deleteMemberOnGroup(
        @Headers() tokenDto: tokenDto,
        @Param('groupID') groupID: number,
        @Body('peopleIDList') peopleIDList: number[]) {
        const data = await this.peopleService.deleteGroupMember(tokenDto, groupID, peopleIDList);

        return Object.assign({
            data,
            statusCode: 204,
            statusMsg: "그룹 멤버를 성공적으로 삭제하였습니다."
        })
    }
}