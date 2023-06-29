import { authEntity } from "src/auth/entity/auth.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { noticeAdditionalEntity } from "./noticeAdditional.entity";

export enum noticeStat {
    b = '발송예약',
    c = '발송완료'
}

@Entity()
export class noticeEntity {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    noticeID: number;

    @Column({
        type: "text",
        nullable: false,
    })
    noticeHead: string;

    @Column({
        type: "text",
        nullable: false,
    })
    noticeContent: string;

    @Column({
        type: "integer",
        nullable: false
    })
    noticeBy: number;

    @ManyToOne(() => authEntity, authEntity => authEntity.userID)
    @JoinColumn()
    noticeByUser: authEntity;

    @OneToMany(() => noticeAdditionalEntity, noticeAdditionalEntity => noticeAdditionalEntity.notice)
    noticeAdditionalID: noticeAdditionalEntity;

    @Column({
        type: "varchar",
        nullable: false,
        default: noticeStat.b
    })
    noticeStat: noticeStat;

    @Column({
        type: "integer",
        nullable: false,
        default: 0
    })
    noticeFor: number;

    @Column({
        type: "integer",
        nullable: false,
        default: 0
    })
    noticeChecked: number;

    @CreateDateColumn()
    createdAt: Date;
}