import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Post } from './post.entity.js';
import { User } from './user.entity.js';

/**
 * Tracks individual user view events per post.
 * The unique constraint (post_id, user_id, viewed_date) ensures
 * each user is counted at most once per day per post.
 */
@Entity('post_views')
@Index('UQ_post_view_per_day', ['post_id', 'user_id', 'viewed_date'], { unique: true })
export class PostView {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'post_id', type: 'int' })
  post_id!: number;

  @ManyToOne(() => Post, (post) => post.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @Column({ name: 'user_id', type: 'int' })
  user_id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /**
   * Date portion only (YYYY-MM-DD) — used for the unique constraint
   * so that each user can view the same post once per day.
   */
  @Column({ name: 'viewed_date', type: 'date' })
  viewed_date!: string;

  @CreateDateColumn({ name: 'viewed_at', type: 'timestamp' })
  viewed_at!: Date;
}
