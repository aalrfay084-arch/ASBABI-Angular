import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5097/api/Admin';

  // جلب جميع المسؤولين
  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admins`);
  }

  // جلب جميع المستخدمين
getUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users`);
}

// حذف مستخدم
deleteUser(id: string): Observable<string> {
  return this.http.delete(
    `${this.apiUrl}/users/${id}`,
    { responseType: 'text' }
  );
}

  // إنشاء مسؤول جديد
  createAdmin(data: {
  fullName: string;
  email: string;
  password: string;
}): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/create`,
    data,
    { responseType: 'text' }
  );
}

  // حذف مسؤول
  deleteAdmin(id: string): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/admins/${id}`,
      { responseType: 'text' }
    );
  }
}