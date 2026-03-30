import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Incident, CreateIncidentRequest } from '../../../models/incident.model';
import { IncidentService } from '../../../services/incident.service';
import { CreateIncidentModalComponent } from '../create-incident-modal/create-incident-modal.component';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, CreateIncidentModalComponent],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent implements OnInit {
  incidents: Incident[] = [];
  showModal = false;
  editingIncident: Incident | null = null;

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentService.getIncidents().subscribe({
      next: (data) => this.incidents = data,
      error: (err) => console.error('Failed to load incidents:', err)
    });
  }

  viewIncident(id: number): void {
    this.router.navigate(['/incident-management', id]);
  }

  createIncident(): void {
    this.editingIncident = null;
    this.showModal = true;
  }

  editIncident(event: MouseEvent, incident: Incident): void {
    event.stopPropagation();
    this.editingIncident = incident;
    this.showModal = true;
  }

  onModalClose(): void {
    this.showModal = false;
    this.editingIncident = null;
  }

  onModalSave(data: CreateIncidentRequest): void {
    if (this.editingIncident) {
      this.incidentService.updateIncident(this.editingIncident.incidentId, data).subscribe({
        next: () => {
          this.loadIncidents();
          this.showModal = false;
          this.editingIncident = null;
        },
        error: (err) => console.error('Failed to update incident:', err)
      });
    } else {
      this.incidentService.addIncident(data).subscribe({
        next: () => {
          this.loadIncidents();
          this.showModal = false;
          this.editingIncident = null;
        },
        error: (err) => console.error('Failed to create incident:', err)
      });
    }
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/[_\s]+/g, '-');
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'OPEN': 'Open',
      'IN_PROGRESS': 'In Progress',
      'ON_HOLD': 'On Hold',
      'RESOLVED': 'Resolved',
      'CLOSED': 'Closed'
    };
    return labels[status] || status;
  }

  deleteIncident(event: MouseEvent, incident: Incident): void {
    event.stopPropagation();
    const confirmed = window.confirm(`Delete incident "${incident.title}"?`);
    if (!confirmed) {
      return;
    }

    this.incidentService.deleteIncident(incident.incidentId).subscribe({
      next: () => this.loadIncidents(),
      error: (err) => console.error('Failed to delete incident:', err)
    });
  }
}
