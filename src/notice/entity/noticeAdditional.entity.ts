import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { noticeEntity } from "./notice.entity";

@Entity()
export class noticeAdditionalEntity {
    @PrimaryGeneratedColumn({
        type: "integer"
    })
    noticeAdditionalID: number;

    @ManyToOne(() => noticeEntity, noticeEntity => noticeEntity.noticeID)
    @JoinColumn()
    notice: noticeEntity;

    @Column({
        type: "text",
        nullable: false,
    })
    noticeAdditionalPath: string;
}