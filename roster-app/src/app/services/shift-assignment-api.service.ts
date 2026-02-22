import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftAssignment } from '../models/shift-assignment.model';

export interface CreateShiftAssignmentDto {
  employeeId: string;
  shiftTypeId: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ShiftAssignmentApiService {
  private url = '/api/shiftassignments';
  constructor(private http: HttpClient) {}

  getAll(): Observable<ShiftAssignment[]> {
    return this.http.get<ShiftAssignment[]>(this.url, { withCredentials: true });
  }

  getByDate(date: string): Observable<ShiftAssignment[]> {
    return this.http.get<ShiftAssignment[]>(`${this.url}/by-date/${date}`, { withCredentials: true });
  }

  create(dto: CreateShiftAssignmentDto): Observable<ShiftAssignment> {
    return this.http.post<ShiftAssignment>(this.url, dto, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { withCredentials: true });
  }
}
