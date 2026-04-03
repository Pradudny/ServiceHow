import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  getIncidentTasks(incidentId: number): Observable<Task[]> {
    const params = new HttpParams().set('incidentId', incidentId.toString());
    return this.http.get<Task[]>(`${this.apiUrl}/task-list`, { params });
  }

  getTaskDetails(taskId: number): Observable<Task> {
    const params = new HttpParams().set('taskId', taskId.toString());
    return this.http.get<Task>(`${this.apiUrl}/task-details`, { params });
  }

  addTask(incidentId: number, data: CreateTaskRequest): Observable<Task> {
    const params = new HttpParams().set('incidentId', incidentId.toString());
    return this.http.post<Task>(`${this.apiUrl}/add-task`, data, { params });
  }

  updateTask(incidentId: number, taskId: number, data: CreateTaskRequest): Observable<Task> {
    const params = new HttpParams()
      .set('incidentId', incidentId.toString())
      .set('taskId', taskId.toString());
    return this.http.put<Task>(`${this.apiUrl}/update-task`, data, { params });
  }

  deleteTask(incidentId: number, taskId: number): Observable<void> {
    const params = new HttpParams()
      .set('incidentId', incidentId.toString())
      .set('taskId', taskId.toString());
    return this.http.delete<void>(`${this.apiUrl}/delete-task`, { params });
  }
}
