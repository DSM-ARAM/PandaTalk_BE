import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import tokenConfig from 'src/config/token.config';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private groupRepository: Repository<Group>,
        @Inject(tokenConfig.KEY) private config: ConfigType<typeof tokenConfig>,
    ) {
        this.groupRepository = groupRepository;
        this.config = config;
    }

    async getGroupList(order: string): Promise<Promise<Group[]> | object> {
        try {
            console.log(typeof(Promise<Group[]>))

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
}