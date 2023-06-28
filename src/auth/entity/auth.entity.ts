import { groupEntity } from "src/people/entity/group.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class authEntity{
    @PrimaryGeneratedColumn({
        type: "integer",
    })
    userID: number;
    
    @OneToMany(() => groupEntity, groupEntity => groupEntity.groupOwner)
    ownGroups: groupEntity[]
        
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