export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type Category =
  | 'Streaming'
  | 'Musik'
  | 'Software'
  | 'Cloud'
  | 'Fitness'
  | 'Nachrichten'
  | 'Gaming'
  | 'Sonstiges';

export interface Subscription {
  id?: number;
  name: string;
  cost: number;
  billingCycle: BillingCycle;
  category: Category;
  startDate: string;
  color: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryStat {
  category: string;
  monthly: number;
  yearly: number;
}

export interface UpcomingPayment {
  id: number;
  name: string;
  cost: number;
  billingCycle: BillingCycle;
  nextPayment: string;
  color: string;
}

export interface Stats {
  monthlyTotal: number;
  yearlyTotal: number;
  activeCount: number;
  byCategory: CategoryStat[];
  upcomingPayments: UpcomingPayment[];
}

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
  quarterly: 'Quartalsweise',
  yearly: 'Jährlich',
};

export const CATEGORIES: Category[] = [
  'Streaming',
  'Musik',
  'Software',
  'Cloud',
  'Fitness',
  'Nachrichten',
  'Gaming',
  'Sonstiges',
];

export const CATEGORY_ICONS: Record<string, string> = {
  Streaming: '🎬',
  Musik: '🎵',
  Software: '💻',
  Cloud: '☁️',
  Fitness: '💪',
  Nachrichten: '📰',
  Gaming: '🎮',
  Sonstiges: '📦',
};

export const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];
