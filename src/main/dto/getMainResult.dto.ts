import { noticeStat } from "src/notice/entity/notice.entity"

export class getMainResultDto {
    data: {
        recently: [
            {
                noticeID: number,
                noticeHead: string,
                noticeContent: string,
                noticeBy: number,
                noticeStat: noticeStat,
                noticeFor: number,
                noticeChecked: number,
                createdAt: Date
            },
        ],
        my: [
            {
                noticeID: number,
                noticeHead: string,
                noticeContent: string,
                noticeBy: number,
                noticeStat: noticeStat,
                noticeFor: number,
                noticeChecked: number,
                createdAt: Date
            }
        ]
    };
    statusCode: number;
    statusMsg: string;
}