import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { ShiftType } from '../models/shift-type.model';
import { ShiftAssignment } from '../models/shift-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private employees$ = new BehaviorSubject<Employee[]>([]);
  private shiftTypes$ = new BehaviorSubject<ShiftType[]>([]);
  private shiftAssignments$ = new BehaviorSubject<ShiftAssignment[]>([]);

  constructor() {
    this.initializeDummyData();
  }

  // Employees
  getEmployees(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }

  addEmployee(employee: Employee): void {
    const employees = this.employees$.value;
    this.employees$.next([...employees, employee]);
  }

  updateEmployee(employee: Employee): void {
    const employees = this.employees$.value.map(e => 
      e.id === employee.id ? employee : e
    );
    this.employees$.next(employees);
  }

  deleteEmployee(id: string): void {
    const employees = this.employees$.value.filter(e => e.id !== id);
    this.employees$.next(employees);
    // Also delete associated assignments
    const assignments = this.shiftAssignments$.value.filter(a => a.employeeId !== id);
    this.shiftAssignments$.next(assignments);
  }

  // Shift Types
  getShiftTypes(): Observable<ShiftType[]> {
    return this.shiftTypes$.asObservable();
  }

  addShiftType(shiftType: ShiftType): void {
    const shiftTypes = this.shiftTypes$.value;
    this.shiftTypes$.next([...shiftTypes, shiftType]);
  }

  updateShiftType(shiftType: ShiftType): void {
    const shiftTypes = this.shiftTypes$.value.map(st => 
      st.id === shiftType.id ? shiftType : st
    );
    this.shiftTypes$.next(shiftTypes);
  }

  deleteShiftType(id: string): void {
    const shiftTypes = this.shiftTypes$.value.filter(st => st.id !== id);
    this.shiftTypes$.next(shiftTypes);
    // Also delete associated assignments
    const assignments = this.shiftAssignments$.value.filter(a => a.shiftTypeId !== id);
    this.shiftAssignments$.next(assignments);
  }

  // Shift Assignments
  getShiftAssignments(): Observable<ShiftAssignment[]> {
    return this.shiftAssignments$.asObservable();
  }

  addShiftAssignment(assignment: ShiftAssignment): void {
    const assignments = this.shiftAssignments$.value;
    this.shiftAssignments$.next([...assignments, assignment]);
  }

  deleteShiftAssignment(id: string): void {
    const assignments = this.shiftAssignments$.value.filter(a => a.id !== id);
    this.shiftAssignments$.next(assignments);
  }

  getShiftAssignmentsByDate(date: string): ShiftAssignment[] {
    return this.shiftAssignments$.value.filter(a => a.date === date);
  }

  getShiftAssignmentByEmployeeAndDate(employeeId: string, date: string): ShiftAssignment | undefined {
    return this.shiftAssignments$.value.find(a => 
      a.employeeId === employeeId && a.date === date
    );
  }

  private initializeDummyData(): void {
    // Initialize shift types
    const shiftTypes: ShiftType[] = [
      { id: '1', name: 'Early', startTime: '06:00', endTime: '14:00', color: '#4CAF50' },
      { id: '2', name: 'Late', startTime: '14:00', endTime: '22:00', color: '#2196F3' },
      { id: '3', name: 'Night', startTime: '22:00', endTime: '06:00', color: '#9C27B0' },
      { id: '4', name: 'Day', startTime: '08:00', endTime: '17:00', color: '#FF9800' },
    ];
    this.shiftTypes$.next(shiftTypes);

    // Initialize 50 employees
    const roles = ['Nurse', 'Doctor', 'Assistant', 'Technician', 'Administrator'];
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
                        'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
                        'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
                        'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
                        'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
                        'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
                        'Edward', 'Deborah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
                       'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
                       'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
                       'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
                       'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                       'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
                       'Carter', 'Roberts'];

    const employees: Employee[] = [];
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i];
      const role = roles[i % roles.length];
      employees.push({
        id: `emp${i + 1}`,
        name: `${firstName} ${lastName}`,
        role: role,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
        phone: `+1-555-${String(1000 + i).padStart(4, '0')}`
      });
    }
    this.employees$.next(employees);

    // Initialize some shift assignments for the current week
    const today = new Date();
    const assignments: ShiftAssignment[] = [];
    let assignmentId = 1;

    // Assign shifts for the next 7 days for random employees
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      // Assign 15-20 employees per day
      const employeesForDay = Math.floor(Math.random() * 6) + 15;
      const shuffled = [...employees].sort(() => Math.random() - 0.5);

      for (let i = 0; i < employeesForDay; i++) {
        const employee = shuffled[i];
        const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
        assignments.push({
          id: `assign${assignmentId++}`,
          employeeId: employee.id,
          shiftTypeId: shiftType.id,
          date: dateStr
        });
      }
    }
    this.shiftAssignments$.next(assignments);
  }
}
