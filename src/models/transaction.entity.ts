import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerSubscription } from './customer-subscription.entity.js';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'customer_subscription_id', type: 'int', nullable: true })
  customer_subscription_id?: number;

  @ManyToOne(() => CustomerSubscription, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_subscription_id' })
  customer_subscription?: CustomerSubscription;

  @Column({ name: 'booking_id', type: 'int', nullable: true })
  booking_id?: number; // Related to sessions booking if applicable

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 50, default: 'payOS' })
  payment_method!: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  transaction_status!: string; // pending, paid, cancelled, failed

  @Column({ type: 'timestamp', nullable: true })
  payment_time?: Date;

  // PayOS specific fields to manage payment flows
  @Column({ type: 'text', nullable: true })
  checkout_url?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_link_id?: string;
}
