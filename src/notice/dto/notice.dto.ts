import { noticeStat } from "../entity/notice.entity";

export class noticeDto {
    noticeHead: string;
    noticeContent: string;
    noticeBy: number;
    noticeStat: noticeStat;
    noticeFor: number;
    noticeChecked: number;
    createdAt: Date;
}