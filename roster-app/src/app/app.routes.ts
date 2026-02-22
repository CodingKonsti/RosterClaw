import { Routes } from '@angular/router';
import { RosterComponent } from './components/roster/roster.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ShiftTypesComponent } from './components/shift-types/shift-types.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/roster', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'roster', component: RosterComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard] },
  { path: 'shift-types', component: ShiftTypesComponent, canActivate: [authGuard] }
];
