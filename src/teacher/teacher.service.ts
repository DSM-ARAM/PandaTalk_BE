import { BadRequestException, ConflictException, Injectable, NotFoundException, Options, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { CreateTeacherDto } from './dto/CreateTeacher.dto';
import * as bcrypt from 'bcrypt';
import { LoggingTeacherDto } from './dto/LoggingTeacher.dto';
import { JwtService } from '@nestjs/jwt'
import { DeleteTeacherTokenDto } from './dto/DeleteTeacherToken.dto';
import { DecodedTeacherTokenDto } from './dto/DecodedTeacherToken.dto';


@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
        private readonly jwtService: JwtService
    ) {
        this.teacherRepository = teacherRepository;
        this.jwtService = jwtService;
    }

    async createAccTeacher(teacher: CreateTeacherDto): Promise<string>{
        if (!teacher) return 'BadRequestException';

        const thisTeacher = await this.teacherRepository.findOne({
            where: [
                { teacherMail: teacher.teacherMail },
                { teacherPhone: teacher.teacherPhone },
            ]
        })
        if (thisTeacher) return 'ConflictException';

        const teacherPW = await bcrypt.hash(teacher.teacherPW, 10);
        await this.teacherRepository.save({
            teacherName: teacher.teacherName,
            teacherDepartment: teacher.teacherDepartment,
            teacherMail: teacher.teacherMail,
            teacherPhone: teacher.teacherPhone,
            teacherPW: teacherPW
        });

        return 'success';
    }

    async deleteAccTeacher(token: DeleteTeacherTokenDto): Promise<string>{
        const secret = process.env.JWT_SECRET_KEY;

        const auth: string = token.authorization.replace('Bearer ', '');

        if (!this.jwtService.verifyAsync(auth, { secret })) return 'UnauthorizedException';

        const teacherID = await this.jwtService.decode(auth, { complete: true }).payload.id;

        const thisTeacher = await this.teacherRepository.findOne({ where: { teacherID } })
        console.log(thisTeacher, 'hello!');
        if (!thisTeacher || thisTeacher == null) return 'NotFoundException';
        
        await this.teacherRepository.remove(thisTeacher);

        return 'Success';
    }

    async LogAccTeacher(teacher: LoggingTeacherDto): Promise<string> {

        const { teacherMail, teacherPW } = teacher;

        const thisTeacher = await this.teacherRepository.findOneBy({ teacherMail });
        if (!thisTeacher) return 'NotFoundException'

        const isVaildatePW = await bcrypt.compare(teacherPW, thisTeacher.teacherPW);
        if (!isVaildatePW) return 'ConflictException';

        return this.jwtService.sign({
                email: teacherMail,
                id: thisTeacher.teacherID
        })
    }
}
