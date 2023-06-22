import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { groupEntity } from "./group.entity";

export enum peopleIs{
    teacher = 'teacher',
    student = 'student',
    parents = 'parents'
}

@Entity()
export class peopleEntity{
    @ManyToMany(() => groupEntity, groupEntity => groupEntity.groupID)
    @JoinTable()
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    peopleID: number;

    @Column({
        type: 'enum',
        nullable: false,
        default: 'student',
        enum: peopleIs
    })
    peopleIs: peopleIs;

    @Column({
        type: 'integer',
        nullable: true,
        unique: true,
    })
    peopleSchoolNumber: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    peopleDepartment: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true,
    })
    peoplePhoneNumber: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    peopleName: string;
}
