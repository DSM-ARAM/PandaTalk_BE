import { ApiProperty } from "@nestjs/swagger";

export class userLogDto {
    @ApiProperty({
        example: 'test1',
        description: '사용자가 로그인할 때 사용한 문자열 아이디',
      })
    userLogID: string;

    @ApiProperty({
        example: 'test1234!',
        description: '암호화되지 않은 사용자의 비밀번호'
    })
    userPW: string;
}