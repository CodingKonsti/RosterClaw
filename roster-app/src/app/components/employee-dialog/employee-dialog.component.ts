import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h2>
    <mat-dialog-content>
      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="employee.name" required>
        </mat-form-field>
      </div>

      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select [(ngModel)]="employee.role" required>
            <mat-option value="Nurse">Nurse</mat-option>
            <mat-option value="Doctor">Doctor</mat-option>
            <mat-option value="Assistant">Assistant</mat-option>
            <mat-option value="Technician">Technician</mat-option>
            <mat-option value="Administrator">Administrator</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="employee.email" required>
        </mat-form-field>
      </div>

      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Phone</mat-label>
          <input matInput [(ngModel)]="employee.phone" required>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!isValid()">
        {{ isEdit ? 'Update' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      padding: 20px;
    }

    .form-field {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: auto;
        width: 100%;
        padding: 16px;
      }
    }
  `]
})
export class EmployeeDialogComponent {
  employee: Employee;
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    this.isEdit = !!data;
    this.employee = data ? { ...data } : {
      id: this.generateId(),
      name: '',
      role: '',
      email: '',
      phone: ''
    };
  }

  isValid(): boolean {
    return !!(this.employee.name && this.employee.role && 
              this.employee.email && this.employee.phone);
  }

  onSave(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.employee);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private generateId(): string {
    return 'emp' + Date.now();
  }
}
