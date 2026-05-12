import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Stats, CATEGORY_ICONS } from '../../core/models/subscription.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly svc = inject(SubscriptionService);

  stats = signal<Stats | null>(null);
  loading = signal(true);
  categoryIcons = CATEGORY_ICONS;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.svc.getStats().subscribe({
      next: (s) => { this.stats.set(s); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  getNextPaymentDays(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(dateStr);
    return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getBarWidth(monthly: number): string {
    const stats = this.stats();
    if (!stats || stats.monthlyTotal === 0) return '0%';
    return `${(monthly / stats.monthlyTotal * 100).toFixed(1)}%`;
  }
}
