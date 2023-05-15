import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { CreateTeacherDto } from './DTO/teacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>
    ) {
        this.teacherRepository = teacherRepository;
    }

    async createAccTeacher(teacher: CreateTeacherDto): Promise<void>{
        if(!teacher) throw new NotFoundException()
        const teacherPW = await bcrypt.hash(teacher.teacherPW, 10);
        await this.teacherRepository.save({
            teacherName: teacher.teacherName,
            teacherDepartment: teacher.teacherDepartment,
            teacherMail: teacher.teacherDepartment,
            teacherPhone: teacher.teacherPhone,
            teacherPW: teacherPW
        });
        return;
    }
}
