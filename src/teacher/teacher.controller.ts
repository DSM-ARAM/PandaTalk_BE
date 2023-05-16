import { Body, Controller, Delete, Post } from '@nestjs/common';
import { LoggingTeacherDto } from './DTO/LoggingTeacher.dto';
import { Teacher } from './entity/teacher.entity';
import { TeacherService } from './teacher.service';

@Controller('auth')
export class TeacherController {
    constructor(
        private teacherService: TeacherService
    ) {
        this.teacherService = teacherService;
    }

    @Post('signUp')
    async createAccTeacher(@Body() teacher: Teacher): Promise<Object> {
        await this.teacherService.createAccTeacher(teacher);
        return Object.assign({
            data: { ...teacher },
            statusCode: 200,
            statusMsg: 'Success'
        })
    }

    @Delete('signUp')
    async deleteAccTeacher(@Body() teacherID: number): Promise<Object> {
        await this.teacherService.deleteAccTeacher(teacherID);
        return Object.assign({
            data: {},
            statusCode: 204,
            statusMsg: 'Success'
        })
    }

    @Post('signIn')
    async loggingAccTeacher(@Body() teacher: LoggingTeacherDto): Promise<Object> {
        const token = await this.teacherService.LogAccTeacher(teacher);
        return Object.assign({
            data: {token},
            statusCode: 201,
            statusMsg: 'Success'
        })
    }
}
