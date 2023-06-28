import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { groupIs } from "../entity/group.entity";

export class createGroupDto {
    @ApiProperty({ example: "groupIs.c", description: "공용 그룹과 개인 그룹으로 분류됨" })
    groupIs: groupIs;

    @ApiProperty({ example: "name_of_group", description: "그룹 이름으로 사용할 문자열" })
    groupName: string;

    @ApiProperty({ example: 1, description: "상위 그룹의 아이디, 상위 그룹이 없을 경우 null"})
    groupSuperID: number | null;

    @ApiProperty({ example: 3, description: "하위 그룹의 아이디, 하위 그룹이 없을 경우 null"})
    groupExtendsID: number | null;
}