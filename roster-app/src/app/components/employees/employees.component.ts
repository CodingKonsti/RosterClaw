import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataService } from '../../services/data.service';
import { Employee } from '../../models/employee.model';
import { EmployeeDialogComponent, EmployeeDialogResult } from '../employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
],
  template: `
    <div class="employees-container">
      <div class="header">
        <h1>Employee Management</h1>
        <button mat-raised-button color="primary" (click)="addEmployee()">
          <mat-icon>add</mat-icon>
          Add Employee
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="employees" class="employees-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let employee">{{ employee.firstName }} {{ employee.lastName }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let employee">{{ employee.jobRole }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let employee">{{ employee.email }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let employee">{{ employee.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let employee">
              <button mat-icon-button color="primary" (click)="editEmployee(employee)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteEmployee(employee)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .employees-container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header h1 { margin: 0; }
    .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: auto; }
    .employees-table { width: 100%; }
    th { font-weight: 600; }
    button[mat-icon-button] { margin: 0 4px; }
    @media (max-width: 768px) {
      .employees-container { padding: 12px; }
      .header { flex-direction: column; align-items: flex-start; gap: 12px; }
      .header h1 { font-size: 20px; }
      .table-container { font-size: 14px; }
      th, td { padding: 8px 4px !important; font-size: 13px; }
    }
  `]
})
export class EmployeesComponent implements OnInit {
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);

  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'role', 'email', 'phone', 'actions'];
  isMobile = false;

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngOnInit(): void {
    this.dataService.loadAll();
    this.dataService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: this.isMobile ? '100%' : '500px',
      maxWidth: this.isMobile ? '100vw' : '80vw',
      height: this.isMobile ? '100%' : 'auto',
      maxHeight: this.isMobile ? '100vh' : '90vh',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: EmployeeDialogResult | undefined) => {
      if (result) {
        this.dataService.addEmployee({
          firstName: result.firstName,
          lastName: result.lastName,
          jobRole: result.jobRole,
          email: result.email,
          phone: result.phone
        }).subscribe();
      }
    });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: this.isMobile ? '100%' : '500px',
      maxWidth: this.isMobile ? '100vw' : '80vw',
      height: this.isMobile ? '100%' : 'auto',
      maxHeight: this.isMobile ? '100vh' : '90vh',
      data: { ...employee }
    });

    dialogRef.afterClosed().subscribe((result: EmployeeDialogResult | undefined) => {
      if (result) {
        this.dataService.updateEmployee(employee.id, {
          firstName: result.firstName,
          lastName: result.lastName,
          jobRole: result.jobRole,
          email: result.email,
          phone: result.phone
        }).subscribe();
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.dataService.deleteEmployee(employee.id).subscribe();
    }
  }
}
