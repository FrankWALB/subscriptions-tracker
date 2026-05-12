import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import {
  CATEGORIES, PRESET_COLORS, BILLING_CYCLE_LABELS, BillingCycle, Category,
} from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './subscription-form.html',
  styleUrl: './subscription-form.scss',
})
export class SubscriptionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(SubscriptionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEdit = signal(false);
  saving = signal(false);
  editId = signal<number | null>(null);

  categories = CATEGORIES;
  presetColors = PRESET_COLORS;
  billingCycles: { value: BillingCycle; label: string }[] = [
    { value: 'weekly', label: 'Wöchentlich' },
    { value: 'monthly', label: 'Monatlich' },
    { value: 'quarterly', label: 'Quartalsweise' },
    { value: 'yearly', label: 'Jährlich' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    cost: [null as number | null, [Validators.required, Validators.min(0)]],
    billingCycle: ['monthly' as BillingCycle, Validators.required],
    category: ['Sonstiges' as Category, Validators.required],
    startDate: [new Date().toISOString().split('T')[0], Validators.required],
    color: ['#6366f1'],
    isActive: [true],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(+id);
      this.svc.getAll().subscribe((list) => {
        const sub = list.find((s) => s.id === +id);
        if (sub) {
          this.form.patchValue({
            name: sub.name,
            cost: sub.cost,
            billingCycle: sub.billingCycle,
            category: sub.category,
            startDate: sub.startDate,
            color: sub.color,
            isActive: sub.isActive,
          });
        }
      });
    }
  }

  selectColor(color: string) {
    this.form.patchValue({ color });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving.set(true);

    const value = this.form.getRawValue() as any;
    const obs = this.isEdit()
      ? this.svc.update(this.editId()!, value)
      : this.svc.create(value);

    obs.subscribe({
      next: () => this.router.navigate(['/subscriptions']),
      error: () => this.saving.set(false),
    });
  }
}
