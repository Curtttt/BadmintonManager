import { Routes } from '@angular/router';
import { SanListComponent } from './pages/san/san-list/san-list.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { DoanhThuComponent } from './pages/doanh-thu/doanh-thu.component';
import { PreBookComponent } from './pages/pre-book/pre-book.component';
import { Error404Component } from './pages/error404/error404.component';
import { DrinksComponent } from './pages/drinks/drinks.component';

export const routes: Routes = [
    {path: '', redirectTo: 'trang-chu', pathMatch: 'full'},
    {path: 'trang-chu', component: SanListComponent},
    {path: 'khach-hang', component: CustomerComponent},
    {path: 'doanh-thu', component: DoanhThuComponent},
    {path: 'dich-vu', component: DrinksComponent},
    {path: 'lich-dat-truoc', component: PreBookComponent},
    {path: '**', component: Error404Component, pathMatch: 'full'}
];
