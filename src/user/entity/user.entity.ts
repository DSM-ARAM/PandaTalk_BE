import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: "int",
    })
    userID: number;

    @Column({
        type: "int",
        unique: true,
        nullable: true,
    })
    userSchoolNumber: number;

    @Column({
        type: "varchar",
        nullable: true,
    })
    userName: string;

    @Column({
        type: "varchar",
        nullable: true,
    })
    userDepartmentL: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
    })
    userEmail: string;

    @Column({
        type: "int",
        unique: true,
        nullable: false,
    })
    userPhone: number;
}