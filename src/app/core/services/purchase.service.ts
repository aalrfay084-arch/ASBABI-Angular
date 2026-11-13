import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Purchase,
  CreatePurchase
} from '../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5097/api/Purchases';

  // جلب مشتريات المستخدم الحالي
  getMyPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/my`);
  }

  // جلب تفاصيل عملية شراء معينة
  getMyPurchaseById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/my/${id}`);
  }

  // إرسال طلب شراء
  createPurchase(data: CreatePurchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl, data);
  }

  // جلب جميع المشتريات للمسؤولين
getAllPurchases(): Observable<Purchase[]> {
  return this.http.get<Purchase[]>(this.apiUrl);
}

// تحديث حالة طلب الشراء
updatePurchaseStatus(id: number, status: string): Observable<string> {
  return this.http.put(
    `${this.apiUrl}/${id}`,
    { status },
    { responseType: 'text' }
  );
}

// حذف طلب شراء
deletePurchase(id: number): Observable<string> {
  return this.http.delete(
    `${this.apiUrl}/${id}`,
    { responseType: 'text' }
  );
}

}
