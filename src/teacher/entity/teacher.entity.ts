import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn({
        type: "int",
    })
    teacherID: number;

    @Column({
        type: "varchar",
        length: 4,
        nullable: false,
        default: "선생님"
    })
    teacherName: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    teacherDepartment: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        length: 30,
    })
    teacherMail: string;

    @Column({
        type: "int",
        nullable: false,
        unique: true,
        width: 11,
    })
    teacherPhone: number;

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
    })
    teacherPW: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 100,
    })
    teacherRefreshToken: string;
}