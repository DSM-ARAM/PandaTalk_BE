import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
    })
    groupName: string;

    @Column({
        type: "varchar",
        nullable: true,
    })
    groupList: string;
}