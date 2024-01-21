import { Routes } from '@angular/router';
import { SanListComponent } from './pages/san-list/san-list.component';
import { SanDetailComponent } from './pages/san-detail/san-detail.component';

export const routes: Routes = [
    {path: '', redirectTo: 'main', pathMatch: 'full'},
    {path: 'main', component: SanListComponent},
    {path: 'main/:id', component: SanDetailComponent}
];
