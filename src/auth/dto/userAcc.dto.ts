import { ApiProperty } from "@nestjs/swagger";

export class userAccDto {
    @ApiProperty({
        example: "test1",
        description: "사용자가 로그인하는 아이디"
    })
    userLogID: string;

    @ApiProperty({
        example: "test1234!",
        description: "사용자가 로그인하는 비밀번호"
    })
    userPW: string;

    @ApiProperty({
        example: "Name",
        description: "사용자 화면에 표시될 이름"
    })
    userName: string;

    @ApiProperty({
        example: "MeisterDepartment",
        description: "사용자 화면에 표시될 부서"
    })
    userDepartment: string;
}