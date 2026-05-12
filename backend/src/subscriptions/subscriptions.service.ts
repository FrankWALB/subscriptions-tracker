import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, BillingCycle } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly repo: Repository<Subscription>,
  ) {}

  findAll(): Promise<Subscription[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Subscription> {
    const sub = await this.repo.findOne({ where: { id } });
    if (!sub) throw new NotFoundException(`Subscription #${id} not found`);
    return sub;
  }

  create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const sub = this.repo.create(dto);
    return this.repo.save(sub);
  }

  async update(id: number, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const sub = await this.findOne(id);
    Object.assign(sub, dto);
    return this.repo.save(sub);
  }

  async remove(id: number): Promise<void> {
    const sub = await this.findOne(id);
    await this.repo.remove(sub);
  }

  async getStats() {
    const subs = await this.repo.find({ where: { isActive: true } });

    const monthlyTotal = subs.reduce((sum, s) => sum + this.toMonthly(s), 0);
    const yearlyTotal = monthlyTotal * 12;

    const byCategory: Record<string, number> = {};
    for (const s of subs) {
      const monthly = this.toMonthly(s);
      byCategory[s.category] = (byCategory[s.category] || 0) + monthly;
    }

    const upcomingPayments = this.getUpcomingPayments(subs);

    return {
      monthlyTotal: +monthlyTotal.toFixed(2),
      yearlyTotal: +yearlyTotal.toFixed(2),
      activeCount: subs.length,
      byCategory: Object.entries(byCategory).map(([category, monthly]) => ({
        category,
        monthly: +monthly.toFixed(2),
        yearly: +(monthly * 12).toFixed(2),
      })),
      upcomingPayments,
    };
  }

  private toMonthly(sub: Subscription): number {
    const cost = Number(sub.cost);
    switch (sub.billingCycle) {
      case BillingCycle.WEEKLY:
        return cost * 52 / 12;
      case BillingCycle.QUARTERLY:
        return cost / 3;
      case BillingCycle.YEARLY:
        return cost / 12;
      default:
        return cost;
    }
  }

  private getUpcomingPayments(subs: Subscription[]) {
    const today = new Date();
    return subs
      .map((s) => {
        const next = this.getNextPaymentDate(s, today);
        return { id: s.id, name: s.name, cost: Number(s.cost), billingCycle: s.billingCycle, nextPayment: next.toISOString().split('T')[0], color: s.color };
      })
      .sort((a, b) => a.nextPayment.localeCompare(b.nextPayment))
      .slice(0, 5);
  }

  private getNextPaymentDate(sub: Subscription, today: Date): Date {
    const start = new Date(sub.startDate);
    const next = new Date(start);

    while (next <= today) {
      switch (sub.billingCycle) {
        case BillingCycle.WEEKLY:
          next.setDate(next.getDate() + 7);
          break;
        case BillingCycle.MONTHLY:
          next.setMonth(next.getMonth() + 1);
          break;
        case BillingCycle.QUARTERLY:
          next.setMonth(next.getMonth() + 3);
          break;
        case BillingCycle.YEARLY:
          next.setFullYear(next.getFullYear() + 1);
          break;
      }
    }
    return next;
  }
}
