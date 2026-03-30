import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppModule, ModuleDTO, TeamDTO, Team, Role, User, RolesFeaturesResponse, AuthorizeFeaturePayload } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userApiUrl = '/api/users';
  private modulesApiUrl = '/api/modules';
  private teamApiUrl = '/api/team';
  private rolesApiUrl = '/api/roles';

  

  constructor(private http: HttpClient) {}

  fetchModules(): Observable<ModuleDTO[]> {
    return this.http.get<ModuleDTO[]>(this.modulesApiUrl);
  }



  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}/users-list`);
  }

  addUser(data: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.userApiUrl}/add-user`, data);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    const params = new HttpParams().set('userId', id);
    return this.http.put<User>(`${this.userApiUrl}/update-user`, data, { params });
  }

  deleteUser(id: number): Observable<void> {
    const params = new HttpParams().set('userId', id);
    return this.http.delete<void>(`${this.userApiUrl}/delete-user`, { params });
  }

  getTeamsByModule(moduleId: number): Observable<TeamDTO[]> {
    const params = new HttpParams().set('moduleId', moduleId);
    return this.http.get<TeamDTO[]>(`${this.teamApiUrl}/teams-by-module`, { params });
  }

  getTeamDetails(teamId: number): Observable<TeamDTO> {
    const params = new HttpParams().set('teamId', teamId);
    return this.http.get<TeamDTO>(`${this.teamApiUrl}/team-details`, { params });
  }

  addTeam(data: Partial<TeamDTO>): Observable<TeamDTO> {
    return this.http.post<TeamDTO>(`${this.teamApiUrl}/add-team`, data);
  }

  updateTeam(teamId: number, data: Partial<TeamDTO>): Observable<TeamDTO> {
    const params = new HttpParams().set('teamId', teamId);
    return this.http.put<TeamDTO>(`${this.teamApiUrl}/update-team`, data, { params });
  }

  addTeamMembers(teamId: number, userIds: number[]): Observable<TeamDTO> {
    const params = new HttpParams().set('teamId', teamId);
    return this.http.put<TeamDTO>(`${this.teamApiUrl}/add-team-members`, userIds, { params });
  }

  removeTeamMembers(teamId: number, userIds: number[]): Observable<TeamDTO> {
    const params = new HttpParams().set('teamId', teamId);
    return this.http.put<TeamDTO>(`${this.teamApiUrl}/remove-team-members`, userIds, { params });
  }

  deleteTeam(teamId: number): Observable<void> {
    const params = new HttpParams().set('teamId', teamId);
    return this.http.delete<void>(`${this.teamApiUrl}/delete-team`, { params });
  }

  // toggleFeature(moduleId: string, roleId: number, featureId: number): void {
  //   const mod = this.modules.find(m => m.id === moduleId);
  //   const role = mod?.roles.find(r => r.id === roleId);
  //   const feature = role?.features?.find(f => f.id === featureId);
  //   if (feature) {
  //     feature.enabled = !feature.enabled;
  //   }
  // }

  // getAllRoleNames(): string[] {
  //   const names = new Set<string>();
  //   this.modules.forEach(m => m.roles.forEach(r => names.add(r.name)));
  //   return Array.from(names);
  // }

  getRolesFeatures(moduleId: number): Observable<RolesFeaturesResponse> {
    const params = new HttpParams().set('moduleId', moduleId);
    return this.http.get<RolesFeaturesResponse>(`${this.rolesApiUrl}/roles-features`, { params });
  }

  authorizeFeature(payload: AuthorizeFeaturePayload): Observable<any> {
    return this.http.post(`${this.rolesApiUrl}/authorize-feature`, payload);
  }
}
