import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleDTO, TeamDTO, Role, Feature, RoleFeatureState } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.scss'
})
export class ModuleDetailComponent implements OnInit {
  module: ModuleDTO | undefined;
  moduleId!: number;
  teams: TeamDTO[] = [];
  activeTab: 'teams' | 'roles' = 'teams';

  // Roles and Features
  roles: Role[] = [];
  features: Feature[] = [];
  roleFeatures: RoleFeatureState = {};
  loadingRoles = false;
  savingFeatures: { [roleId: number]: boolean } = {};

  showTeamModal = false;
  editingTeam: TeamDTO | null = null;
  teamForm = { tName: '', tDesc: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('moduleId'));
    this.adminService.fetchModules().subscribe({
      next: (modules) => {
        this.module = modules.find(m => m.moduleId === this.moduleId);
      },
      error: (err) => console.error('Failed to load module:', err)
    });
    this.loadTeams();
  }

  loadTeams(): void {
    this.adminService.getTeamsByModule(this.moduleId).subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error('Failed to load teams:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  switchTab(tab: 'teams' | 'roles'): void {
    this.activeTab = tab;
    if (tab === 'roles' && this.roles.length === 0) {
      this.loadRoles();
    }
  }

  // --- Teams ---

  openAddTeam(): void {
    this.editingTeam = null;
    this.teamForm = { tName: '', tDesc: '' };
    this.showTeamModal = true;
  }

  openEditTeam(event: MouseEvent, team: TeamDTO): void {
    event.stopPropagation();
    this.editingTeam = team;
    this.teamForm = { tName: team.tName, tDesc: team.tDesc };
    this.showTeamModal = true;
  }

  closeTeamModal(): void {
    this.showTeamModal = false;
    this.editingTeam = null;
  }

  saveTeam(): void {
    if (!this.teamForm.tName.trim()) return;
    if (this.editingTeam) {
      this.adminService.updateTeam(this.editingTeam.teamId, this.teamForm).subscribe({
        next: () => { this.loadTeams(); this.closeTeamModal(); },
        error: (err) => console.error('Failed to update team:', err)
      });
    } else {
      this.adminService.addTeam(this.teamForm).subscribe({
        next: () => { this.loadTeams(); this.closeTeamModal(); },
        error: (err) => console.error('Failed to add team:', err)
      });
    }
  }

  deleteTeam(event: MouseEvent, team: TeamDTO): void {
    event.stopPropagation();
    this.adminService.deleteTeam(team.teamId).subscribe({
      next: () => this.loadTeams(),
      error: (err) => console.error('Failed to delete team:', err)
    });
  }

  onTeamOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeTeamModal();
    }
  }

  // --- Roles and Features ---

  loadRoles(): void {
    this.loadingRoles = true;
    console.log('Loading roles for moduleId:', this.moduleId);
    this.adminService.getRolesFeatures(this.moduleId).subscribe({
      next: (data) => {
        console.log('Roles and features loaded:', data);
        this.roles = data.roles;
        this.features = data.features;
        this.initializeRoleFeatures();
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Failed to load roles and features:', err);
        this.loadingRoles = false;
      }
    });
  }

  initializeRoleFeatures(): void {
    this.roleFeatures = {};
    this.roles.forEach(role => {
      this.roleFeatures[role.id] = {};
      this.features.forEach(feature => {
        // Default to false, or check if role has this feature enabled from API response
        this.roleFeatures[role.id][feature.id] = false;
      });
    });
  }

  isFeatureEnabled(roleId: number, featureId: number): boolean {
    return this.roleFeatures[roleId]?.[featureId] ?? false;
  }

  toggleFeature(roleId: number, featureId: number): void {
    if (!this.roleFeatures[roleId]) {
      this.roleFeatures[roleId] = {};
    }
    this.roleFeatures[roleId][featureId] = !this.roleFeatures[roleId][featureId];
  }

  saveFeatureAuthorization(): void {
    this.roles.forEach(role => {
      const features = this.features.map(f => ({
        featureId: f.id,
        enabled: this.roleFeatures[role.id][f.id]
      }));

      this.savingFeatures[role.id] = true;
      this.adminService.authorizeFeature({ roleId: role.id, features }).subscribe({
        next: () => {
          this.savingFeatures[role.id] = false;
        },
        error: (err) => {
          console.error('Failed to authorize feature:', err);
          this.savingFeatures[role.id] = false;
        }
      });
    });
  }

  toggleRoleExpanded(roleId: number): void {
    const role = this.roles.find(r => r.id === roleId);
    if (role) {
      role.expanded = !role.expanded;
    }
  }

  isSavingRoles(): boolean {
    return Object.values(this.savingFeatures).some(v => v);
  }

}
