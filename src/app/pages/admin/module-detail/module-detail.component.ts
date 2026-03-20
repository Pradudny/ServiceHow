import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppModule, Team, Role } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.scss'
})
export class ModuleDetailComponent implements OnInit {
  module: AppModule | undefined;
  activeTab: 'teams' | 'roles' = 'teams';

  showTeamModal = false;
  editingTeam: Team | null = null;
  teamForm = { name: '', description: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('moduleId');
    this.module = this.adminService.getModules().find(m => m.id === id);
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

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
    if (!this.module || !this.teamForm.name.trim()) return;
    if (this.editingTeam) {
      this.adminService.updateTeam(this.module.id, this.editingTeam.id, this.teamForm);
    } else {
      this.adminService.addTeam(this.module.id, this.teamForm);
    }
    this.closeTeamModal();
  }

  deleteTeam(event: MouseEvent, team: Team): void {
    event.stopPropagation();
    if (!this.module) return;
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
    if (!this.module) return;
    this.adminService.toggleFeature(this.module.id, roleId, featureId);
  }
}
