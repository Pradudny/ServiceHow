import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppModule, Team, Role } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-module-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-card.component.html',
  styleUrl: './module-card.component.scss'
})
export class ModuleCardComponent {
  @Input() module!: AppModule;

  activeTab: 'teams' | 'roles' = 'teams';

  showTeamModal = false;
  editingTeam: Team | null = null;
  teamForm = { name: '', description: '' };

  constructor(private adminService: AdminService) {}

  switchTab(tab: 'teams' | 'roles'): void {
    this.activeTab = tab;
  }

  // --- Teams ---

  openAddTeam(): void {
    this.editingTeam = null;
    this.teamForm = { name: '', description: '' };
    this.showTeamModal = true;
  }

  openEditTeam(event: MouseEvent, team: Team): void {
    event.stopPropagation();
    this.editingTeam = team;
    this.teamForm = { name: team.name, description: team.description };
    this.showTeamModal = true;
  }

  closeTeamModal(): void {
    this.showTeamModal = false;
    this.editingTeam = null;
  }

  saveTeam(): void {
    if (!this.teamForm.name.trim()) return;
    if (this.editingTeam) {
      this.adminService.updateTeam(this.module.id, this.editingTeam.id, this.teamForm);
    } else {
      this.adminService.addTeam(this.module.id, this.teamForm);
    }
    this.closeTeamModal();
  }

  deleteTeam(event: MouseEvent, team: Team): void {
    event.stopPropagation();
    this.adminService.deleteTeam(this.module.id, team.id);
  }

  onTeamOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeTeamModal();
    }
  }

  // --- Roles ---

  toggleRole(role: Role): void {
    role.expanded = !role.expanded;
  }

  onFeatureToggle(roleId: number, featureId: number): void {
    this.adminService.toggleFeature(this.module.id, roleId, featureId);
  }
}
