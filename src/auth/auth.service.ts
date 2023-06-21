import { ConflictException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { authEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { userLogDto } from './dto/userLog.dto';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        private jwtService: JwtService
    ) {
        this.authEntity = authEntity;
        this.jwtService = jwtService;
    }

    async logIn(userLogDto: userLogDto): Promise<any> {
        const { userLogID, userPW } = userLogDto;

        const thisUser = await this.authEntity.findOne({ where: {userLogID} });

        if (!thisUser) {
            throw new NotFoundException();
        }

        if (!(await bcrypt.compare(userPW, thisUser.userPW))) {
            throw new ConflictException();
        }
        
        const user = {
            userID: thisUser.userID,
            userLogID,
        }

        const accessToken = await this.jwtService.sign({
            userID: thisUser.userID,
            userLogID: userLogID,
        });

        return accessToken;
    }
}
