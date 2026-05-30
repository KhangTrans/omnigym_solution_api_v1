import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity.js';
import { Partner } from './partner.entity.js';

@Entity('staffs')
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int', unique: true })
  user_id!: number;

  @OneToOne(() => User, (user) => user.staff)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'partner_id', type: 'int', nullable: true })
  partner_id?: number;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'partner_id' })
  partner?: Partner;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department?: string;

  @Column({ type: 'int', default: 0 })
  assigned_tasks_count!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}