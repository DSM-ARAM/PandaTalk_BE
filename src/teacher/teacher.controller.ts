import { BadRequestException, Body, ConflictException, Controller, Delete, Headers, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/CreateTeacher.dto';
import { DeleteTeacherTokenDto } from './dto/DeleteTeacherToken.dto';
import { LoggingTeacherDto } from './dto/LoggingTeacher.dto';
import { TeacherService } from './teacher.service';

@Controller('auth')
export class TeacherController {
    constructor(
        private teacherService: TeacherService
    ) {
        this.teacherService = teacherService;
    }

    @Post('signUp')
    async createAccTeacher(@Body() teacher: CreateTeacherDto): Promise<Object> {
        const res = await this.teacherService.createAccTeacher(teacher);

        if (res == 'success') return Object.assign({
            data: {},
            statusCode: 200,
            statusMsg: 'Success'
        })
        else if (res == 'BadRequestException') throw new BadRequestException('정보 입력이 필요합니다.');
        else if (res == 'ConflictException') throw new ConflictException('이미 존재하는 이메일입니다.');
        else throw new BadRequestException('에러가 발생했습니다.');
    }

    @Delete('signUp')
    async deleteAccTeacher(@Headers() token: DeleteTeacherTokenDto): Promise<Object> {
        if (!token.authorization) throw new UnauthorizedException("로그인이 필요합니다.");

        const res = await this.teacherService.deleteAccTeacher(token);
        if (res == 'success') return Object.assign({
            data: {},
            statusCode: 204,
            statusMsg: 'Success'
        })
        else if (res == 'UnauthorizedException') throw new UnauthorizedException('로그인이 필요합니다.');
        else if (res == 'NotFoundException') throw new NotFoundException('계정을 찾을 수 없습니다.');
        else throw new BadRequestException('에러가 발생했습니다.');
    }

    @Post('signIn')
    async loggingAccTeacher(@Body() teacher: LoggingTeacherDto): Promise<Object> {
        const token = await this.teacherService.LogAccTeacher(teacher);

        if (token.length >= 20) return Object.assign({
            data: { token },
            statusCode: 201,
            statusMsg: 'Success'
        })
        else if (token == 'NotFoundException') throw new NotFoundException('계정을 찾을 수 없습니다.');
        else if (token == 'ConflictException') throw new ConflictException('비밀번호가 일치하지 않습니다.');
        else throw new BadRequestException('에러가 발생했습니다.');
    }
}
