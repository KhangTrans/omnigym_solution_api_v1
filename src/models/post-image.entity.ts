import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity.js';

@Entity('post_images')
export class PostImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'post_id', type: 'int' })
  post_id!: number;

  @ManyToOne(() => Post, (post) => post.images)
  @JoinColumn({ name: 'post_id' })
  post!: any;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
