import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftType } from '../models/shift-type.model';

export interface CreateShiftTypeDto {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class ShiftTypeApiService {
  private url = '/api/shifttypes';
  constructor(private http: HttpClient) {}

  getAll(): Observable<ShiftType[]> {
    return this.http.get<ShiftType[]>(this.url, { withCredentials: true });
  }

  create(dto: CreateShiftTypeDto): Observable<ShiftType> {
    return this.http.post<ShiftType>(this.url, dto, { withCredentials: true });
  }

  update(id: string, dto: Partial<CreateShiftTypeDto>): Observable<ShiftType> {
    return this.http.put<ShiftType>(`${this.url}/${id}`, dto, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { withCredentials: true });
  }
}
