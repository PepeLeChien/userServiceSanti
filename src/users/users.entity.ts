import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersProfileEntity } from "./usersProfile.entity";


@Entity('users')
export class UsersEntity {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({type: 'varchar', default: "PENDING"})
    status: string;

    @Column({type: 'timestamp', default: () => {'CURRENT_TIMESTAMP'}})
    created_at: Date

    @OneToOne(() => UsersProfileEntity, profile => profile.user, { cascade: true })
    profile: UsersProfileEntity;
}