export class signInResultDto {
    data: {
        accesstoken: string,
        refreshtoken: string
    };
    statusCode: number;
    statusMsg: string;
}