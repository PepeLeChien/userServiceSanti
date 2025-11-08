import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";


@Entity('users_profile')
export class UsersProfileEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    dni: string;

    @Column()
    address: string;

    @Column()
    birthdate: Date;

    @OneToOne(() => UsersEntity, user => user.profile)
    @JoinColumn({ name: 'user_id' })  
    user: UsersEntity;
}