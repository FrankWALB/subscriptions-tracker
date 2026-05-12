import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription, Stats } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/subscriptions';

  getAll(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.baseUrl);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/stats`);
  }

  create(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Observable<Subscription> {
    return this.http.post<Subscription>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
