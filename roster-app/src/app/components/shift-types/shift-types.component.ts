import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataService } from '../../services/data.service';
import { ShiftType } from '../../models/shift-type.model';
import { ShiftTypeDialogComponent } from '../shift-type-dialog/shift-type-dialog.component';

@Component({
  selector: 'app-shift-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="shift-types-container">
      <div class="header">
        <h1>Shift Type Management</h1>
        <button mat-raised-button color="primary" (click)="addShiftType()">
          <mat-icon>add</mat-icon>
          Add Shift Type
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="shiftTypes" class="shift-types-table">
          <ng-container matColumnDef="color">
            <th mat-header-cell *matHeaderCellDef>Color</th>
            <td mat-cell *matCellDef="let shiftType">
              <div class="color-box" [style.background-color]="shiftType.color"></div>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let shiftType">{{ shiftType.name }}</td>
          </ng-container>

          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef>Time Range</th>
            <td mat-cell *matCellDef="let shiftType">
              {{ shiftType.startTime }} - {{ shiftType.endTime }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let shiftType">
              <button mat-icon-button color="primary" (click)="editShiftType(shiftType)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteShiftType(shiftType)">
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
    .shift-types-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: auto;
    }

    .shift-types-table {
      width: 100%;
    }

    th {
      font-weight: 600;
    }

    .color-box {
      width: 40px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    button[mat-icon-button] {
      margin: 0 4px;
    }

    @media (max-width: 768px) {
      .shift-types-container {
        padding: 12px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header h1 {
        font-size: 20px;
      }

      .table-container {
        font-size: 14px;
      }

      th, td {
        padding: 8px 4px !important;
        font-size: 13px;
      }
    }
  `]
})
export class ShiftTypesComponent implements OnInit {
  shiftTypes: ShiftType[] = [];
  displayedColumns: string[] = ['color', 'name', 'time', 'actions'];
  isMobile = false;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngOnInit(): void {
    this.dataService.getShiftTypes().subscribe(shiftTypes => {
      this.shiftTypes = shiftTypes;
    });
  }

  addShiftType(): void {
    const dialogRef = this.dialog.open(ShiftTypeDialogComponent, {
      width: this.isMobile ? '100%' : '500px',
      maxWidth: this.isMobile ? '100vw' : '80vw',
      height: this.isMobile ? '100%' : 'auto',
      maxHeight: this.isMobile ? '100vh' : '90vh',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addShiftType(result);
      }
    });
  }

  editShiftType(shiftType: ShiftType): void {
    const dialogRef = this.dialog.open(ShiftTypeDialogComponent, {
      width: this.isMobile ? '100%' : '500px',
      maxWidth: this.isMobile ? '100vw' : '80vw',
      height: this.isMobile ? '100%' : 'auto',
      maxHeight: this.isMobile ? '100vh' : '90vh',
      data: { ...shiftType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.updateShiftType(result);
      }
    });
  }

  deleteShiftType(shiftType: ShiftType): void {
    if (confirm(`Are you sure you want to delete shift type "${shiftType.name}"?`)) {
      this.dataService.deleteShiftType(shiftType.id);
    }
  }
}
