import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity.js';
import { MembershipPackage } from './membership-package.entity.js';

@Entity('customer_subscriptions')
export class CustomerSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'customer_id', type: 'int', nullable: true })
  customer_id?: number;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column({ name: 'membership_id', type: 'int', nullable: true })
  membership_id?: number;

  @ManyToOne(() => MembershipPackage, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'membership_id' })
  membership?: MembershipPackage;

  @Column({ type: 'date', nullable: true })
  start_date?: Date;

  @Column({ type: 'date', nullable: true })
  end_date?: Date;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status!: string; // active, pending, expired
}
