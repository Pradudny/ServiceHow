import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../models/user.model';

export interface RegistrationRequest {
  userFname: string;
  userLname: string;
  department: string;
  birthDate: string;
  address: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdBy?: string;
  createdDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private registerApiUrl = '/api/registration/register-user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users-list`);
  }

  registerUser(payload: RegistrationRequest): Observable<any> {
    return this.http.post(this.registerApiUrl, payload);
  }
}
