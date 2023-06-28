import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { groupEntity } from "./group.entity";

export enum peopleIs{
    teacher = 'teacher',
    student = 'student',
    parents = 'parents'
}

@Entity()
export class peopleEntity{
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    peopleID: number;

    @PrimaryColumn({
        type: 'integer',
    })
    peopleGroupID: number;

    @ManyToMany(() => groupEntity, groupEntity => groupEntity.groupID)
    @JoinTable({
        name: "peopleMappingGroup",
        joinColumn: {
            name: 'peopleID',
            referencedColumnName: 'peopleID'
        }
    })
    peopleGroup: groupEntity;

    @Column({
        type: 'enum',
        nullable: false,
        default: peopleIs.student,
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
