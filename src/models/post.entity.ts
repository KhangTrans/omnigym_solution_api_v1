import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity.js';
import { PostImage } from './post-image.entity.js';
import { PostStatus } from './post-status.enum.js';
import { PostView } from './post-view.entity.js';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  user_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    enumName: 'post_status',
    default: PostStatus.Draft,
  })
  status!: PostStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category?: string;

  @Column({ type: 'int', default: 0, name: 'view_count' })
  view_count!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => PostImage, (image) => image.post)
  images!: PostImage[];

  @OneToMany(() => PostView, (view) => view.post)
  views!: PostView[];
}
