import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  jobRole: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private http = inject(HttpClient);

  private url = '/api/employees';

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url, { withCredentials: true });
  }

  create(dto: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.url, dto, { withCredentials: true });
  }

  update(id: string, dto: Partial<CreateEmployeeDto>): Observable<Employee> {
    return this.http.put<Employee>(`${this.url}/${id}`, dto, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { withCredentials: true });
  }
}
