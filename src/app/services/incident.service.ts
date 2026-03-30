import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident, CreateIncidentRequest } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = '/api/incidents';

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    console.log('Fetching incidents from API'+`: ${this.apiUrl}/incident-list`);
    return this.http.get<Incident[]>(`${this.apiUrl}/incident-list`);
  }

  getIncidentById(incidentId: number): Observable<Incident> {
    const params = new HttpParams().set('incidentId', incidentId.toString());
    return this.http.get<Incident>(`${this.apiUrl}/incident-details`, { params });
    
     return this.http.get<Incident>(`${this.apiUrl}/incident-details`, { params: { id: incidentId.toString() } });
  }

  addIncident(data: CreateIncidentRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/add-incident`, data);
  }

  updateIncident(id: number, data: Partial<CreateIncidentRequest>): Observable<Incident> {
    const params = new HttpParams().set('incidentId', id.toString());
    return this.http.put<Incident>(`${this.apiUrl}/update-incident`, data, { params });
  }

  deleteIncident(id: number): Observable<void> {
    const params = new HttpParams().set('incidentId', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/delete-incident`, { params });
  }
}

