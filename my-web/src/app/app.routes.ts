import { Routes } from '@angular/router';
import { SanListComponent } from './pages/san/san-list/san-list.component';
import { SanDetailComponent } from './pages/san/san-detail/san-detail.component';
import { CustomerListComponent } from './pages/customer/customer-list/customer-list.component';

export const routes: Routes = [
    {path: '', redirectTo: 'main', pathMatch: 'full'},
    {path: 'main', component: SanListComponent},
    {path: 'customer', component: CustomerListComponent},
    {path: 'main/:id', component: SanDetailComponent}
];
