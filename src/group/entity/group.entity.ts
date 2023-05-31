import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn({
        type: "int"
    })
    groupID: number;

    @Column({
        type: "varchar",
        nullable: false,
        default: 'personal'
    })
    groupIs: string;

    @PrimaryColumn({
        type: "varchar",
        nullable: false,
    })
    groupName: string;

    @Column({
        type: "varchar",
        nullable: true,
    })
    groupList: string;
}