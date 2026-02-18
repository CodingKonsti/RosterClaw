import { Routes } from '@angular/router';
import { RosterComponent } from './components/roster/roster.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ShiftTypesComponent } from './components/shift-types/shift-types.component';

export const routes: Routes = [
  { path: '', redirectTo: '/roster', pathMatch: 'full' },
  { path: 'roster', component: RosterComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'shift-types', component: ShiftTypesComponent }
];
