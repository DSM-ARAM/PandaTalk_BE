import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import tokenConfig from 'src/config/token.config';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private groupRepository: Repository<Group>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @Inject(tokenConfig.KEY) private config: ConfigType<typeof tokenConfig>,
    ) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.config = config;
    }

    async getGroupList(order: string): Promise<Promise<Group[]> | object> {
        try {
            let thisGroup: Promise<Group[]>;
            if (order == 'common') {
                thisGroup = this.groupRepository.findBy({
                    groupIs: order,
                })
            } else if (order == 'personal') {
                thisGroup = this.groupRepository.findBy({
                    groupIs: order,
                })
            } else return new ConflictException('올바르지 않은 URL입니다.');
            return thisGroup;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async getGroupUserList(order: string, name: string): Promise<Promise<Group> | object>{
        try {
            const thisGroup = await this.groupRepository.findOneBy({
                groupIs: order,
                groupName: name,
            })

            if(!thisGroup) return new NotFoundException('존재하지 않는 그룹입니다.')

            const thisGroupUserList: string[] = thisGroup.groupList.split(',');
            let userList: User[] = [];

            for (let i: number = 0; i < thisGroupUserList.length; i++){
                const thisUser = await this.userRepository.findOneBy({
                    userID: Number(thisGroupUserList[i]),
                });
                if(!thisUser) return new NotFoundException('존재하지 않는 유저입니다.')
                userList.push(thisUser);
            }

            return userList;
        } catch (err) {
            console.error(err);
            return err;
        }
    }
}