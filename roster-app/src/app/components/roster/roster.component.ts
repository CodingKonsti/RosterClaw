import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataService } from '../../services/data.service';
import { Employee } from '../../models/employee.model';
import { ShiftType } from '../../models/shift-type.model';
import { ShiftAssignment } from '../../models/shift-assignment.model';

interface DayColumn {
  date: Date;
  dateStr: string;
  dayName: string;
}

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule
],
  template: `
    <div class="roster-container">
      <div class="header">
        <h1>Duty Roster</h1>
        <div class="controls">
          <mat-form-field appearance="outline" class="view-select">
            <mat-label>View</mat-label>
            <mat-select [(ngModel)]="viewMode" (ngModelChange)="onViewModeChange()">
              <mat-option value="week">Week</mat-option>
              <mat-option value="month">Month</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button (click)="previousPeriod()" matTooltip="Previous">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button mat-raised-button (click)="goToToday()" class="today-btn">Today</button>
          <button mat-icon-button (click)="nextPeriod()" matTooltip="Next">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>
      <div class="period-label-mobile">{{ getPeriodLabel() }}</div>
    
      <!-- Mobile Grid View -->
      @if (isMobile) {
        <div class="roster-grid-container mobile-grid">
          <div class="roster-grid">
            <div class="grid-header">
              <div class="employee-header mobile-employee-header">Name</div>
              @for (day of days; track day) {
                <div class="day-header mobile-day-header">
                  <div class="day-name">{{ day.dayName }}</div>
                  <div class="day-date">{{ formatDateShort(day.date) }}</div>
                </div>
              }
            </div>
            @for (employee of employees; track employee) {
              <div class="employee-row mobile-employee-row">
                <div class="employee-cell mobile-employee-cell">
                  <div class="employee-name mobile-employee-name">{{ employee.firstName }} {{ employee.lastName }}</div>
                </div>
                @for (day of days; track day) {
                  <div
                    class="shift-cell mobile-shift-cell"
                    [matMenuTriggerFor]="shiftMenu"
                    [matMenuTriggerData]="{employee: employee, date: day.dateStr}"
                    tabindex="0"
                    (click)="selectCell(employee, day.dateStr)"
                    (keydown.enter)="selectCell(employee, day.dateStr)">
                    @if (getShift(employee.id, day.dateStr); as shift) {
                      <div
                        class="shift-badge mobile-shift-badge"
                        [style.background-color]="shift.color"
                        [matTooltip]="shift.name + ' (' + shift.startTime + ' - ' + shift.endTime + ')'">
                        {{ getShortShiftName(shift.name) }}
                      </div>
                    }
                    @if (!getShift(employee.id, day.dateStr)) {
                      <div class="empty-cell">+</div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    
      <!-- Desktop Table View -->
      @if (!isMobile) {
        <div class="roster-grid-container">
          <div class="roster-grid">
            <div class="grid-header">
              <div class="employee-header">Employee</div>
              @for (day of days; track day) {
                <div class="day-header">
                  <div class="day-name">{{ day.dayName }}</div>
                  <div class="day-date">{{ formatDate(day.date) }}</div>
                </div>
              }
            </div>
            @for (employee of employees; track employee) {
              <div class="employee-row">
                <div class="employee-cell">
                  <div class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</div>
                  <div class="employee-role">{{ employee.jobRole }}</div>
                </div>
                @for (day of days; track day) {
                  <div
                    class="shift-cell"
                    [matMenuTriggerFor]="shiftMenu"
                    [matMenuTriggerData]="{employee: employee, date: day.dateStr}"
                    tabindex="0"
                    (click)="selectCell(employee, day.dateStr)"
                    (keydown.enter)="selectCell(employee, day.dateStr)">
                    @if (getShift(employee.id, day.dateStr); as shift) {
                      <div
                        class="shift-badge"
                        [style.background-color]="shift.color"
                        [matTooltip]="shift.name + ' (' + shift.startTime + ' - ' + shift.endTime + ')'">
                        {{ shift.name }}
                      </div>
                    }
                    @if (!getShift(employee.id, day.dateStr)) {
                      <div class="empty-cell">+</div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    
      <mat-menu #shiftMenu="matMenu">
        <ng-template matMenuContent let-employee="employee" let-date="date">
          @for (shiftType of shiftTypes; track shiftType) {
            <button mat-menu-item
              (click)="assignShift(employee, date, shiftType)">
              <div class="menu-shift-item">
                <div class="menu-color-box" [style.background-color]="shiftType.color"></div>
                <span>{{ shiftType.name }}</span>
                <span class="menu-time">{{ shiftType.startTime }} - {{ shiftType.endTime }}</span>
              </div>
            </button>
          }
          @if (getShift(employee.id, date)) {
            <mat-divider></mat-divider>
          }
          @if (getShift(employee.id, date)) {
            <button mat-menu-item
              (click)="removeShift(employee.id, date)"
              class="remove-shift">
              <mat-icon>delete</mat-icon>
              <span>Remove Shift</span>
            </button>
          }
        </ng-template>
      </mat-menu>
    </div>
    `,
  styles: [`
    .roster-container { padding: 20px; height: calc(100vh - 40px); display: flex; flex-direction: column; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 12px; }
    .header h1 { margin: 0; font-size: 24px; }
    .controls { display: flex; align-items: center; gap: 8px; }
    .period-label-mobile { display: none; font-weight: 500; font-size: 16px; margin-bottom: 12px; text-align: center; }
    .roster-grid-container { flex: 1; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: auto; }
    .roster-grid { min-width: max-content; }
    .grid-header { display: flex; position: sticky; top: 0; background: white; z-index: 10; border-bottom: 2px solid #e0e0e0; }
    .employee-header { width: 200px; min-width: 200px; padding: 16px; font-weight: 600; background: #f5f5f5; position: sticky; left: 0; z-index: 11; }
    .day-header { width: 120px; min-width: 120px; padding: 8px; text-align: center; background: #f5f5f5; border-left: 1px solid #e0e0e0; }
    .day-name { font-weight: 600; font-size: 14px; }
    .day-date { font-size: 12px; color: #666; margin-top: 4px; }
    .employee-row { display: flex; border-bottom: 1px solid #e0e0e0; }
    .employee-row:hover { background-color: #f9f9f9; }
    .employee-cell { width: 200px; min-width: 200px; padding: 12px 16px; position: sticky; left: 0; background: white; z-index: 5; border-right: 1px solid #e0e0e0; }
    .employee-row:hover .employee-cell { background-color: #f9f9f9; }
    .employee-name { font-weight: 500; font-size: 14px; }
    .employee-role { font-size: 12px; color: #666; margin-top: 2px; }
    .shift-cell { width: 120px; min-width: 120px; padding: 8px; border-left: 1px solid #e0e0e0; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .shift-cell:hover { background-color: #f0f0f0; }
    .shift-badge { padding: 6px 12px; border-radius: 4px; color: white; font-size: 12px; font-weight: 500; text-align: center; width: 100%; }
    .empty-cell { color: #ccc; font-size: 20px; opacity: 0; transition: opacity 0.2s; }
    .shift-cell:hover .empty-cell { opacity: 1; }
    .menu-shift-item { display: flex; align-items: center; gap: 8px; }
    .menu-color-box { width: 20px; height: 20px; border-radius: 4px; }
    .menu-time { font-size: 12px; color: #666; margin-left: auto; }
    .remove-shift { color: #f44336; }
    mat-form-field { width: 120px; }
    .mobile-grid { overflow-x: auto; overflow-y: auto; -webkit-overflow-scrolling: touch; }
    .mobile-employee-header { width: 120px !important; min-width: 120px !important; font-size: 13px; padding: 12px 8px !important; }
    .mobile-day-header { width: 65px !important; min-width: 65px !important; padding: 8px 4px !important; }
    .mobile-day-header .day-name { font-size: 12px; }
    .mobile-day-header .day-date { font-size: 10px; }
    .mobile-employee-row { min-height: 48px; }
    .mobile-employee-cell { width: 120px !important; min-width: 120px !important; padding: 8px !important; }
    .mobile-employee-name { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mobile-shift-cell { width: 65px !important; min-width: 65px !important; padding: 4px !important; min-height: 48px; }
    .mobile-shift-badge { padding: 4px 2px !important; font-size: 14px !important; font-weight: 600 !important; border-radius: 4px; }
    @media (max-width: 768px) {
      .roster-container { padding: 12px; }
      .header h1 { font-size: 20px; flex: 1 1 100%; }
      .controls { width: 100%; justify-content: center; }
      .period-label-mobile { display: block; }
      .view-select { width: 100px; }
      .today-btn { font-size: 13px; min-width: 60px; }
      mat-form-field { width: 100px; }
    }
    @media (max-width: 480px) {
      .controls { gap: 4px; }
      .view-select { width: 85px; }
      mat-form-field { width: 85px; }
      .today-btn { min-width: 50px; padding: 0 8px; }
      .mobile-employee-header, .mobile-employee-cell { width: 100px !important; min-width: 100px !important; }
      .mobile-day-header, .mobile-shift-cell { width: 60px !important; min-width: 60px !important; }
    }
  `]
})
export class RosterComponent implements OnInit {
  private dataService = inject(DataService);
  private breakpointObserver = inject(BreakpointObserver);

