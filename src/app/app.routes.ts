
import { Routes } from '@angular/router';

import { BookDetails } from './features/store/book-details';
import { StoreHome } from './features/store/store-home';
import { Login } from './features/auth/login';
import { Register } from './features/auth/register';
import { MyBorrowings } from './features/borrowings/my-borrowings';
import { MyPurchases } from './features/purchases/my-purchases';

import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: StoreHome },
  { path: 'book/:id', component: BookDetails },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'my-borrowings', component: MyBorrowings },
  { path: 'my-purchases', component: MyPurchases },

  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard]
  }
];
