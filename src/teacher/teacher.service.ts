import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { CreateTeacherDto } from './DTO/CreateTeacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>
    ) {
        this.teacherRepository = teacherRepository;
    }

    async createAccTeacher(teacher: CreateTeacherDto): Promise<void>{
        if (!teacher) throw new NotFoundException()

        const thisTeacher = await this.teacherRepository.findOne({
            where: [
                { teacherMail: teacher.teacherMail },
                { teacherPhone: teacher.teacherPhone },
            ]
        })
        if (thisTeacher) throw new ConflictException();

        const teacherPW = await bcrypt.hash(teacher.teacherPW, 10);
        await this.teacherRepository.save({
            teacherName: teacher.teacherName,
            teacherDepartment: teacher.teacherDepartment,
            teacherMail: teacher.teacherMail,
            teacherPhone: teacher.teacherPhone,
            teacherPW: teacherPW
        });

        return;
    }

    async deleteAccTeacher(teacherID: number): Promise<void>{

        const thisTeacher = await this.teacherRepository.findOneBy({ teacherID })
        if (!thisTeacher) throw new NotFoundException();
        
        await this.teacherRepository.remove(thisTeacher);

        return;
    }
}
