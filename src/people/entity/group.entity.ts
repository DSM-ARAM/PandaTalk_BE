import { authEntity } from "src/auth/entity/auth.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { peopleEntity } from "./people.entity";

export enum groupIs{
    c = 'common',
    p = 'personal'
}

@Entity()
export class groupEntity {
    @OneToMany(() => groupEntity, groupEntity => groupEntity.groupSuperID)
    @ManyToOne(() => groupEntity, groupEntity => groupEntity.groupExtendsID)
    @ManyToMany(() => peopleEntity, peopleEntity => peopleEntity.peopleID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    groupID: number;

    @PrimaryColumn({
        type: 'varchar'
    })
    groupName: string;

    @ManyToOne(() => authEntity, authEntity => authEntity.userID, {
        cascade: ["update"],
    })
    @PrimaryColumn({
        type: 'integer'
    })
    groupOwner: number;

    @Column({
        type: 'enum',
        nullable: false,
        default: groupIs.p,
        enum: groupIs,
    })
    groupIs: groupIs;

    @ManyToOne(() => groupEntity, groupEntity => groupEntity.groupID)
    @Column({
        type: 'integer'
    })
    groupSuperID: number;

    @OneToMany(() => groupEntity, groupEntity => groupEntity.groupID)
    @Column({
        type: 'integer'
    })
    groupExtendsID: number;
}