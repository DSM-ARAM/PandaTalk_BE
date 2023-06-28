import { ConflictException, Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { tokenDto } from 'src/auth/dto/token.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { createGroupDto } from './dto/createGroup.dto';
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
                select: ['groupID', 'groupName']
            })            
            return list;
        }
        else if (group == 'personal') {
            const list = await this.groupEntity.find({
                where: { groupOwner: thisUser },
                select: ['groupName']
            })

            return list;            
        }
        throw new ConflictException();
    }

    async createGroup(tokenDto: tokenDto, createGroupDto: createGroupDto): Promise<object>{
        const userID = (await this.authService.accessValidate(tokenDto)).userID;

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();

        const newGroup = await this.groupEntity.save({
            groupName: createGroupDto.groupName,
            groupIs: createGroupDto.groupIs,
            groupOwner: thisUser,
            groupExtendsID: createGroupDto.groupExtendsID,
            groupSuperID: createGroupDto.groupSuperID
        });

        return newGroup;
    }
}