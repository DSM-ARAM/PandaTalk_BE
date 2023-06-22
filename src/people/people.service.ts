import { ConflictException, HttpException, Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { tokenDto } from 'src/auth/dto/token.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { groupEntity, groupIs } from './entity/group.entity';
import { peopleEntity } from './entity/people.entity';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class PeopleService {
    constructor(
        private authService: AuthService,
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        @InjectRepository(groupEntity) private groupEntity: Repository<groupEntity>,
        @InjectRepository(peopleEntity) private peopleEntity: Repository<peopleEntity>,
    ) { 
        this.authService = authService;
    }
    
    async getGroupList(tokenDto: tokenDto, group: groupIs): Promise<object> {
        const thisUser = await this.authService.accessValidate(tokenDto)

        if (!thisUser) throw new UnauthorizedException();

        if (group == 'common') {
            const list = await this.groupEntity.find({
                where: { groupIs: groupIs.c }, 
                select: ['groupName']
            })            
            return list;
        }
        else if (group == 'personal') {
            const list = await this.groupEntity.find({
                where: { groupOwner: thisUser.userID },
                select: ['groupName']
            })

            return list;            
        }
        throw new ConflictException();
    }
}