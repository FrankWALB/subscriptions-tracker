import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BillingCycle {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum Category {
  STREAMING = 'Streaming',
  MUSIC = 'Musik',
  SOFTWARE = 'Software',
  CLOUD = 'Cloud',
  FITNESS = 'Fitness',
  NEWS = 'Nachrichten',
  GAMING = 'Gaming',
  OTHER = 'Sonstiges',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'enum', enum: BillingCycle, default: BillingCycle.MONTHLY })
  billingCycle: BillingCycle;

  @Column({ type: 'enum', enum: Category, default: Category.OTHER })
  category: Category;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ length: 7, default: '#6366f1' })
  color: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
