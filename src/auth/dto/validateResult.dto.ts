import { ApiProperty } from "@nestjs/swagger";

export class validateResultDto {
    @ApiProperty({
        example: "1",
        description: "유효한 사용자의 DB저장 아이디값"
    })
    userID: number;

    @ApiProperty({
        example: "test1",
        description: "유효한 사용자의 아이디값"
    })
    userLogID: string;
}