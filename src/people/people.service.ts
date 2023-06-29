import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { tokenDto } from 'src/auth/dto/token.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { HttpExceptionFilter } from 'src/http-exception.filter/http-exception.filters';
import { Repository } from 'typeorm';
import { createGroupDto } from './dto/createGroup.dto';
import { peopleDto } from './dto/people.dto';
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
    /**
     * 그룹목록 가져오기
     * 
     * @param tokenDto 
     * @param group 
     * @returns entityObject(groupID, groupName)
     */
    async getGroupList(tokenDto: tokenDto, group: groupIs): Promise<object> {
        const { userID } = await this.authService.accessValidate(tokenDto);

        const thisUser = await this.authEntity.findOneByOrFail({ userID });

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
                select: ['groupID', 'groupName']
            })

            return list;            
        }
        throw new ConflictException();
    }

    /**
     * 그룹 생성
     * 
     *  @param tokenDto
     *  @param createGroupDto
     *  @returns newGroup
     */
    async createGroup(tokenDto: tokenDto, createGroupDto: createGroupDto): Promise<object>{
        const userID = (await this.authService.accessValidate(tokenDto)).userID;

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();

        if (thisUser.userName != 'admin' && createGroupDto.groupIs == groupIs.c) throw new ForbiddenException();
        else if (thisUser.userName == 'admin' && createGroupDto.groupIs == groupIs.p) throw new ForbiddenException();

        const thisGroup = await this.groupEntity.findOneBy({
            groupName: createGroupDto.groupName,
            groupOwner: thisUser
        })

        console.log(thisGroup)

        if (thisGroup) throw new ConflictException();



        const newGroup = await this.groupEntity.save({
            groupName: createGroupDto.groupName,
            groupIs: createGroupDto.groupIs,
            groupOwner: thisUser,
            groupOwnerID: thisUser.userID,
            groupSuperID: createGroupDto.groupSuperID
        });

        return newGroup;
    }

    /**
     * 그룹 삭제
     * 
     * @param tokenDto
     * @param groupID
     * 
     * @returns null
     */
    async deleteGroup(tokenDto: tokenDto, groupID: number): Promise<void> {
        const userID = (await this.authService.accessValidate(tokenDto)).userID;

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();

        const thisGroup = await this.groupEntity.findOneBy({ groupID, groupOwner: thisUser });

        if (!thisGroup) throw new NotFoundException();
        if (thisGroup.groupOwner != thisUser) throw new ForbiddenException();

        await this.groupEntity.delete({ groupOwner: thisUser });

        return;
    }

    /**
     * 구성원 목록 불러오기
     * 
     * @param tokenDto
     * @param groupID
     * 
     * @returns groupMemberList
     */
    async getGroupMemberList(tokenDto: tokenDto, groupID: number): Promise<object[]> {
        const { userID } = (await this.authService.accessValidate(tokenDto));
        const thisUser = await this.authEntity.findOneByOrFail({ userID });

        if (!thisUser) throw new UnauthorizedException();

        const thisGroup = await this.groupEntity.findOneBy({ groupID: groupID });

        if (!thisGroup) throw new NotFoundException();
        if (thisGroup.groupIs == groupIs.c && thisUser.userName != 'admin') throw new ForbiddenException();
        if (thisGroup.groupIs == groupIs.p && thisGroup.groupOwnerID != thisUser.userID) throw new ForbiddenException();

        const thisGroupMember = await this.peopleEntity.findBy({ peopleGroupID: thisGroup.groupID })
        if (thisGroupMember == null) return [];

        return thisGroupMember;
    }

    /**
     * 구성원 단체 등록
     * 
     * @param tokenDto
     * @param peopleDto
     * 
     * @returns OK
     */
    async addPeopleIntoGroup(tokenDto: tokenDto, peopleDto: peopleDto[]): Promise<object>{
        const { userID } = await this.authService.accessValidate(tokenDto);
        const thisUser = await this.authEntity.findOneByOrFail({ userID });

        if (!thisUser) throw new UnauthorizedException();

        const arr = [];

        Array.from(peopleDto).forEach(async (people) => {
            await this.peopleEntity.save({
                peopleGroupID: people.peopleGroupID,
                peopleIs: people.peopleIs,
                peopleSchoolNumber: people.peopleSchoolNumber,
                peopleDepartment: people.peopleDepartment,
                peoplePhoneNumber: people.peoplePhoneNumber,
                peopleName: people.peopleName,
            })
            arr.push(people.peopleName)
        })

        return arr;
    }

    /**
     * 구성원 개별 등록
     * 
     * @param tokenDto
     * @param groupID
     * 
     * @body peopleDto
     * 
     * @returns addedPeople
     */
    async addOneGroupMember(tokenDto: tokenDto, groupID: number, peopleDto: peopleDto): Promise<object> {
        const { userID } = await this.authService.accessValidate(tokenDto);

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();

        const thisGroup = await this.groupEntity.findOneBy({ groupID });

        if (!thisGroup) throw new NotFoundException();
        if (thisGroup.groupOwnerID != thisUser.userID) throw new ConflictException();

        const thisPeople = await this.peopleEntity.save({
            peopleGroupID: groupID,
            peopleIs: peopleDto.peopleIs,
            peopleSchoolNumber: peopleDto.peopleSchoolNumber,
            peopleDepartment: peopleDto.peopleDepartment,
            peoplePhoneNumber: peopleDto.peoplePhoneNumber,
            peopleName: peopleDto.peopleName
        })

        return thisPeople;
    }

    /**
     * 구성원 삭제
     * 
     * @param tokenDto
     * @param groupID
     * 
     * @returns No content
     */
    async deleteGroupMember(tokenDto: tokenDto, groupID: number, peopleIDList: number[]): Promise<object> {
        const { userID } = await this.authService.accessValidate(tokenDto);

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new UnauthorizedException();
        const arr = []

        Array.from(peopleIDList).forEach(async peopleID => {
            await this.peopleEntity.delete({
                peopleID,
                peopleGroupID: groupID
            })
            arr.push(peopleID)
        })

        return arr;
    }
}