import { groupEntity } from "src/people/entity/group.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class authEntity{
    @ManyToMany(() => groupEntity, groupEntity => groupEntity.groupOwner)
    @PrimaryGeneratedColumn({
        type: "integer",
    })
    userID: number;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
    })
    userLogID: string;

    @Column({
        type: "varchar",
        nullable: false,
        default: "1234",
    })
    userPW: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    userName: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    userDepartment: string;
}