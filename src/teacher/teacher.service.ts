import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entity/teacher.entity';
import { CreateTeacherDto } from './dto/CreateTeacher.dto';
import * as bcrypt from 'bcrypt';
import { LoggingTeacherDto } from './dto/LoggingTeacher.dto';
import { JwtService } from '@nestjs/jwt'
import { DeleteTeacherTokenDto } from './dto/DeleteTeacherToken.dto';
import tokenConfig from 'src/config/token.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
        @Inject(tokenConfig.KEY) private config: ConfigType<typeof tokenConfig>,
        private readonly jwtService: JwtService
    ) {
        this.teacherRepository = teacherRepository;
        this.config = config;
        this.jwtService = jwtService;
    }

    accessSecret: string = this.config.accessSecret;
    refreshSecret: string = this.config.refreshSecret;

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
            teacherPW,
            teacherIsAdmin: teacher.teacherIsAdmin,
        });

        return 'success';
    }

    async deleteAccTeacher(token: DeleteTeacherTokenDto): Promise<string> {
        const access: string = token.accesstoken.replace('Bearer ', '');
        const refresh: string = token.refreshtoken.replace('Bearer ', '')

        if (!this.jwtService.verifyAsync(access, { secret: this.accessSecret })) {
            if (!this.jwtService.verifyAsync(refresh, { secret: this.refreshSecret })) return 'UnauthorizedException';
            else {
                const decrypt = this.jwtService.decode(token.refreshtoken, {
                    complete: true,
                })
                
                this.jwtService.sign({
                    email: decrypt.payload.email,
                    id: decrypt.payload.id,
                }, {
                    secret: this.accessSecret,
                    expiresIn: '4h'
                })
            }
        }

        const teacherID = this.jwtService.decode(access, { complete: true }).payload.id;

        const thisTeacher = await this.teacherRepository.findOne({ where: { teacherID } })

        if (!thisTeacher || thisTeacher == null) return 'NotFoundException';
        
        await this.teacherRepository.remove(thisTeacher);

        return 'success';
    }

    async LogAccTeacher(teacher: LoggingTeacherDto): Promise<string | Object> {

        const { teacherMail, teacherPW } = teacher;

        const thisTeacher = await this.teacherRepository.findOneBy({ teacherMail });
        if (!thisTeacher) return 'NotFoundException'

        const isVaildatePW = await bcrypt.compare(teacherPW, thisTeacher.teacherPW);
        if (!isVaildatePW) return 'ConflictException';

        const tokens = {
            accessToken: this.jwtService.sign({
                email: teacherMail,
                id: thisTeacher.teacherID
            }, {
                secret: this.accessSecret,
                expiresIn: '4h',
            }),
            refreshToken: await bcrypt.hash(this.jwtService.sign({
                email: teacherMail,
                id: thisTeacher.teacherID
            }, { 
                secret: this.refreshSecret,
                expiresIn: '168h'
            }), 10)
        }
        
        await this.teacherRepository.update(thisTeacher.teacherID, {
            teacherRefreshToken: this.jwtService.sign({
                email: teacherMail,
                id: thisTeacher.teacherID
            }, {
                secret: this.refreshSecret,
                expiresIn: '168h'
            }),
        })

        return tokens;
        
    }

    async LogOutAccTeacher(teacher: DeleteTeacherTokenDto): Promise<string> {
        const access: string = teacher.accesstoken.replace('Bearer ', '');
        const refresh: string = teacher.refreshtoken.replace('Bearer ', '');
        
        if (!this.jwtService.verifyAsync(access, { secret: this.accessSecret })) {
            if (!this.jwtService.verifyAsync(refresh, { secret: this.refreshSecret })) return 'UnauthroizedException';
            else {
                const decrypt = this.jwtService.decode(teacher.refreshtoken, {
                    complete: true,
                })
                
                this.jwtService.sign({
                    email: decrypt.payload.email,
                    id: decrypt.payload.id,
                }, {
                    secret: this.accessSecret,
                    expiresIn: '4h'
                })
            }
        }
        const teacherID = this.jwtService.decode(access, { complete: true }).payload.id;

        const thisTeacher = await this.teacherRepository.findOne({ where: { teacherID } })
        
        if (!thisTeacher || thisTeacher == null) return 'NotFoundException';

        await this.teacherRepository.update(thisTeacher, { teacherRefreshToken: null });

        return 'success';
    }
}
