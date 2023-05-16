import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { CreateTeacherDto } from './DTO/CreateTeacher.dto';
import * as bcrypt from 'bcrypt';
import { LoggingTeacherDto } from './DTO/LoggingTeacher.dto';
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
        private readonly jwtService: JwtService
    ) {
        this.teacherRepository = teacherRepository;
        this.jwtService = jwtService;
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

    async LogAccTeacher(teacher: LoggingTeacherDto): Promise<Object> {

        const { teacherMail, teacherPW } = teacher;

        const thisTeacher = await this.teacherRepository.findOneBy({ teacherMail });
        if (!thisTeacher) throw new NotFoundException('계정을 찾을 수 없습니다');

        const isVaildatePW = await bcrypt.compare(teacherPW, thisTeacher.teacherPW);
        if (!isVaildatePW) throw new ConflictException('비밀번호가 일치하지 않습니다');

        return this.jwtService.sign({
                email: teacherMail,
                sub: thisTeacher.teacherID
            })
    }
}
