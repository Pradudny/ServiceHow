import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident, CreateIncidentRequest } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = '/api/incidents';

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  getIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/${id}`);
  }

  addIncident(data: CreateIncidentRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/add-incident`, data);
  }

  updateIncident(id: number, data: Partial<CreateIncidentRequest>): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, data);
  }

  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

