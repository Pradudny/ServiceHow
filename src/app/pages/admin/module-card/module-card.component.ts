import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModuleDTO, TeamDTO } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-module-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-card.component.html',
  styleUrl: './module-card.component.scss'
})
export class ModuleCardComponent implements OnInit {
  @Input() module!: ModuleDTO;

  teams: TeamDTO[] = [];
  activeTab: 'teams' | 'roles' = 'teams';

  showTeamModal = false;
  editingTeam: TeamDTO | null = null;
  teamForm = { tName: '', tDesc: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.adminService.getTeamsByModule(this.module.moduleId).subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error('Failed to load teams:', err)
    });
  }

  switchTab(tab: 'teams' | 'roles'): void {
    this.activeTab = tab;
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


}
