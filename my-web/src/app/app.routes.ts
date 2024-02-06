import { Routes } from '@angular/router';
import { SanListComponent } from './pages/san/san-list/san-list.component';
import { CustomerListComponent } from './pages/customer/customer-list/customer-list.component';

export const routes: Routes = [
    {path: '', redirectTo: 'main', pathMatch: 'full'},
    {path: 'main', component: SanListComponent},
    {path: 'khach-hang', component: CustomerListComponent}
];
