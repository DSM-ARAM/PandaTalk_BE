import { ConflictException, Controller, Get, Query} from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
    constructor(
        private groupService: GroupService
    ) {
        this.groupService = groupService;
    }

    @Get('/group?')
    async getGroupList(@Query('group') group: string): Promise<Object> {

        console.log(group, group != 'common', group != 'personal')

        if (group != 'common' && group != 'personal') {
            return Object.assign({
                errorCode: 409,
                errMsg: "올바르지 않은 URL입니다."
            })
        }

        const result = await this.groupService.getGroupList(group);

        return Object.assign({
            data: result,
            statusCode: 200,
            statusMsg: "요청에 성공했습니다."
        });
    }
}