  viewMode: 'week' | 'month' = 'week';
  currentDate = new Date();
  days: DayColumn[] = [];
  employees: Employee[] = [];
  shiftTypes: ShiftType[] = [];
  shiftAssignments: ShiftAssignment[] = [];
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

    this.dataService.getShiftTypes().subscribe(shiftTypes => {
      this.shiftTypes = shiftTypes;
    });

    this.dataService.getShiftAssignments().subscribe(assignments => {
      this.shiftAssignments = assignments;
    });

    this.updateDays();
  }

  onViewModeChange(): void { this.updateDays(); }

  previousPeriod(): void {
    if (this.viewMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    }
    this.updateDays();
  }

  nextPeriod(): void {
    if (this.viewMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }
    this.updateDays();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.updateDays();
  }

  getPeriodLabel(): string {
    if (this.viewMode === 'week') {
      const start = this.days[0]?.date;
      const end = this.days[this.days.length - 1]?.date;
      if (start && end) {
        return `${this.formatDateLong(start)} - ${this.formatDateLong(end)}`;
      }
    } else {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return '';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateShort(date: Date): string {
    return date.getDate().toString();
  }

  formatDateLong(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getShortShiftName(shiftName: string): string {
    return shiftName.charAt(0).toUpperCase();
  }

  getShift(employeeId: string, dateStr: string): ShiftType | null {
    const assignment = this.shiftAssignments.find(a =>
      a.employeeId === employeeId && a.date === dateStr
    );
    if (assignment) {
      return this.shiftTypes.find(st => st.id === assignment.shiftTypeId) || null;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectCell(_employee: Employee, _date: string): void {}

  assignShift(employee: Employee, date: string, shiftType: ShiftType): void {
    const existing = this.shiftAssignments.find(a =>
      a.employeeId === employee.id && a.date === date
    );
    if (existing) {
      this.dataService.deleteShiftAssignment(existing.id).subscribe(() => {
        this.dataService.addShiftAssignment({
          employeeId: employee.id,
          shiftTypeId: shiftType.id,
          date: date
        }).subscribe();
      });
    } else {
      this.dataService.addShiftAssignment({
        employeeId: employee.id,
        shiftTypeId: shiftType.id,
        date: date
      }).subscribe();
    }
  }

  removeShift(employeeId: string, date: string): void {
    const assignment = this.shiftAssignments.find(a =>
      a.employeeId === employeeId && a.date === date
    );
    if (assignment) {
      this.dataService.deleteShiftAssignment(assignment.id).subscribe();
    }
  }

  private updateDays(): void {
    this.days = [];
    if (this.viewMode === 'week') {
      const date = new Date(this.currentDate);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
      for (let i = 0; i < 7; i++) {
        const current = new Date(date);
        current.setDate(date.getDate() + i);
        this.days.push({
          date: current,
          dateStr: current.toISOString().split('T')[0],
          dayName: current.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }
    } else {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const current = new Date(d);
        this.days.push({
          date: current,
          dateStr: current.toISOString().split('T')[0],
          dayName: current.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }
    }
  }
}
