import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShiftType } from '../../models/shift-type.model';

@Component({
  selector: 'app-shift-type-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Shift Type' : 'Add Shift Type' }}</h2>
    <mat-dialog-content>
      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="shiftType.name" required>
        </mat-form-field>
      </div>

      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Start Time</mat-label>
          <input matInput type="time" [(ngModel)]="shiftType.startTime" required>
        </mat-form-field>
      </div>

      <div class="form-field">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>End Time</mat-label>
          <input matInput type="time" [(ngModel)]="shiftType.endTime" required>
        </mat-form-field>
      </div>

      <div class="form-field">
        <label for="colorInput">Color</label>
        <div class="color-picker-container">
          <input id="colorInput" type="color" [(ngModel)]="shiftType.color" class="color-picker">
          <span class="color-value">{{ shiftType.color }}</span>
        </div>
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

    .color-picker-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .color-picker {
      width: 60px;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .color-value {
      font-family: monospace;
      font-size: 14px;
      color: #666;
    }

    label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
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
export class ShiftTypeDialogComponent {
  dialogRef = inject<MatDialogRef<ShiftTypeDialogComponent>>(MatDialogRef);
  data = inject<ShiftType | null>(MAT_DIALOG_DATA);

  shiftType: ShiftType;
  isEdit: boolean;

  constructor() {
    const data = this.data;

    this.isEdit = !!data;
    this.shiftType = data ? { ...data } : {
      id: this.generateId(),
      name: '',
      startTime: '09:00',
      endTime: '17:00',
      color: '#2196F3'
    };
  }

  isValid(): boolean {
    return !!(this.shiftType.name && this.shiftType.startTime && 
              this.shiftType.endTime && this.shiftType.color);
  }

  onSave(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.shiftType);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private generateId(): string {
    return 'shift' + Date.now();
  }
}
