import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  role_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
}
