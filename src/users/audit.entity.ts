import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('audit_log')
export class AuditEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    action: string;

    @Column()
    details: string;

    @Column({type: 'timestamp', default: () => {'CURRENT_TIMESTAMP'}})
    executed_at: Date
}