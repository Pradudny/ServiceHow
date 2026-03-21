import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  private modules: AppModule[] = [
    {
      id: 'incident-management',
      name: 'Incident Management',
      teams: [
        { id: 1, name: 'L1 Support', description: 'First level support team handling initial triage' },
        { id: 2, name: 'L2 Support', description: 'Second level support for escalated issues' },
        { id: 3, name: 'Infrastructure', description: 'Infrastructure and DevOps team' }
      ],
      roles: [
        {
          id: 1,
          name: 'Incident Viewer',
          features: [
            { id: 1, name: 'View Incidents', enabled: true },
            { id: 2, name: 'Create Incidents', enabled: false },
            { id: 3, name: 'Edit Incidents', enabled: false },
            { id: 4, name: 'Delete Incidents', enabled: false },
            { id: 5, name: 'Complete Incidents', enabled: false }
          ]
        },
        {
          id: 2,
          name: 'Incident Manager',
          features: [
            { id: 1, name: 'View Incidents', enabled: true },
            { id: 2, name: 'Create Incidents', enabled: true },
            { id: 3, name: 'Edit Incidents', enabled: true },
            { id: 4, name: 'Delete Incidents', enabled: false },
            { id: 5, name: 'Complete Incidents', enabled: true }
          ]
        },
        {
          id: 3,
          name: 'Incident Admin',
          features: [
            { id: 1, name: 'View Incidents', enabled: true },
            { id: 2, name: 'Create Incidents', enabled: true },
            { id: 3, name: 'Edit Incidents', enabled: true },
            { id: 4, name: 'Delete Incidents', enabled: true },
            { id: 5, name: 'Complete Incidents', enabled: true }
          ]
        }
      ]
    },
    {
      id: 'admin',
      name: 'Admin',
      teams: [
        { id: 4, name: 'Platform Admins', description: 'Platform administration team' },
        { id: 5, name: 'Security Team', description: 'Security and compliance team' }
      ],
      roles: [
        {
          id: 4,
          name: 'Admin Viewer',
          features: [
            { id: 6, name: 'View Teams', enabled: true },
            { id: 7, name: 'Manage Teams', enabled: false },
            { id: 8, name: 'View Roles', enabled: true },
            { id: 9, name: 'Manage Roles', enabled: false },
            { id: 10, name: 'View Users', enabled: true },
            { id: 11, name: 'Manage Users', enabled: false }
          ]
        },
        {
          id: 5,
          name: 'Super Admin',
          features: [
            { id: 6, name: 'View Teams', enabled: true },
            { id: 7, name: 'Manage Teams', enabled: true },
            { id: 8, name: 'View Roles', enabled: true },
            { id: 9, name: 'Manage Roles', enabled: true },
            { id: 10, name: 'View Users', enabled: true },
            { id: 11, name: 'Manage Users', enabled: true }
          ]
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  fetchModules(): Observable<ModuleDTO[]> {
    return this.http.get<ModuleDTO[]>(this.modulesApiUrl);
  }

  getModules(): AppModule[] {
    return this.modules;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userApiUrl);
  }

  addUser(data: Partial<User>): Observable<User> {
    return this.http.post<User>(this.userApiUrl, data);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.userApiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userApiUrl}/${id}`);
  }

  getTeamsByModule(moduleId: number): Observable<TeamDTO[]> {
    return this.http.get<TeamDTO[]>(`${this.teamApiUrl}/${moduleId}`);
  }

  getTeamDetails(teamId: number): Observable<TeamDTO> {
    return this.http.get<TeamDTO>(`${this.teamApiUrl}/team-details/${teamId}`);
  }

  addTeam(data: Partial<TeamDTO>): Observable<TeamDTO> {
    return this.http.post<TeamDTO>(`${this.teamApiUrl}/add-team`, data);
  }

  updateTeam(teamId: number, data: Partial<TeamDTO>): Observable<TeamDTO> {
    return this.http.put<TeamDTO>(`${this.teamApiUrl}/update/${teamId}`, data);
  }

  addTeamMembers(teamId: number, userIds: number[]): Observable<TeamDTO> {
    return this.http.put<TeamDTO>(`${this.teamApiUrl}/add-members/${teamId}`, userIds);
  }

  removeTeamMembers(teamId: number, userIds: number[]): Observable<TeamDTO> {
    return this.http.put<TeamDTO>(`${this.teamApiUrl}/remove-members/${teamId}`, userIds);
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.teamApiUrl}/delete/${teamId}`);
  }

  toggleFeature(moduleId: string, roleId: number, featureId: number): void {
    const mod = this.modules.find(m => m.id === moduleId);
    const role = mod?.roles.find(r => r.id === roleId);
    const feature = role?.features?.find(f => f.id === featureId);
    if (feature) {
      feature.enabled = !feature.enabled;
    }
  }

  getAllRoleNames(): string[] {
    const names = new Set<string>();
    this.modules.forEach(m => m.roles.forEach(r => names.add(r.name)));
    return Array.from(names);
  }

  getRolesFeatures(moduleId: number): Observable<RolesFeaturesResponse> {
    return this.http.get<RolesFeaturesResponse>(`${this.rolesApiUrl}/roles-features/${moduleId}`);
  }

  authorizeFeature(payload: AuthorizeFeaturePayload): Observable<any> {
    return this.http.post(`${this.rolesApiUrl}/authorize-feature`, payload);
  }
}
