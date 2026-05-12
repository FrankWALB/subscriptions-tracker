import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, BILLING_CYCLE_LABELS, CATEGORY_ICONS } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',
})
export class SubscriptionListComponent implements OnInit {
  private readonly svc = inject(SubscriptionService);

  subscriptions = signal<Subscription[]>([]);
  loading = signal(true);
  cycleLabels = BILLING_CYCLE_LABELS;
  categoryIcons = CATEGORY_ICONS;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (list) => { this.subscriptions.set(list); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  toggleActive(sub: Subscription) {
    this.svc.update(sub.id!, { isActive: !sub.isActive }).subscribe(() => this.load());
  }

  delete(sub: Subscription) {
    if (!confirm(`"${sub.name}" wirklich löschen?`)) return;
    this.svc.delete(sub.id!).subscribe(() => this.load());
  }

  toMonthly(sub: Subscription): number {
    const c = Number(sub.cost);
    switch (sub.billingCycle) {
      case 'weekly': return c * 52 / 12;
      case 'quarterly': return c / 3;
      case 'yearly': return c / 12;
      default: return c;
    }
  }

  totalMonthly(): number {
    return this.subscriptions()
      .filter(s => s.isActive)
      .reduce((sum, s) => sum + this.toMonthly(s), 0);
  }
}
