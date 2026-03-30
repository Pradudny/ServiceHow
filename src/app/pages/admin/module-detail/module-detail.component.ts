import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleDTO, TeamDTO, Role, Feature, RoleFeatureState } from '../../../models/admin.model';
import { UserDTO } from '../../../models/user.model';
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
  teamForm = { tName: '', tDesc: '', roleId: 0 };

  // Team Details View
  showTeamDetailsModal = false;
  selectedTeam: TeamDTO | null = null;
  teamDetailsForm = { tName: '', tDesc: '', roleId: 0 };
  teamMembers: Array<{ userId: number; userName: string }> = [];
  loadingTeamDetails = false;
  allUsers: UserDTO[] = [];
  showAddMemberModal = false;
  selectedUserIds: number[] = [];
  addingMembers = false;
  savingTeamDetails = false;

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
    this.loadAllUsers();
    this.loadRoles(); // Load roles for the add team dropdown
  }

  loadAllUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => this.allUsers = users,
      error: (err) => console.error('Failed to load users:', err)
    });
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
    this.teamForm = { tName: '', tDesc: '', roleId: 0 };
    this.showTeamModal = true;
  }

  openEditTeam(event: MouseEvent, team: TeamDTO): void {
    event.stopPropagation();
    this.openTeamDetails(team);
  }

  closeTeamModal(): void {
    this.showTeamModal = false;
    this.editingTeam = null;
  }

  saveTeam(): void {
    if (!this.teamForm.tName.trim() || this.teamForm.roleId === 0) return;
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

  // --- Team Details ---

  openTeamDetails(team: TeamDTO): void {
    this.selectedTeam = team;
    this.teamDetailsForm = { tName: team.tName, tDesc: team.tDesc, roleId: team.roleId };
    this.loadTeamDetailsData();
    this.showTeamDetailsModal = true;
  }

  loadTeamDetailsData(): void {
    if (!this.selectedTeam) return;
    
    this.loadingTeamDetails = true;
    this.adminService.getTeamDetails(this.selectedTeam.teamId).subscribe({
      next: (teamDetails) => {
        this.selectedTeam = teamDetails;
        this.teamDetailsForm = { tName: teamDetails.tName, tDesc: teamDetails.tDesc, roleId: teamDetails.roleId };
        this.teamMembers = this.convertUserIdsToMembers(teamDetails.userIds, teamDetails.userNames);
        this.loadingTeamDetails = false;
      },
      error: (err) => {
        console.error('Failed to load team details:', err);
        this.loadingTeamDetails = false;
      }
    });
  }

  saveTeamDetailsChanges(): void {
    if (!this.selectedTeam || !this.teamDetailsForm.tName.trim() || this.teamDetailsForm.roleId === 0) return;
    
    this.savingTeamDetails = true;
    this.adminService.updateTeam(this.selectedTeam.teamId, this.teamDetailsForm).subscribe({
      next: () => {
        this.selectedTeam = { ...this.selectedTeam!, ...this.teamDetailsForm };
        this.loadTeams();
        this.savingTeamDetails = false;
        this.closeTeamDetailsModal();
      },
      error: (err) => {
        console.error('Failed to save team details:', err);
        this.savingTeamDetails = false;
      }
    });
  }

  convertUserIdsToMembers(userIds: number[], userNames: string[]): Array<{ userId: number; userName: string }> {
    return userIds.map((id, index) => ({
      userId: id,
      userName: userNames[index] || 'Unknown'
    }));
  }

  closeTeamDetailsModal(): void {
    this.showTeamDetailsModal = false;
    this.selectedTeam = null;
    this.teamDetailsForm = { tName: '', tDesc: '', roleId: 0 };
    this.teamMembers = [];
    this.showAddMemberModal = false;
    this.selectedUserIds = [];
  }

  onTeamDetailsOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeTeamDetailsModal();
    }
  }

  // --- Add Member to Team ---

  openAddMemberModal(): void {
    this.selectedUserIds = [];
    this.showAddMemberModal = true;
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
    this.selectedUserIds = [];
  }

  getAvailableMembersForAddition(): UserDTO[] {
    const existingUserIds = new Set(this.selectedTeam?.userIds || []);
    return this.allUsers.filter(user => !existingUserIds.has(user.userId));
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  addMembersToTeam(): void {
    if (!this.selectedTeam || this.selectedUserIds.length === 0) return;
    
    this.addingMembers = true;
    this.adminService.addTeamMembers(this.selectedTeam.teamId, this.selectedUserIds).subscribe({
      next: () => {
        this.selectedTeam = this.selectedTeam!;
        this.loadTeamDetailsData();
        this.closeAddMemberModal();
        this.addingMembers = false;
      },
      error: (err) => {
        console.error('Failed to add members:', err);
        this.addingMembers = false;
      }
    });
  }

  // --- Remove Member from Team ---

  removeMemberFromTeam(member: { userId: number; userName: string }): void {
    if (!this.selectedTeam || !confirm(`Remove ${member.userName} from this team?`)) return;
    
    this.adminService.removeTeamMembers(this.selectedTeam.teamId, [member.userId]).subscribe({
      next: () => this.loadTeamDetailsData(),
      error: (err) => console.error('Failed to remove member:', err)
    });
  }

  getUserFullName(user: UserDTO): string {
    return `${user.userFname} ${user.userLname}` || 'Unknown User';
  }

}
