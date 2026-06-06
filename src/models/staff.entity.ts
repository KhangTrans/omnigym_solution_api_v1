import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity.js';
import { Branch } from './branch.entity.js';

@Entity('staffs')
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int', unique: true })
  user_id!: number;

  @OneToOne(() => User, (user) => user.staff)
  @JoinColumn({ name: 'user_id' })
  user!: any;

  @Column({ name: 'branch_id', type: 'int', nullable: true })
  branch_id?: number;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch?: Branch;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department?: string;

  @Column({ type: 'int', default: 0 })
  assigned_tasks_count!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}