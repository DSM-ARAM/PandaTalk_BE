import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiHeader, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
    @ApiUnauthorizedResponse({
        status: 401,
        description: "로그인 없이 접속 시도"
    })
    @ApiConflictResponse({
        status: 409,
        description: "올바르지 않은 파라미터 값"
    })
    @ApiHeader({ name: 'accesstoken', required: true })
    @ApiHeader({ name: 'refreshtoken', required: true })
    @Get('group?')
    async getGroupList(
        @Headers() accesstoken: string,
        @Query('group') group: groupIs,
    ): Promise<void> {
        const data = await this.peopleService.getGroupList(accesstoken, group);
        return Object.assign({
            data: data,
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
    async createGroup(@Headers() accesstoken: string, @Body() createGroupDto: createGroupDto): Promise<void>{
        const data = await this.peopleService.createGroup(accesstoken, createGroupDto);

        return Object.assign({
            data: data,
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
    async deleteGroup(@Headers() accesstoken: string, @Param() groupID: number): Promise<void> {
        const data = await this.peopleService.deleteGroup(accesstoken, groupID);

        return Object.assign({
            data: data,
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
    async getGroupMemberList(@Headers() accesstoken: string, @Param() groupID: number): Promise<void>{
        const data = await this.peopleService.getGroupMemberList(accesstoken, groupID);

        return Object.assign({
            data: data,
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
    async add(@Headers() accesstoken: string, @Body('peopleDto') peopleDto: peopleDto[]): Promise<void>{
        const data = await this.peopleService.addPeopleIntoGroup(accesstoken, peopleDto);

        return Object.assign({
            data: data,
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
        @Headers() accesstoken: string,
        @Param('groupID') groupID: number,
        @Body() peopleDto: peopleDto): Promise<void> {
        const data = await this.peopleService.addOneGroupMember(accesstoken, groupID, peopleDto);
        
        return Object.assign({
            data: data,
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
    @ApiParam({ name: 'groupID', type: 'number' })
    @ApiBody({ type: 'number[]' })
    @Delete('member/:groupID')
    async deleteMemberOnGroup(
        @Headers('authorization') accesstoken: string,
        @Param('groupID') groupID: number,
        @Body('peopleIDList') peopleIDList: number[]) {
        const data = await this.peopleService.deleteGroupMember(accesstoken, groupID, peopleIDList);

        return Object.assign({
            data: data,
            statusCode: 204,
            statusMsg: "그룹 멤버를 성공적으로 삭제하였습니다."
        })
    }
}