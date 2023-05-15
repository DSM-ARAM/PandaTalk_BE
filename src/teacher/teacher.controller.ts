import { Body, Controller, Post } from '@nestjs/common';
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
}
