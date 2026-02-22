import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { ShiftType } from '../models/shift-type.model';
import { ShiftAssignment } from '../models/shift-assignment.model';
import { EmployeeApiService, CreateEmployeeDto } from './employee-api.service';
import { ShiftTypeApiService, CreateShiftTypeDto } from './shift-type-api.service';
import { ShiftAssignmentApiService, CreateShiftAssignmentDto } from './shift-assignment-api.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private employees$ = new BehaviorSubject<Employee[]>([]);
  private shiftTypes$ = new BehaviorSubject<ShiftType[]>([]);
  private shiftAssignments$ = new BehaviorSubject<ShiftAssignment[]>([]);

  constructor(
    private employeeApi: EmployeeApiService,
    private shiftTypeApi: ShiftTypeApiService,
    private shiftAssignmentApi: ShiftAssignmentApiService
  ) {}

  loadAll(): void {
    this.employeeApi.getAll().subscribe(data => this.employees$.next(data));
    this.shiftTypeApi.getAll().subscribe(data => this.shiftTypes$.next(data));
    this.shiftAssignmentApi.getAll().subscribe(data => this.shiftAssignments$.next(data));
  }

  // Employees
  getEmployees(): Observable<Employee[]> { return this.employees$.asObservable(); }

  addEmployee(dto: CreateEmployeeDto): Observable<Employee> {
    return this.employeeApi.create(dto).pipe(
      tap(e => this.employees$.next([...this.employees$.value, e]))
    );
  }

  updateEmployee(id: string, dto: Partial<CreateEmployeeDto>): Observable<Employee> {
    return this.employeeApi.update(id, dto).pipe(
      tap(updated => this.employees$.next(this.employees$.value.map(e => e.id === id ? updated : e)))
    );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.employeeApi.delete(id).pipe(
      tap(() => {
        this.employees$.next(this.employees$.value.filter(e => e.id !== id));
        this.shiftAssignments$.next(this.shiftAssignments$.value.filter(a => a.employeeId !== id));
      })
    );
  }

  // Shift Types
  getShiftTypes(): Observable<ShiftType[]> { return this.shiftTypes$.asObservable(); }

  addShiftType(dto: CreateShiftTypeDto): Observable<ShiftType> {
    return this.shiftTypeApi.create(dto).pipe(
      tap(st => this.shiftTypes$.next([...this.shiftTypes$.value, st]))
    );
  }

  updateShiftType(id: string, dto: Partial<CreateShiftTypeDto>): Observable<ShiftType> {
    return this.shiftTypeApi.update(id, dto).pipe(
      tap(updated => this.shiftTypes$.next(this.shiftTypes$.value.map(st => st.id === id ? updated : st)))
    );
  }

  deleteShiftType(id: string): Observable<void> {
    return this.shiftTypeApi.delete(id).pipe(
      tap(() => {
        this.shiftTypes$.next(this.shiftTypes$.value.filter(st => st.id !== id));
        this.shiftAssignments$.next(this.shiftAssignments$.value.filter(a => a.shiftTypeId !== id));
      })
    );
  }

  // Shift Assignments
  getShiftAssignments(): Observable<ShiftAssignment[]> { return this.shiftAssignments$.asObservable(); }

  addShiftAssignment(dto: CreateShiftAssignmentDto): Observable<ShiftAssignment> {
    return this.shiftAssignmentApi.create(dto).pipe(
      tap(a => this.shiftAssignments$.next([...this.shiftAssignments$.value, a]))
    );
  }

  deleteShiftAssignment(id: string): Observable<void> {
    return this.shiftAssignmentApi.delete(id).pipe(
      tap(() => this.shiftAssignments$.next(this.shiftAssignments$.value.filter(a => a.id !== id)))
    );
  }

  getShiftAssignmentsByDate(date: string): ShiftAssignment[] {
    return this.shiftAssignments$.value.filter(a => a.date === date);
  }

  getShiftAssignmentByEmployeeAndDate(employeeId: string, date: string): ShiftAssignment | undefined {
    return this.shiftAssignments$.value.find(a => a.employeeId === employeeId && a.date === date);
  }
}
