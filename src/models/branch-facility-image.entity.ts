import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { BranchFacility } from './branch-facility.entity.js';

@Entity('branch_facilities_images')
export class BranchFacilityImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'facility_id', type: 'int' })
  facility_id!: number;

  @ManyToOne(() => BranchFacility)
  @JoinColumn({ name: 'facility_id' })
  facility!: BranchFacility;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url?: string;

  @Column({ type: 'boolean', default: false })
  is_cover!: boolean;

  @Column({ type: 'int', default: 0 })
  sort_order!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
