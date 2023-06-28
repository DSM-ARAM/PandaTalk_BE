import { authEntity } from "src/auth/entity/auth.entity";
import { Column, Entity, Generated, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { peopleEntity } from "./people.entity";

export enum groupIs{
    c = 'common',
    p = 'personal'
}

@Entity()
export class groupEntity {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    groupID: number;

    @OneToMany(() => groupEntity, groupEntity => groupEntity.groupSuperID)
    @Generated()
    groupSuper: groupEntity;

    @ManyToOne(() => groupEntity, groupEntity => groupEntity.groupExtendsID)
    @Generated()
    groupExtends: groupEntity; 

    @ManyToMany(() => peopleEntity, peopleEntity => peopleEntity.peopleID)
    @Generated()
    groupPeople: peopleEntity;
        
    @PrimaryColumn({
        type: 'varchar'
    })
    groupName: string;

    @ManyToOne(() => authEntity, groupOwner => groupOwner.ownGroups, {
        cascade: ["update"],
    })
    @JoinColumn()
    groupOwner: authEntity;

    @Column({
        type: 'enum',
        nullable: false,
        default: groupIs.p,
        enum: groupIs,
    })
    groupIs: groupIs;

    @ManyToOne(() => groupEntity, groupEntity => groupEntity.groupID, { nullable: true })
    @Column({
        type: 'integer',
        nullable: true
    })
    groupSuperID: number;

    @OneToMany(() => groupEntity, groupEntity => groupEntity.groupID, { nullable: true })
    @Column({
        type: 'integer',
        nullable: true
    })
    groupExtendsID: number;
}